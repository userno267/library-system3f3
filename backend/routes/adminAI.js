import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/analysis", async (req, res) => {
    const { stats } = req.body;

    if (!stats) {
        return res.status(400).json({ error: "Missing stats data" });
    }

    try {
        const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-large-latest",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional data analyst for a library system. Provide insights, trends, problems, predictions, and recommendations."
                    },
                    {
                        role: "user",
                        content: `Analyze this library data and produce a readable report:\n\n${JSON.stringify(stats, null, 2)}`
                    }
                ]
            })
        });

        const data = await mistralRes.json();

        if (!data.choices) {
            return res.status(500).json({ error: "Invalid Mistral response" });
        }

        const output = data.choices[0].message.content;

        res.json({ success: true, analysis: output });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to generate AI analysis" });
    }
});

export default router;
