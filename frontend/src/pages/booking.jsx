import React,{useEffect,useMemo,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import {getRoomById} from "../api/roomApi";
import {createBooking} from "../api/bookingApi";
import useAuth from "../hooks/useAuth";

const Booking=()=>{
  const location=useLocation();
  const navigate=useNavigate();
  const {user}=useAuth();
  const roomId=new URLSearchParams(location.search).get("room");
  const [room,setRoom]=useState(null);
  const [form,setForm]=useState({checkInDate:"",checkOutDate:"",guests:1});
  const [loading,setLoading]=useState(Boolean(roomId));
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(!roomId){
      setLoading(false);
      return;
    }
    getRoomById(roomId)
      .then((response)=>setRoom(response.data.room))
      .catch((err)=>setError(err.response?.data?.message || "Unable to load room"))
      .finally(()=>setLoading(false));
  },[roomId]);

  const nights=useMemo(()=>{
    if(!form.checkInDate || !form.checkOutDate) return 0;
    const start=new Date(form.checkInDate);
    const end=new Date(form.checkOutDate);
    return Math.max(0,Math.ceil((end-start)/(1000*60*60*24)));
  },[form.checkInDate,form.checkOutDate]);

  const totalAmount=room ? room.price*nights : 0;

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!roomId){setError("Please select a room first.");return;}
    if(nights<=0){setError("Check-out date must be after check-in date.");return;}
    if(Number(form.guests)>room.capacity){setError("Number of guests exceeds room capacity.");return;}
    setError("");
    setSubmitting(true);
    try{
      await createBooking({room:roomId,checkInDate:form.checkInDate,checkOutDate:form.checkOutDate,guests:Number(form.guests),totalAmount});
      navigate("/my-bookings");
    }catch(err){
      setError(err.response?.data?.message || "Unable to create booking");
    }finally{
      setSubmitting(false);
    }
  };

  if(loading) return <div className="min-h-screen flex items-center justify-center">Loading booking...</div>;

  return(
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Complete Your Booking</h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Guest Information</h2>
            <p className="text-gray-600 mb-6">Booking for: <span className="font-semibold">{user?.name}</span></p>
            <div className="grid md:grid-cols-2 gap-5">
              <div><label className="text-gray-700">Check In</label><input type="date" required value={form.checkInDate} onChange={(e)=>setForm({...form,checkInDate:e.target.value})} className="w-full border p-3 rounded-lg mt-2" /></div>
              <div><label className="text-gray-700">Check Out</label><input type="date" required value={form.checkOutDate} onChange={(e)=>setForm({...form,checkOutDate:e.target.value})} className="w-full border p-3 rounded-lg mt-2" /></div>
              <div><label className="text-gray-700">Guests</label><input type="number" min="1" max={room?.capacity || undefined} required value={form.guests} onChange={(e)=>setForm({...form,guests:e.target.value})} className="w-full border p-3 rounded-lg mt-2" /></div>
            </div>
            {error && <p className="mt-5 text-red-600">{error}</p>}
            <button disabled={submitting || !roomId} className="mt-8 w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">{submitting ? "Confirming..." : "Confirm Booking"}</button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-bold">Booking Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4"><span className="text-gray-600">Room</span><span className="font-semibold text-right">{room?.title || "Select a room"}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Guests</span><span className="font-semibold">{form.guests}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Nights</span><span className="font-semibold">{nights}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Price</span><span className="font-semibold">₹{room?.price || 0} / Night</span></div>
            </div>
            <hr className="my-6"/>
            <div className="flex justify-between text-xl font-bold"><span>Total</span><span>₹{totalAmount}</span></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
