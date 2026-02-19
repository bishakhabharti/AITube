import React from "react";
import AIChat from "./components/AIChat";

function App() {

  return (

    <div style={{display:"flex"}}>

      <div style={{flex:3, padding:"20px"}}>

        <h1>AITube</h1>

        <iframe
          width="800"
          height="450"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video"
          allowFullScreen
        />

      </div>

      <AIChat />

    </div>

  );

}

export default App;
