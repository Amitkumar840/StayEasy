import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "../../hooks/useChat.js";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

const SUGGESTED_QUESTIONS = [
  "Find available rooms",
  "What time is check-in?",
  "Show deluxe rooms",
  "How can I cancel my booking?",
  "What facilities do you have?",
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const { messages, loading, sendMessage, confirmAction } = useChat();
  const [confirmedIndexes, setConfirmedIndexes] = useState(new Set());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleSend = (text) => {
    sendMessage(text);
  };

  const handleConfirm = (index, action) => {
    setConfirmedIndexes((prev) => new Set(prev).add(index));
    confirmAction(action);
  };

  const handleDismiss = (index) => {
    setConfirmedIndexes((prev) => new Set(prev).add(index));
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition z-50"
        aria-label="Open StayEase AI chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-112 bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-700">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <span className="text-white font-semibold text-sm">StayEase AI</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm text-center mb-3">
                  Hello! How can I help you today?
                </p>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="block w-full text-left text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg px-3 py-2 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <ChatMessage
                key={i}
                message={m}
                confirmed={confirmedIndexes.has(i)}
                onConfirm={() => handleConfirm(i, m.action)}
                onDismiss={() => handleDismiss(i)}
              />
            ))}

            {loading && <TypingIndicator />}
          </div>

          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      )}
    </>
  );
};

export default ChatBot;