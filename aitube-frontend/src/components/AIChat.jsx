import React, { useState } from "react";

function AIChat({ videoTitle }) {


  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message) return;

     const videoTitle = document.title;

    const userMessage = {
      sender: "You",
      text: message
    };

    setChat(prev => [...prev, userMessage]);

    try {

      const response = await fetch("http://localhost:9095/ai/chat", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

       body: JSON.stringify({
  message: message,
  videoTitle: videoTitle  
})


      });

      const data = await response.text();

      const aiMessage = {
        sender: "AITube AI",
        text: data
      };

      setChat(prev => [...prev, aiMessage]);

    } catch {

      setChat(prev => [...prev, {
        sender: "AITube AI",
        text: "Backend not connected"
      }]);

    }

    setMessage("");

  };

  return (

    <div style={{
      width: "350px",
      height: "600px",
      border: "1px solid gray",
      padding: "10px",
      display: "flex",
      flexDirection: "column"
    }}>

      <h3>AITube AI Assistant</h3>

      <div style={{
        flex: 1,
        overflowY: "auto"
      }}>

        {chat.map((c, index) => (

          <div key={index}>

            <b>{c.sender}:</b> {c.text}

          </div>

        ))}

      </div>

      <input
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        placeholder="Ask about this video..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>

  );

}

export default AIChat;
