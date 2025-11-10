import { useState, useRef, useEffect } from "react";
import Bot_header from "./Bot_header";
import { Send, SmilePlus } from "lucide-react";
import "../style.css"

const Bot_chatcontainer_ = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); // State  to store chat messages
  const [botTyping, setBotTyping] = useState(false); // Track bot typing status
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // Control emoji picker visibility
  const inputRef = useRef(null);
  const messageEndRef = useRef(null);
  const API_KEY = "AIzaSyAuPPWAChsL1kdLZ4NUOyfRqG7TeglkVmU";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const handleOutgoingMessage = async (e) => {
    e.preventDefault();
  
    const userMessage = text.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setText("");

    setBotTyping(true); // Show bot typing indicator

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      const botResponse = data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    } finally {
      setBotTyping(false); // Hide bot typing indicator
    }
  };

  // Function to toggle emoji picker visibility
  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  // Function to add emoji to the message input
  const addEmoji = (emoji) => {
    setText((prevText) => prevText + emoji);
    setEmojiPickerVisible(false); // Hide emoji picker after selection
  };
  useEffect(()=>{
    if (messageEndRef.current&&messages) {
      messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages]);
  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <Bot_header />

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbox c">
        <div className="chat chat-start">
          <div className="chat-bubble flex flex-col">
            Hello there! I'm Nova, your friendly chatbot. 🌟 I'm here to make
            your experience smoother, answer your questions, and assist with
            anything you need. Whether you're looking for information, advice,
            or just someone to chat with, I'm ready! Just let me know how I can
            help you today!
          </div>
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble flex flex-col c" style={{whiteSpace:"pre-line"}}>{msg.text}</div>
          </div>
        ))}
        {botTyping && (
          <div className="chat chat-start ">
          <div className="chat-bubble flex flex-col ">
          <span className="loading loading-dots loading-md"></span>
          </div>
          </div>
        )}
        <div ref={messageEndRef} />

      </div>

      {/* Message Input */}{emojiPickerVisible && (
           <div className="emoji-picker-modal w-40 h-20 overflow-scroll  bg-dark p-1 rounded-lg border z-5">
           <div className="emoji-grid grid grid-cols-4 gap-1">
             {[
               "😊", "😂", "😍", "😎", "😘", "😁", "😒", "👍", "🙌", "🤞",
               "✌️", "🤷‍♂️", "🤦‍♂️", "😜", "💖", "💕", "🥰", "😗", "😉", 
               "🥲", "🫡", "🤨", "😶‍🌫️", "🤐", "😪", "🥱", "😴", "😥", 
               "😓", "🤑", "😭", "😨"
             ].map((emoji, index) => (
               <span
                 key={index}
                 className="emoji cursor-pointer text-lg"
                 onClick={() => addEmoji(emoji)}
               >
                 {emoji}
               </span>
             ))}
           </div>
         </div>
          )}
      <div className="p-4 w-full"> 
        
        <form
          onSubmit={handleOutgoingMessage}
          className="flex items-center gap-2"
        >
          <button type="button" onClick={toggleEmojiPicker} id="emoji-btn">
          <SmilePlus />
          </button>

          {/* Emoji Picker */}
         

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              ref={inputRef}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!text.trim()}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bot_chatcontainer_;
