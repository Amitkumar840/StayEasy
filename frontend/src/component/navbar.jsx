import React from "react";
import {Link,useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar=()=>{
  const {user,logout}=useAuth();
  const navigate=useNavigate();

  const handleLogout=()=>{
    logout();
    navigate("/login");
  };

  return(
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-900">StayEase</Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-700">Home</Link>
          <Link to="/rooms" className="text-gray-700 hover:text-blue-700">Rooms</Link>
          {user && <Link to="/my-bookings" className="text-gray-700 hover:text-blue-700">My Bookings</Link>}
          {user?.role==="admin" && <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-700">Admin</Link>}
          {user ? (
            <button onClick={handleLogout} className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Logout</button>
          ) : (
            <Link to="/login" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Login/SignUp</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
