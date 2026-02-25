import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("react");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedVideo(null);

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

  const sendDirectMessage = async (text) => {
    const res = await fetch("http://localhost:9095/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        videoTitle: selectedVideo?.snippet?.title,
        transcript: selectedVideo?.snippet?.description
      })
    });

    const data = await res.text();

    setChat((prev) => [...prev, { user: text, bot: data }]);
  };

  const sendMessage = async () => {
    if (!message) return;

    const res = await fetch("http://localhost:9095/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        videoTitle: selectedVideo?.snippet?.title,
        transcript: selectedVideo?.snippet?.description
      })
    });

    const data = await res.text();

    setChat((prev) => [...prev, { user: message, bot: data }]);
    setMessage("");

    setTimeout(() => {
      const chatBox = document.querySelector(".chat-box");
      chatBox?.scrollTo(0, chatBox.scrollHeight);
    }, 100);
  };

  useEffect(() => {
    if (!search) return;

    setLoading(true);

    fetch(`http://localhost:9095/youtube/search?query=${search}`)
      .then(res => res.json())
      .then(data => {
        setVideos(data.items || []);
        setLoading(false);
      });

  }, [search]);

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

  <p onClick={()=>setSearch("subscriptions videos")}>📺 Subscriptions</p>
  <p onClick={()=>setSearch("watch later videos")}>⏳ Watch Later</p>
  <p onClick={()=>setSearch("liked videos")}>❤️ Liked Videos</p>
  <p onClick={()=>setSearch("history videos")}>🕒 History</p>
  <p onClick={()=>setSearch("my channel videos")}>👤 Your Channel</p>

  <hr />

  <p onClick={()=>setSearch("AI summary technology")}>🤖 AI Summary</p>

</div>

        {/* CONTENT */}
        <div className="content">

          {!selectedVideo ? (
            <>
              {loading && <div className="loader">⏳ Loading...</div>}

              <div className="video-grid">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className="video-card"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <img src={video.snippet.thumbnails.high.url} alt="" />
                    <p>{video.snippet.title}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="watch-page">

              <button className="back-btn" onClick={() => setSelectedVideo(null)}>
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

                <div className="chat-box">
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
                  <button onClick={startVoiceInput}>🎤</button>
                  <button onClick={sendMessage}>Send</button>
                </div>

                {voiceStatus && <p className="voice-status">{voiceStatus}</p>}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
  <h4>🔥 Trending Topics</h4>

  <p onClick={()=>{setSearch("React 19 Updates");setSelectedVideo(null);}}>
    React 19 Updates
  </p>

  <p onClick={()=>{setSearch("Artificial Intelligence");setSelectedVideo(null);}}>
    AI in 2026
  </p>

  <p onClick={()=>{setSearch("Java Full Course");setSelectedVideo(null);}}>
    Java Full Course
  </p>

  <p onClick={()=>{setSearch("System Design");setSelectedVideo(null);}}>
    System Design
  </p>

  <hr />

  <h4>💡 Quick Links</h4>

  <p onClick={()=>setSearch("Web Development tutorials")}>
    🌐 Web Development
  </p>

  <p onClick={()=>setSearch("Data Structures full course")}>
    📊 Data Structures
  </p>

  <p onClick={()=>setSearch("Machine Learning beginner")}>
    🤖 Machine Learning
  </p>

  <p onClick={()=>setSearch("Interview preparation coding")}>
    🎯 Interview Prep
  </p>
</div>

      </div>
    </div>
  );
}

export default App;