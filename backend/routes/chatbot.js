import express from "express";
import dotenv from "dotenv";
import { Mistral } from "@mistralai/mistralai";
import pool from "../db.js"; // ensure correct path

dotenv.config();
const router = express.Router();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Helper — fetch data
async function fetchLibraryData() {
  const [books] = await pool.query("SELECT * FROM books");
  const [categories] = await pool.query("SELECT * FROM categories");
  const [borrows] = await pool.query(`
    SELECT br.*, b.title, u.name as borrower 
    FROM borrow_records br
    LEFT JOIN books b ON br.book_id = b.id
    LEFT JOIN users u ON br.user_id = u.id
  `);

  return { books, categories, borrows };
}

// POST /api/chatbot/chat
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Fetch library data
    const libraryData = await fetchLibraryData();

    // Construct system prompt with real data
    const systemPrompt =
      `You are Alibrarian, an intelligent librarian AI assistant.
You know the full library database. Use this information when answering.

=== BOOK DATA (JSON) ===
${JSON.stringify(libraryData.books, null, 2)}

=== CATEGORY DATA ===
${JSON.stringify(libraryData.categories, null, 2)}

=== BORROW RECORDS ===
${JSON.stringify(libraryData.borrows, null, 2)}

Rules:
- Always answer based on this data.
- If a book is unavailable, say so.
- If a user asks for recommendations, suggest based on categories or popular titles.
- Keep answers short unless asked otherwise.
`;

    // Combine messages → convert to a single user input text
    const userConversation = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // Final prompt to Mistral
    const finalPrompt = systemPrompt + "\n\nConversation:\n" + userConversation;

    // Call Mistral
    const result = await client.beta.conversations.start({
      inputs: finalPrompt,
      model: "mistral-medium-latest",
      temperature: 0.3,
      maxTokens: 2048
    });

    const assistantMessage =
      result.outputs?.find(o => o.role === "assistant")?.content;

    if (!assistantMessage) {
      return res
        .status(500)
        .json({ error: "No assistant message returned from Mistral API" });
    }

    res.json({ success: true, response: assistantMessage });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({
      error: "Failed to fetch response from Mistral API",
      details: err.toString(),
    });
  }
});

export default router;
