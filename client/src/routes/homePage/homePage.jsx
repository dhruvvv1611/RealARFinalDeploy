import { useContext, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:8800/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="homePage">
      <div className="textContainer">
        {/* Existing content remains the same */}
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p className="des">
            Our AR-driven real estate platform transforms property exploration
            with immersive 3D tours and interactive features. Seamlessly
            visualize spaces, customize interiors, and access local insights—all
            in one dynamic, intuitive experience that redefines how you discover
            and engage with real estate!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>
                <a
                  target="_blank"
                  href="https://youtu.be/Tn7f-QMs8OQ?si=i5MqcaLDEbG8e1Nt"
                >
                  16+
                </a>
              </h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>

      <button className="chat-button" onClick={toggleChat}>
        <span className="chat-icon">💬</span>
      </button>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span className="header-title">AI Real Estate Assistant</span>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-body">
            {messages.length === 0 && (
              <div className="welcome-message">
                Hello! 👋 I'm your real estate assistant. How can I help you today?
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
                <div className="message-icon">
                  {msg.sender === "user" ? "👤" : "🤖"}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button 
              className="send-button"
              onClick={sendMessage}
              disabled={!userInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;