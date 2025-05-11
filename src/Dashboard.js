import { useEffect, useState } from "react";
import generateMeme from "./generate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Dashboard() {
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const generateCaption = async () => {
    setLoading(true);
    const data = await generateMeme(topic);
    setCaption(data.caption || "No caption found.");
    setImageUrl(data.imageUrl || "");
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          padding: "30px",
          borderRadius: "30px",
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h1
          style={{
            color: "#facc15",
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "25px",
            textShadow: "0 0 8px #facc15",
          }}
        >
          AI Meme Generator 😎
        </h1>

        <input
          type="text"
          placeholder="Type a meme idea..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "14px",
            width: "85%",
            fontSize: "17px",
            marginBottom: "25px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "#f1f1f1",
            color: "#333",
          }}
        />
        <br />
        <button
          onClick={generateCaption}
          style={{
            padding: "14px 32px",
            backgroundColor: "#ff007f",
            border: "none",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            marginBottom: "35px",
            transition: "all 0.3s ease",
            boxShadow: "0 0 12px #ff007f88",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {loading ? "Generating..." : "✨ Generate Caption"}
        </button>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated Meme"
            style={{
              width: "100%",
              maxWidth: "520px",
              borderRadius: "16px",
              marginBottom: "25px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              animation: "fadeIn 0.8s ease-in",
            }}
          />
        )}

        {caption && (
          <p
            style={{
              background: "#1e1e1e",
              padding: "22px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "18px",
              color: "#fafafa",
              boxShadow: "0 0 12px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.8s ease-in",
            }}
          >
            "{caption}"
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;