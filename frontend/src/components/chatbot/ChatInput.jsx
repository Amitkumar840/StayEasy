import { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-slate-700">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-lg px-3 py-2 transition"
      >
        {"\u27A4"}
      </button>
    </form>
  );
};

export default ChatInput;
