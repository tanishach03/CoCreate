import React, { useState, useEffect } from "react";

const Chat = ({ setOpenedChatTab, socket }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setChat((prevChats) => [...prevChats, data]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      socket.emit("message", { message });

      setMessage("");
    }
  };

  return (
    <div
      className="position-fixed top-0 h-100 text-white bg-dark"
      style={{ width: "400px", left: "0%" }}
    >
      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-light btn-block w-100 mt-5"
      >
        Close
      </button>
      <div
        className="flex-grow-1 w-100 mt-5 p-2 overflow-auto"
        style={{ height: "70%" }}
      >
        {chat.map((msg, index) => (
          <p
            key={index * 999}
            className="my-2 text-center w-100 border border-left-0 border-right-0 ${msg.name === 'You' ? 'text-right' : 'text-left'}"
            style={{ textAlign: msg.name === "You" ? "right" : "left" }}
          >
            {msg.name}: {msg.message}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="w-100 border-top p-2 d-flex">
        <input
          type="text"
          placeholder="Enter message"
          className="border-0 flex-grow-1 py-2 px-2"
          style={{
            width: "90%",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary rounded-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
