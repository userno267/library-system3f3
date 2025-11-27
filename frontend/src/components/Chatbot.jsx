import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are Alibrarian, a helpful librarian assistant." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        setMessages([...newMessages, { role: "assistant", content: "Server error: " + errorText }]);
        setIsLoading(false);
        return;
      }

      const result = await res.json();

      if (result.success && result.response) {
        setMessages([...newMessages, { role: "assistant", content: result.response }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Error: no response from API" }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Error: " + err.toString() }]);
    }

    setIsLoading(false);
  };

  // 🌿 New Green–Yellow Palette
  const colors = {
    primary: "#2F7D32",       // Dark Green
    secondary: "#CDE6A8",     // Soft Light Green
    accent: "#F4C430",        // Yellow Buttons
    background: "#F7F9E9",    // Cream Background
    text: "#1A202C",
    chatGreen: "#4CAF50",     // Assistant bubbles
    userBubble: "#2F7D32",    // User bubbles
    hover: "#D9E8B4",
    buttonHover: "#D4B12F"
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
      backgroundColor: colors.background
    }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "1.5rem" }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: colors.primary,
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
        }}>
          AI Librarian
        </h1>

        {/* Chat Container */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "1rem",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            overflowY: "auto",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: m.role === "user" ? colors.userBubble : colors.chatGreen,
                color: "white",
                padding: "0.6rem 1rem",
                borderRadius: "0.6rem",
                maxWidth: "75%",
                wordWrap: "break-word",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
            >
              {m.content}
            </div>
          ))}

          {isLoading && (
            <div style={{ alignSelf: "flex-start", color: colors.text, fontStyle: "italic" }}>
              Thinking...
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Row */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.6rem 0.8rem",
              borderRadius: "0.5rem",
              border: `1px solid ${colors.primary}`,
              backgroundColor: colors.background,
              color: colors.text,
              outline: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "0.2s"
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")
            }
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: colors.accent,
              color: colors.text,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.buttonHover;
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.accent;
              e.target.style.transform = "scale(1)";
            }}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
