const ChatMessage = ({ message, onConfirm, onDismiss, confirmed }) => {
  const isUser = message.sender === "user";
  const hasAction = !isUser && message.action && !confirmed;

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-2`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-100"
        }`}
      >
        {message.message}
      </div>

      {hasAction && (
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition"
          >
            Yes, confirm
          </button>
          <button
            onClick={onDismiss}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg px-3 py-1.5 transition"
          >
            Not now
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;