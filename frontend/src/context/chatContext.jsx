import React,{createContext,useEffect,useState} from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

export const ChatContext=createContext();

const ChatProvider=({children})=>{
  const {user}=useAuth();
  const [messages,setMessages]=useState([]);

  useEffect(()=>{
    if(!user){
      setMessages([]);
      return;
    }
    api.get("/chat/history")
      .then((response)=>{
        const history=(response.data.messages||[]).map((item)=>({
          sender:item.sender==="bot"?"bot":"user",
          text:item.message
        }));
        setMessages(history);
      })
      .catch(()=>{});
  },[user]);

  const addMessage=(msg)=>setMessages((prev)=>[...prev,msg]);

  return <ChatContext.Provider value={{messages,addMessage}}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
