import React from "react";


const ChatMessage = ({message}) => {


return (

<div

className={`

my-3

p-3

rounded-xl

max-w-xs

${message.sender==="user"

?"bg-blue-900 text-white ml-auto"

:"bg-gray-200 text-gray-800"

}

`}

>


{message.text}


</div>

)


}


export default ChatMessage;