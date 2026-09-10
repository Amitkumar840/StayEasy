import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {getRooms} from "../api/roomApi";

const Rooms=()=>{
  const [rooms,setRooms]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    getRooms()
      .then((response)=>setRooms(response.data.rooms || []))
      .catch((err)=>setError(err.response?.data?.message || "Unable to load rooms"))
      .finally(()=>setLoading(false));
  },[]);

  return(
    <div className="min-h-screen bg-gray-100">
      <section className="bg-linear-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-bold">Find Your Perfect Room</h1>
          <p className="mt-5 text-lg text-gray-200">Choose from our luxury rooms and enjoy a premium stay experience.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-800 text-center">Available Rooms</h2>
        {loading && <p className="text-center mt-10">Loading rooms...</p>}
        {error && <p className="text-center mt-10 text-red-600">{error}</p>}
        {!loading && !error && rooms.length===0 && <p className="text-center mt-10 text-gray-600">No rooms available.</p>}

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {rooms.map((room)=>(
            <div key={room._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition">
              <img src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} alt={room.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold">{room.title}</h3>
                <p className="text-gray-600 mt-3">{room.description}</p>
                <div className="flex justify-between mt-5">
                  <span className="text-blue-900 font-bold">₹{room.price} / Night</span>
                  <span>👥 {room.capacity} Guests</span>
                </div>
                <Link to={`/rooms/${room._id}`} className="block w-full mt-6 bg-blue-900 text-white py-3 rounded-xl text-center hover:bg-blue-700">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
