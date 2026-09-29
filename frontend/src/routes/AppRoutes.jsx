import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import Rooms from "../pages/Rooms.jsx";
import RoomDetails from "../pages/RoomDetails.jsx";
import Booking from "../pages/Booking.jsx";
import MyBookings from "../pages/MyBookings.jsx";
import MyComplaints from "../pages/MyComplaints.jsx";
import Profile from "../pages/Profile.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageRooms from "../pages/admin/ManageRooms.jsx";
import ManageComplaints from "../pages/admin/ManageComplaints.jsx";
import ManageBookings from "../pages/admin/ManageBookings.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";
import StaffDashboard from "../pages/staff/StaffDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import RoleRoute from "../components/RoleRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route
        path="/booking/:roomId"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-complaints"
        element={
          <ProtectedRoute>
            <MyComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <ManageRooms />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <RoleRoute allowedRoles={["admin", "staff"]}>
            <ManageComplaints />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <RoleRoute allowedRoles={["admin", "staff"]}>
            <ManageBookings />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <RoleRoute allowedRoles={["staff", "admin"]}>
            <StaffDashboard />
          </RoleRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;