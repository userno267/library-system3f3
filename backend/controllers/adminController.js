// controllers/adminController.js
import dotenv from "dotenv";
dotenv.config();

import { Mistral } from "@mistralai/mistralai";

const API_KEY = process.env.MISTRAL_API_KEY;
if (!API_KEY) {
  console.warn("MISTRAL_API_KEY not set — AI endpoints will fail until you set it in .env");
}

const client = new Mistral({ apiKey: API_KEY });

// Helper to extract text from SDK response (robust)
function extractText(response) {
  // SDK types can vary; try common locations
  if (!response) return null;
  // 1) response.output_text (some samples)
  if (response.output_text) return response.output_text;
  // 2) response.outputs[0].content?.text[0].text
  if (response.outputs && response.outputs[0] && response.outputs[0].content) {
    const cont = response.outputs[0].content;
    if (cont.text && Array.isArray(cont.text) && cont.text[0] && cont.text[0].text) {
      return cont.text[0].text;
    }
  }
  // 3) response.result?.output_text
  if (response.result && response.result.output_text) return response.result.output_text;
  // fallback: stringify entire response
  return JSON.stringify(response, null, 2);
}

export const aiInsights = async (req, res) => {
  // Require admin auth: assume req.user exists from your auth middleware
  const requester = req.user;
  if (!requester || requester.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Pull payload from body (frontend sent snapshot)
    const { stats = {}, top_books = [], categories = [], borrows = [] } = req.body;

    // Build a compact prompt describing data and asking clear questions
    const prompt = `
You are an analytics assistant for a library admin. I will provide library data in JSON. 
Produce a concise plain-text analysis with:
1) short summary (2-4 sentences) of current library state (counts, eBook share, borrowed trends),
2) 4 prioritized recommendations for the admin (e.g., stock adjustments, promotion ideas, category rebalancing, archiving),
3) list top 5 books by borrow frequency (if determinable) and which categories look understocked,
4) one operational KPI to watch (with why and suggested threshold),
Return JSON-like plaintext under headings: SUMMARY, RECOMMENDATIONS, TOP_BOOKS, KPI.
Here is the data:

STATS:
${JSON.stringify(stats)}

CATEGORIES (sample):
${JSON.stringify(categories.slice(0, 50))}

TOP_BOOKS (sample):
${JSON.stringify(top_books.slice(0, 200))}

BORROW_RECORDS (sample):
${JSON.stringify(borrows.slice(0, 500))}
`;

    // Call Mistral SDK: use a conversation or "beta.conversations.start" depending on SDK version
    // We'll use the beta.conversations.start pattern shown in Mistral sample
    const response = await client.beta.conversations.start({
      model: "mistral-medium-latest", // adjust model if you have access to another
      inputs: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt
            }
          ]
        }
      ],
      temperature: 0.2,
      maxTokens: 800
    });

    const extracted = extractText(response);
    if (!extracted) {
      return res.status(500).json({ success: false, error: "No output_text from Mistral API", raw: response });
    }

    // Try to parse into sections if the assistant returned sections
    const result = { success: true, summary: null, recommendations: null, top_books: null, kpi: null, raw: extracted };

    // naive parse by headings
    const byHeading = {};
    const lines = extracted.split(/\r?\n/);
    let current = "raw";
    byHeading[current] = [];
    for (let line of lines) {
      const h = line.match(/^\s*(SUMMARY|RECOMMENDATIONS|TOP_BOOKS|KPI)\s*[:\-]?/i);
      if (h) {
        current = h[1].toUpperCase();
        byHeading[current] = [];
        line = line.replace(h[0], "").trim();
        if (line) byHeading[current].push(line);
      } else {
        byHeading[current].push(line);
      }
    }

    result.summary = (byHeading.SUMMARY || []).join("\n").trim() || null;
    result.recommendations = (byHeading.RECOMMENDATIONS || []).join("\n").trim() || null;
    result.top_books = (byHeading.TOP_BOOKS || []).join("\n").trim() || null;
    result.kpi = (byHeading.KPI || []).join("\n").trim() || null;
    result.raw = extracted;

    return res.json(result);
  } catch (err) {
    console.error("AI INSIGHTS ERROR:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch response from Mistral API", details: err.message });
  }
};
