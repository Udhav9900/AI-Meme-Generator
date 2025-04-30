const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/generate", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a funny meme caption about: ${topic}`,
        },
      ],
    });

    const caption = response.data.choices[0].message.content.trim();
    res.json({ caption });
  } catch (err) {
    console.error("OpenAI API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("🟢 AI Meme Generator Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});