const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const { createClient } = require("redis");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes.cjs"); // ✅ Match file extension
const rateLimiter = require("./rateLimiter.cjs");
const updateRoutes = require("./Update.cjs");   // ✅ Match file extension
const fetch = require("node-fetch");            // ✅ Required for Unsplash fetch

dotenv.config();

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 MongoDB connected"))
  .catch((err) => console.error("🔴 MongoDB error:", err));

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ✅ Route Mounting
app.use("/auth", authRoutes);
app.use("/update", updateRoutes);

// ✅ OpenAI Setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ Meme Generator Endpoint
app.post("/generate", rateLimiter, async (req, res) => {
  const { topic } = req.body;
  console.log("🔹 Topic received:", topic);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Create a funny meme caption about: ${topic}` },
      ],
    });

    const caption = response.data.choices[0]?.message?.content?.trim() || "No caption";

    const imageRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        topic
      )}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const imageData = await imageRes.json();
    const imageUrl = imageData?.urls?.regular || "";

    res.json({ caption, imageUrl });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("🟢 AI Meme Generator Backend Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});