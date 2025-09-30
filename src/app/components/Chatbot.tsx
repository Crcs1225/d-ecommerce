// app/components/Chatbot.tsx
"use client";

import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    // Dummy bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a coconut recommendation bot 🌴" },
      ]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6">
      {open ? (
        <div className="bg-white w-80 h-96 shadow-lg rounded-lg flex flex-col">
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between">
            <span>Chatbot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[70%] ${
                  m.sender === "user"
                    ? "bg-green-100 self-end ml-auto"
                    : "bg-gray-200 self-start"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="Ask about products..."
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}
    </div>
  );
}
