import React,{useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {getRoomById} from "../api/roomApi";

const RoomDetails=()=>{
  const {id}=useParams();
  const [room,setRoom]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    getRoomById(id)
      .then((response)=>setRoom(response.data.room))
      .catch((err)=>setError(err.response?.data?.message || "Unable to load room"))
      .finally(()=>setLoading(false));
  },[id]);

  if(loading) return <div className="min-h-screen flex items-center justify-center">Loading room...</div>;
  if(error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if(!room) return null;

  return(
    <div className="min-h-screen bg-gray-100">
      <section className="relative h-112.5">
        <img src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} alt={room.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-5xl font-bold">{room.title}</h1>
          <p className="mt-3 text-xl">Premium stay experience at SmartStay</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold">About This Room</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">{room.description}</p>
          <h2 className="text-3xl font-bold mt-8">Amenities</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-5">
            {(room.amenities || []).map((item,index)=><div key={index} className="bg-blue-50 p-4 rounded-xl text-blue-900 font-medium">✓ {item}</div>)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 h-fit">
          <h2 className="text-3xl font-bold">₹{room.price} / Night</h2>
          <p className="mt-3 text-gray-600">👥 {room.capacity} Guests</p>
          <hr className="my-6"/>
          <Link to={`/booking?room=${room._id}`} className="block w-full mt-7 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-700 transition text-center">Book Now</Link>
        </div>
      </section>
    </div>
  );
};

export default RoomDetails;
