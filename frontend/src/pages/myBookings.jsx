import React,{useEffect,useState} from "react";
import {getMyBookings,cancelBooking} from "../api/bookingApi";

const MyBookings=()=>{
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const loadBookings=()=>{
    setLoading(true);
    getMyBookings()
      .then((response)=>setBookings(response.data.bookings || []))
      .catch((err)=>setError(err.response?.data?.message || "Unable to load bookings"))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{loadBookings();},[]);

  const handleCancel=async(id)=>{
    try{
      await cancelBooking(id);
      loadBookings();
    }catch(err){
      setError(err.response?.data?.message || "Unable to cancel booking");
    }
  };

  return(
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">My Bookings</h1>
        {loading && <p className="text-center">Loading bookings...</p>}
        {error && <p className="text-center text-red-600 mb-6">{error}</p>}
        {!loading && bookings.length===0 && <p className="text-center text-gray-600">No bookings found.</p>}
        <div className="space-y-6">
          {bookings.map((booking)=>(
            <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-blue-900">{booking.room?.title || "Room"}</h2>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">{booking.bookingStatus}</span>
              </div>
              <div className="grid md:grid-cols-4 gap-5 mt-6">
                <div><p className="text-gray-500">Check In</p><p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p></div>
                <div><p className="text-gray-500">Check Out</p><p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p></div>
                <div><p className="text-gray-500">Guests</p><p className="font-semibold">{booking.guests}</p></div>
                <div><p className="text-gray-500">Amount</p><p className="font-semibold">₹{booking.totalAmount}</p></div>
              </div>
              <div className="mt-6 flex justify-end">
                {booking.bookingStatus!=="cancelled" && <button onClick={()=>handleCancel(booking._id)} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">Cancel Booking</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
