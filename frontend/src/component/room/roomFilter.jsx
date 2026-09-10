import React from "react";


const RoomFilter = ({setType}) => {


return (

<div className="flex gap-4">


<button

onClick={()=>setType("All")}

className="
px-5
py-2
bg-blue-900
text-white
rounded-lg
"

>

All

</button>



<button

onClick={()=>setType("Deluxe")}

className="
px-5
py-2
bg-gray-200
rounded-lg
"

>

Deluxe

</button>



<button

onClick={()=>setType("Suite")}

className="
px-5
py-2
bg-gray-200
rounded-lg
"

>

Suite

</button>


</div>

)

}


export default RoomFilter;