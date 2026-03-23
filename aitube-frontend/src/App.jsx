import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:9095";

  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("react");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");
  const chatBoxRef = useRef(null);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedVideo(null);
    setChat([]);
    setMessage("");
    setChatError("");

    if (menu === "home") setSearch("react");
    if (menu === "trending") setSearch("trending videos");
    if (menu === "library") setSearch("programming tutorials");
    if (menu === "liked") setSearch("popular coding videos");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    setVoiceStatus("🎤 Listening...");
    recognition.start();

    recognition.onresult = async (event) => {
      const voiceText = event.results[0][0].transcript;

      setVoiceStatus("🧠 Recognizing...");

      setTimeout(async () => {
        setVoiceStatus("📤 Sending...");
        await sendDirectMessage(voiceText);
        setVoiceStatus("✅ Done");
        setTimeout(() => setVoiceStatus(""), 1500);
      }, 500);
    };

    recognition.onerror = () => {
      setVoiceStatus("❌ Voice error");
      setTimeout(() => setVoiceStatus(""), 2000);
    };
  };

  const sendChatRequest = async (text) => {
    const cleanText = text?.trim();
    if (!cleanText) return;
    if (chatLoading) return;

    setChatLoading(true);
    setChatError("");

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanText,
          videoTitle: selectedVideo?.snippet?.title,
          transcript: selectedVideo?.snippet?.description,
        }),
      });

      const data = await res.text();
      if (!res.ok) throw new Error(data || `Request failed (${res.status})`);

      setChat((prev) => [...prev, { user: cleanText, bot: data }]);
    } catch (e) {
      setChat((prev) => [
        ...prev,
        {
          user: cleanText,
          bot: "AITube AI is unavailable right now. Start the backend server and try again.",
        },
      ]);
      setChatError("Backend not connected");
    } finally {
      setChatLoading(false);
    }
  };

  const sendDirectMessage = async (text) => {
    await sendChatRequest(text);
  };

  const sendMessage = async () => {
    await sendChatRequest(message);
    setMessage("");
  };

  useEffect(() => {
    if (!search) return;

    setLoading(true);
    setSearchError("");

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/youtube/search?query=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setSearchError(data?.error || `Search failed (${res.status})`);
          setVideos([]);
          return;
        }

        setVideos(data?.items || []);
        if (data?.error) setSearchError(data.error);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setSearchError("Failed to fetch videos. Is the backend running?");
          setVideos([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();

  }, [search]);

  useEffect(() => {
    // Keep the newest chat messages visible.
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, chatLoading]);

  return (
    <div className="app">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">AITube</div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.target.value.trim();
                if (!value) return;
                setSearch(value);
                setSelectedVideo(null);
                setChat([]);
                setMessage("");
                setChatError("");
              }
            }}
          />
          <span className="search-icon">🔍</span>
          <span className="mic-icon" onClick={startVoiceInput}>🎤</span>
        </div>

        <div className="nav-right">
          <span>🔔</span>
          <span>🌙</span>
          <div className="avatar">B</div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="main-layout">

        {/* SIDEBAR */}
       <div className="sidebar">

  <p className={activeMenu==="home"?"active":""} onClick={()=>handleMenuClick("home")}>
    🏠 Home
  </p>

  <p className={activeMenu==="trending"?"active":""} onClick={()=>handleMenuClick("trending")}>
    🔥 Trending
  </p>

  <p className={activeMenu==="library"?"active":""} onClick={()=>handleMenuClick("library")}>
    📚 Library
  </p>

  <hr />

  <p onClick={()=>{setSearch("subscriptions videos");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>📺 Subscriptions</p>
  <p onClick={()=>{setSearch("watch later videos");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>⏳ Watch Later</p>
  <p onClick={()=>{setSearch("liked videos");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>❤️ Liked Videos</p>
  <p onClick={()=>{setSearch("history videos");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>🕒 History</p>
  <p onClick={()=>{setSearch("my channel videos");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>👤 Your Channel</p>

  <hr />

  <p onClick={()=>{setSearch("AI summary technology");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>🤖 AI Summary</p>

</div>

        {/* CONTENT */}
        <div className="content">

          {!selectedVideo ? (
            <>
              {loading && <div className="loader">⏳ Loading...</div>}
              {searchError && <div className="search-error">⚠️ {searchError}</div>}

              <div className="video-grid">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className="video-card"
                    onClick={() => {
                      setSelectedVideo(video);
                      setChat([]);
                      setMessage("");
                      setChatError("");
                    }}
                  >
                    <img
                      src={
                        video?.snippet?.thumbnails?.high?.url ||
                        video?.snippet?.thumbnails?.default?.url ||
                        ""
                      }
                      alt=""
                    />
                    <p>{video?.snippet?.title || "Untitled video"}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="watch-page">

              <button
                className="back-btn"
                onClick={() => {
                  setSelectedVideo(null);
                  setChat([]);
                  setMessage("");
                  setChatError("");
                }}
              >
                ← Back
              </button>

              <div className="video-section">
                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${selectedVideo?.id?.videoId}`}
                  frameBorder="0"
                  allowFullScreen
                  title="video"
                />
                <h2>{selectedVideo.snippet.title}</h2>
              </div>

              <div className="ai-section">
                <h3>🤖 AI Assistant</h3>

                {chatError && (
                  <div className="search-error">⚠️ {chatError}</div>
                )}

                <div className="chat-box" ref={chatBoxRef}>
                  {chat.map((c, index) => (
                    <div key={index}>
                      <div className="user-msg">{c.user}</div>
                      <div className="ai-msg">{c.bot}</div>
                    </div>
                  ))}
                </div>

                <div className="input-area">
                  <input
                    type="text"
                    placeholder="Ask about this video..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={startVoiceInput} disabled={chatLoading}>
                    🎤
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={chatLoading || !message.trim()}
                  >
                    {chatLoading ? "Sending..." : "Send"}
                  </button>
                </div>

                {voiceStatus && <p className="voice-status">{voiceStatus}</p>}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
  <h4>🔥 Trending Topics</h4>

  <p onClick={()=>{setSearch("React 19 Updates");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    React 19 Updates
  </p>

  <p onClick={()=>{setSearch("Artificial Intelligence");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    AI in 2026
  </p>

  <p onClick={()=>{setSearch("Java Full Course");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    Java Full Course
  </p>

  <p onClick={()=>{setSearch("System Design");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    System Design
  </p>

  <hr />

  <h4>💡 Quick Links</h4>

  <p onClick={()=>{setSearch("Web Development tutorials");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    🌐 Web Development
  </p>

  <p onClick={()=>{setSearch("Data Structures full course");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    📊 Data Structures
  </p>

  <p onClick={()=>{setSearch("Machine Learning beginner");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    🤖 Machine Learning
  </p>

  <p onClick={()=>{setSearch("Interview preparation coding");setSelectedVideo(null);setChat([]);setMessage("");setChatError("");}}>
    🎯 Interview Prep
  </p>
</div>

      </div>
    </div>
  );
}

export default App;