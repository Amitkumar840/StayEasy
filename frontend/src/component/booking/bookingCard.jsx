import React from "react";


const BookingCard = ({booking}) => {


return (

<div className="
bg-white
shadow-lg
rounded-2xl
p-6
">


<div className="flex justify-between">


<h2 className="text-xl font-bold">

{booking.room}

</h2>



<span className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
">

{booking.status}

</span>


</div>



<div className="mt-5 space-y-2">


<p>

Check In:
<span className="font-semibold ml-2">

{booking.checkIn}

</span>

</p>



<p>

Check Out:
<span className="font-semibold ml-2">

{booking.checkOut}

</span>

</p>



<p>

Amount:
<span className="font-semibold ml-2">

{booking.amount}

</span>

</p>


</div>



<button

className="
mt-5
bg-red-600
text-white
px-5
py-2
rounded-lg
"

>

Cancel Booking

</button>



</div>

)

}


export default BookingCard;