import {useContext} from "react";
import {ChatContext} from "../context/chatContext";

const useChat=()=>{

return useContext(ChatContext);

}


export default useChat;