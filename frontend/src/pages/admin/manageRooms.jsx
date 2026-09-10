import React,{useEffect,useState} from "react";
import {getRooms,createRoom} from "../../api/roomApi";
import api from "../../api/axios";

const ManageRooms=()=>{
  const [rooms,setRooms]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({roomNumber:"",title:"",type:"Single",price:"",capacity:"",description:""});
  const [error,setError]=useState("");

  const load=()=>getRooms().then((response)=>setRooms(response.data.rooms||[])).catch((err)=>setError(err.response?.data?.message||"Unable to load rooms"));
  useEffect(()=>{load();},[]);

  const submit=async(e)=>{
    e.preventDefault();
    try{
      await createRoom({...form,price:Number(form.price),capacity:Number(form.capacity)});
      setForm({roomNumber:"",title:"",type:"Single",price:"",capacity:"",description:""});
      setShowForm(false);
      load();
    }catch(err){setError(err.response?.data?.message||"Unable to create room");}
  };

  const remove=async(id)=>{
    try{await api.delete(`/rooms/${id}`);load();}catch(err){setError(err.response?.data?.message||"Unable to delete room");}
  };

  return(
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold">Manage Rooms</h1>
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-900 text-white px-5 py-2 rounded-lg">{showForm?"Close":"Add New Room"}</button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {showForm && <form onSubmit={submit} className="grid md:grid-cols-3 gap-4 mt-6">
          <input required placeholder="Room Number" value={form.roomNumber} onChange={(e)=>setForm({...form,roomNumber:e.target.value})} className="border p-3 rounded-lg"/>
          <input required placeholder="Room Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="border p-3 rounded-lg"/>
          <select value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} className="border p-3 rounded-lg"><option>Single</option><option>Double</option><option>Suite</option><option>Deluxe</option></select>
          <input required type="number" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="border p-3 rounded-lg"/>
          <input required type="number" placeholder="Capacity" value={form.capacity} onChange={(e)=>setForm({...form,capacity:e.target.value})} className="border p-3 rounded-lg"/>
          <input placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="border p-3 rounded-lg"/>
          <button className="bg-blue-900 text-white px-5 py-2 rounded-lg md:col-span-3">Save Room</button>
        </form>}
      </div>
      <div className="mt-6 space-y-4">
        {rooms.map((room)=><div key={room._id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center"><div><h2 className="text-xl font-bold">{room.title}</h2><p className="text-gray-600">Room {room.roomNumber} · ₹{room.price} · Capacity {room.capacity}</p></div><button onClick={()=>remove(room._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button></div>)}
      </div>
    </div>
  );
};

export default ManageRooms;
