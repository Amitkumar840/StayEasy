import React, { useState } from "react";


const BookingForm = ({onSubmit}) => {


const [booking,setBooking]=useState({

name:"",
phone:"",
checkIn:"",
checkOut:"",
guests:1

});



const handleChange=(e)=>{


setBooking({

...booking,

[e.target.name]:e.target.value

});


};



const handleSubmit=(e)=>{

e.preventDefault();

onSubmit(booking);

};



return (

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded-2xl shadow-lg"
>


<h2 className="text-2xl font-bold mb-6">

Guest Information

</h2>



<input

name="name"

placeholder="Full Name"

value={booking.name}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>



<input

name="phone"

placeholder="Phone Number"

value={booking.phone}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>



<div className="grid md:grid-cols-2 gap-4">


<input

type="date"

name="checkIn"

value={booking.checkIn}

onChange={handleChange}

className="
border
p-3
rounded-lg
"

/>



<input

type="date"

name="checkOut"

value={booking.checkOut}

onChange={handleChange}

className="
border
p-3
rounded-lg
"

/>


</div>




<input

type="number"

name="guests"

value={booking.guests}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mt-4
"

/>



<button

className="
mt-6
w-full
bg-blue-900
text-white
py-3
rounded-lg
hover:bg-blue-700
"

>

Confirm Booking

</button>



</form>

)


}


export default BookingForm;