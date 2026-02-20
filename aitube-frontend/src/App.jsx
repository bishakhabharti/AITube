import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("react");

  const [message, setMessage] = useState("");
const [chat, setChat] = useState([]);

const sendMessage = async () => {
  if (!message) return;

  const res = await fetch("http://localhost:9095/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message,
     videoTitle: selectedVideo?.snippet?.title || ""

    })
  });

  const data = await res.text();

  setChat((prev) => [...prev, { user: message, bot: data }]);

  setMessage("");
};


  useEffect(() => {
    fetch(`http://localhost:9095/youtube/search?query=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.items);
      });
  }, [search]);

  return (
    <div className="app">
      {/* TOP NAVBAR */}
      <div className="navbar">
        <div className="logo">AITube</div>
        <input
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(e.target.value);
          }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="content">
        {!selectedVideo ? (
          <div className="video-grid">
            {videos.map((video) => (
              <div
                key={video.id.videoId}
                className="video-card"
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt=""
                />
                <p>{video.snippet.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="watch-page">
            <div className="video-section">
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                frameBorder="0"
                allowFullScreen
                title="video"
              ></iframe>
              <h2>{selectedVideo.snippet.title}</h2>
            </div>

            <div className="ai-section">
  <h3>AI Assistant</h3>

  <div className="chat-box">
    {chat.map((c, index) => (
      <div key={index}>
        <p><b>You:</b> {c.user}</p>
        <p><b>AI:</b> {c.bot}</p>
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
    <button onClick={sendMessage}>Send</button>
  </div>
</div>


           
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
