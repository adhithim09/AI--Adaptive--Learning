import { Course } from "../models/Course.js";
import { httpError } from "../utils/httpError.js";
import { generateCourseFromLLM } from "../utils/llmClient.js";

function categorizeScore(score) {
  if (score < 50) return "weak";
  if (score <= 75) return "medium";
  return "strong";
}

function normalizeAssessmentResults(assessmentResults) {
  if (!assessmentResults) return [];

  const source = Array.isArray(assessmentResults)
    ? assessmentResults
    : Array.isArray(assessmentResults.concepts)
      ? assessmentResults.concepts
      : [];

  return source
    .map((item) => {
      const concept = item.concept || item.name;
      const score = Number(item.score);
      if (!concept || Number.isNaN(score)) return null;
      return {
        concept: String(concept).trim(),
        score,
        category: categorizeScore(score)
      };
    })
    .filter(Boolean);
}

export async function generateCourse(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    const { subject, assessmentResults } = req.body || {};

    if (!userId) return next(httpError(401, "Unauthorized"));
    if (!subject || typeof subject !== "string") return next(httpError(400, "Missing subject"));
    if (!assessmentResults) return next(httpError(400, "Missing assessmentResults"));
    if (!process.env.XAI_API_KEY) return next(httpError(500, "XAI_API_KEY is missing"));

    const categorizedResults = normalizeAssessmentResults(assessmentResults);
    if (!categorizedResults.length) {
      return next(httpError(400, "assessmentResults must include concept/name and score"));
    }

    const prompt = `
Generate a personalized course for this subject: ${subject.trim()}

Assessment results (categorized):
${JSON.stringify(categorizedResults, null, 2)}

Hard requirements:
1) Return strictly valid JSON only. Do not include markdown, prose, notes, or explanations.
2) If your draft is not valid JSON, regenerate internally and output only valid JSON.
3) Build a logical progression from foundational topics to advanced topics.
4) Include prerequisites before any advanced module that depends on them.
5) Keep modules well-structured, concise, and pedagogically ordered.
6) Focus significantly more on weak areas, medium depth for medium areas, and concise reinforcement for strong areas.

Output schema (must match exactly):
{
  "title": "string",
  "description": "string",
  "modules": [
    {
      "title": "string",
      "level": "weak|medium|strong",
      "estimatedTime": "string",
      "concepts": ["string"]
    }
  ]
}
`;

    let parsed;
    try {
      parsed = await generateCourseFromLLM(prompt);
    } catch (llmErr) {
      return next(httpError(502, llmErr.message || "Failed to generate course from LLM"));
    }

    const course = await Course.create({
      userId,
      subject: subject.trim(),
      title: parsed.title,
      description: parsed.description,
      modules: parsed.modules
    });

    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
}

export async function getMyCourse(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return next(httpError(401, "Unauthorized"));

    const course = await Course.findOne({ userId }).sort({ createdAt: -1 });
    if (!course) return next(httpError(404, "No course found for this user"));

    res.json(course);
  } catch (e) {
    next(e);
  }
}
