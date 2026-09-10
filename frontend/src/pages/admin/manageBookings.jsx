import React,{useEffect,useState} from "react";
import api from "../../api/axios";

const ManageBookings=()=>{
  const [bookings,setBookings]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    api.get("/bookings")
      .then((response)=>setBookings(response.data.bookings||[]))
      .catch((err)=>setError(err.response?.data?.message||"Unable to load bookings"));
  },[]);

  return(
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="mt-6 space-y-4">
        {bookings.map((booking)=><div key={booking._id} className="bg-white p-6 rounded-xl shadow"><div className="flex justify-between"><h2 className="font-bold">{booking.room?.title || "Room"}</h2><span>{booking.bookingStatus}</span></div><p className="text-gray-600 mt-2">Customer: {booking.user?.name || "Unknown"} · Guests: {booking.guests} · ₹{booking.totalAmount}</p><p className="text-gray-600">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p></div>)}
      </div>
    </div>
  );
};

export default ManageBookings;
