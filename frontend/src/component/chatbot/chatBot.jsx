import React from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";
import useChat from "../../hooks/useChat";
import {sendMessage as sendChat} from "../../api/chatApi";

const ChatBot=()=>{
  const {messages,addMessage}=useChat();

  const sendMessage=async(text)=>{
    addMessage({sender:"user",text});
    try{
      const response=await sendChat(text);
      addMessage({sender:"bot",text:response.data.reply || response.data.assistantMessage?.message || "Sorry, I am unable to respond."});
    }catch(error){
      addMessage({sender:"bot",text:error.response?.data?.message || "Sorry, I am unable to respond."});
    }
  };

  return(
    <div className="fixed bottom-5 right-5 w-96 bg-white shadow-2xl rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-4 text-blue-900">AI Hotel Assistant 🤖</h2>
      <div className="h-72 overflow-y-auto">
        {messages.map((msg,index)=><ChatMessage key={index} message={msg}/>)}
      </div>
      <ChatInput sendMessage={sendMessage}/>
    </div>
  );
};

export default ChatBot;
