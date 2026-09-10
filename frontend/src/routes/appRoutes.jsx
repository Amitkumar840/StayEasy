import React from "react";
import {Routes,Route} from "react-router-dom";
import ProtectedRoute from "../component/ProtectedRoute";
import Home from '../pages/home';
import Login from '../pages/login';
import Register from '../pages/register';
import Rooms from '../pages/room';
import RoomDetails from '../pages/roomDetails';
import Booking from '../pages/booking';
import MyBookings from '../pages/myBookings';
import CustomerDashboard from '../pages/customer/customerDashboard';
import AdminDashboard from '../pages/admin/adminDashboard';
import ManageRooms from '../pages/admin/manageRooms';
import ManageBookings from '../pages/admin/manageBookings';
import Analytics from '../pages/admin/analytics';
import StaffDashboard from '../pages/staff/staffDashboard';

const AppRoutes=()=> (
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/rooms/:id" element={<RoomDetails/>}/>
    <Route path="/booking" element={<ProtectedRoute><Booking/></ProtectedRoute>}/>
    <Route path="/my-bookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>}/>
    <Route path="/customer/dashboard" element={<ProtectedRoute roles={["user"]}><CustomerDashboard/></ProtectedRoute>}/>
    <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
    <Route path="/admin/rooms" element={<ProtectedRoute roles={["admin"]}><ManageRooms/></ProtectedRoute>}/>
    <Route path="/admin/bookings" element={<ProtectedRoute roles={["admin"]}><ManageBookings/></ProtectedRoute>}/>
    <Route path="/admin/analytics" element={<ProtectedRoute roles={["admin"]}><Analytics/></ProtectedRoute>}/>
    <Route path="/staff/dashboard" element={<ProtectedRoute roles={["staff"]}><StaffDashboard/></ProtectedRoute>}/>
  </Routes>
);

export default AppRoutes;
