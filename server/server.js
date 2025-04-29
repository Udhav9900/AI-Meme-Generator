// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

app.post("/generate-caption", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a funny meme caption related to current social media trends. Topic: ${topic}`,
        },
      ],
    });

    res.json({ caption: response.data.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Caption Error:", err.response?.data || err.message);
    res.status(500).json({ caption: "Error generating caption." });
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));