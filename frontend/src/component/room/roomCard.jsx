import React from "react";

import {
Link
} from "react-router-dom";



const RoomCard = ({room}) => {


return (

<div className="
bg-white
rounded-2xl
shadow-lg
overflow-hidden
">


<img

src={room.image}

alt={room.name}

className="
w-full
h-60
object-cover
"

/>



<div className="p-6">


<h2 className="text-2xl font-bold">

{room.name}

</h2>



<p className="text-gray-600 mt-2">

{room.description}

</p>



<div className="flex justify-between mt-5">


<span className="font-bold text-blue-900">

₹{room.price}

</span>



<Link

to={`/rooms/${room._id}`}

className="
bg-blue-900
text-white
px-4
py-2
rounded-lg
"

>

View

</Link>


</div>


</div>


</div>

)

}


export default RoomCard;