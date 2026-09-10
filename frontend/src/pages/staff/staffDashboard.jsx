import React from "react";


const StaffDashboard = () => {


return (

<div className="min-h-screen bg-gray-100 p-10">


<h1 className="text-3xl font-bold">

Staff Dashboard

</h1>



<div className="bg-white mt-6 p-6 rounded-xl shadow">


<h2 className="text-xl font-bold">

Today's Tasks

</h2>


<ul className="mt-4 space-y-2">

<li>
✓ Room Cleaning
</li>

<li>
✓ Customer Requests
</li>

<li>
✓ Check-in Assistance
</li>


</ul>


</div>


</div>

)

}


export default StaffDashboard;