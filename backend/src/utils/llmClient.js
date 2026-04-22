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

function getRawLLMResponse(completion) {
  const content = completion?.choices?.[0]?.message?.content;

  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    const textParts = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .filter(Boolean);
    return textParts.join("\n").trim();
  }

  if (content && typeof content === "object") {
    return JSON.stringify(content);
  }

  return "";
}

export async function generateCourseFromLLM(prompt) {
  if (!process.env.XAI_API_KEY) {
    throw new Error("XAI_API_KEY is missing");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-2-latest",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an adaptive curriculum designer. Always return strictly valid JSON that matches the required schema, with no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("xAI chat completion request failed:", errorText);
    throw new Error("Failed to generate course from xAI");
  }

  const completion = await response.json();
  const rawResponse = getRawLLMResponse(completion);

  try {
    return JSON.parse(extractJsonPayload(rawResponse));
  } catch {
    console.error("Failed to parse LLM response for course generation.");
    console.error("Raw LLM response:", rawResponse);
    console.error("Raw completion payload:", completion);
    throw new Error("Invalid JSON response from course generator");
  }
}
