import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {getMyBookings} from "../../api/bookingApi";
import {getProfile} from "../../api/authApi";

const CustomerDashboard=()=>{
  const [user,setUser]=useState(null);
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([getProfile(),getMyBookings()])
      .then(([profileResponse,bookingResponse])=>{
        setUser(profileResponse.data.user);
        setBookings(bookingResponse.data.bookings || []);
      })
      .finally(()=>setLoading(false));
  },[]);

  return(
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Customer Dashboard</h1>
        {loading ? <p>Loading dashboard...</p> : <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="mt-3 text-gray-600">Name: {user?.name}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold">Total Bookings</h2>
            <p className="text-4xl text-blue-900 font-bold mt-4">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <Link to="/rooms" className="block mt-4 bg-blue-900 text-white text-center py-2 rounded-lg">Book Room</Link>
            <Link to="/my-bookings" className="block mt-3 border border-blue-900 text-blue-900 text-center py-2 rounded-lg">My Bookings</Link>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default CustomerDashboard;
