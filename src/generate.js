// src/generate.js
const generateMeme = async (topic) => {
  try {
    const response = await fetch("https://meme-server-blix.onrender.com/generate", {      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Client error:", error);
    return { caption: "Something went wrong", imageUrl: "" };
  }
};

export default generateMeme;