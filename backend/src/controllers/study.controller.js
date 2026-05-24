import { httpError } from "../utils/httpError.js";
import { generateCourseFromLLM } from "../utils/llmClient.js";

export async function generateStudyMaterials(req, res, next) {
  try {
    const { subject } = req.query;
    if (!subject) return next(httpError(400, "Subject is required"));

    const prompt = `
Generate study materials for subject: "${subject}"

Include both flashcards and a concept mind map in one response.

Flashcards:
- Generate 5–8 flashcards
- Each flashcard must have "question" and "answer"

Mind map:
- Simple concept mind map with logical layout
- Each node: "id", "data": { "label": "..." }, "position": { "x": number, "y": number }
- Each edge: "id", "source", "target", "animated": true
- Use unique edge ids and valid source/target node ids
- Suggested node style (optional on nodes): background #020617, color #e2e8f0, border 1px solid #1e293b

Return ONLY valid JSON:
{
  "flashcards": [
    { "question": "", "answer": "" }
  ],
  "nodes": [
    { "id": "1", "data": { "label": "Main Topic" }, "position": { "x": 0, "y": 0 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ]
}
    `;

    const data = await generateCourseFromLLM(prompt);

    res.json({
      flashcards: data.flashcards || [],
      mindmap: {
        nodes: data.nodes || [],
        edges: data.edges || []
      }
    });
  } catch (e) {
    console.error("Study Material Generation Error:", e.message);
    next(e);
  }
}
