import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let memory = [];

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    memory.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an advanced AI assistant like Jarvis.
You speak intelligently, confidently, and elegantly.
You address the user as "Shaurya" or "Sir".
Keep responses concise but intelligent.
Be futuristic, slightly witty, but respectful.
`
        },
        ...memory
      ]
    });

    const reply = completion.choices[0].message.content;

    memory.push({ role: "assistant", content: reply });

    if (memory.length > 10) {
      memory = memory.slice(-10);
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Jarvis Backend Running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
