import React,{useState} from "react";


const ChatInput = ({sendMessage}) => {


const [text,setText]=useState("");



const submit=(e)=>{

e.preventDefault();


if(text.trim()){


sendMessage(text);


setText("");

}


}



return (

<form

onSubmit={submit}

className="
flex
gap-3
"

>


<input

value={text}

onChange={(e)=>setText(e.target.value)}

placeholder="Ask about rooms, booking..."

className="
flex-1
border
p-3
rounded-lg
"

/>



<button

className="
bg-blue-900
text-white
px-5
rounded-lg
"

>

Send

</button>


</form>

)


}


export default ChatInput;