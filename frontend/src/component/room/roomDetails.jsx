import React from "react";


const RoomDetails = ({room}) => {


return (

<div className="bg-white p-8 rounded-2xl shadow-lg">


<h1 className="text-3xl font-bold">

{room.name}

</h1>


<p className="mt-4 text-gray-600">

{room.description}

</p>



<h3 className="text-xl font-bold mt-6">

Amenities

</h3>



<ul className="mt-3">

{
room.amenities.map((item,index)=>(

<li key={index}>

✓ {item}

</li>

))
}


</ul>


</div>

)

}


export default RoomDetails;