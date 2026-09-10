import React,{useEffect,useState} from "react";
import {getRooms} from "../../api/roomApi";
import {getMyBookings} from "../../api/bookingApi";
import api from "../../api/axios";

const AdminDashboard=()=>{
  const [stats,setStats]=useState({rooms:0,bookings:0,customers:0,revenue:0});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      getRooms(),
      api.get("/bookings"),
      api.get("/users")
    ]).then(([rooms,bookings,users])=>{
      const allBookings=bookings.data.bookings || [];
      const revenue=allBookings.reduce((sum,item)=>sum+(Number(item.totalAmount)||0),0);
      setStats({rooms:rooms.data.rooms?.length||0,bookings:allBookings.length,customers:users.data.users?.length||0,revenue});
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  return(
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        {loading ? <p>Loading dashboard...</p> : <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Total Rooms</h3><p className="text-3xl mt-3 text-blue-900">{stats.rooms}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Bookings</h3><p className="text-3xl mt-3 text-blue-900">{stats.bookings}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Customers</h3><p className="text-3xl mt-3 text-blue-900">{stats.customers}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Revenue</h3><p className="text-3xl mt-3 text-blue-900">₹{stats.revenue}</p></div>
        </div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
