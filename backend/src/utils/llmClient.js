import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJsonPayload(raw) {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

export async function generateAssessmentQuestions(subject) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing");

  const prompt = `
Generate 10 multiple-choice questions (MCQs) for the subject: "${subject}".
Each question must include:
- question: The question text.
- options: An array of 4 strings.
- answer: The correct option string.
- concept: The specific concept name being tested.

Return ONLY strictly valid JSON in the following format, with no markdown code blocks, no prose, and no explanation:
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "concept": "..."
    }
  ]
}
  `;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices?.[0]?.message?.content || "";
    const jsonStr = extractJsonPayload(raw);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Groq API Error:", err.response?.data || err.message);
    throw new Error("Failed to generate assessment questions");
  }
}

export async function generateCourseFromLLM(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    console.log("Gemini raw response:", raw);

    const jsonStr = extractJsonPayload(raw);
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("Gemini JSON Parse Error:", parseErr.message);
      console.error("Raw response content:", raw);
      throw new Error("Failed to parse course structure from Gemini response");
    }
  } catch (err) {
    console.error("Gemini API Error (Course):", err.message);
    throw new Error("Failed to generate course from Gemini");
  }
}
