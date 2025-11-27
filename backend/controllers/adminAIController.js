export const getAIInsights = async (req, res) => {
  try {
    const { books, categories } = req.body;

    const prompt = `
You are an AI analyzing library data. Provide insights such as:
- What categories need more books?
- Which books are low in copies?
- Are eBooks more available than physical?
- Suggested improvements for library management.

Here is the data:
Books: ${JSON.stringify(books, null, 2)}
Categories: ${JSON.stringify(categories, null, 2)}
    `;

    const apiRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await apiRes.json();

    return res.json({
      success: true,
      insights: data.choices?.[0]?.message?.content || "No insights available."
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};
