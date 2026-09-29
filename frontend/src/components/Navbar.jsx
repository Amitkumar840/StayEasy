import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const linkClass = "text-slate-300 hover:text-white transition block py-2 sm:py-0";

  const NavLinks = () => (
    <>
      <Link to="/rooms" className={linkClass} onClick={closeMobile}>
        Rooms
      </Link>
      <Link to="/about" className={linkClass} onClick={closeMobile}>
        About
      </Link>
      <Link to="/contact" className={linkClass} onClick={closeMobile}>
        Contact
      </Link>

      {user && user.role === "customer" && (
        <>
          <Link to="/dashboard" className={linkClass} onClick={closeMobile}>
            Dashboard
          </Link>
          <Link to="/my-bookings" className={linkClass} onClick={closeMobile}>
            My Bookings
          </Link>
          <Link to="/my-complaints" className={linkClass} onClick={closeMobile}>
            My Complaints
          </Link>
        </>
      )}

      {user && user.role === "admin" && (
        <>
          <Link to="/admin" className={linkClass} onClick={closeMobile}>
            Admin Dashboard
          </Link>
          <Link to="/admin/rooms" className={linkClass} onClick={closeMobile}>
            Manage Rooms
          </Link>
          <Link to="/admin/bookings" className={linkClass} onClick={closeMobile}>
            Bookings
          </Link>
          <Link to="/admin/complaints" className={linkClass} onClick={closeMobile}>
            Complaints
          </Link>
          <Link to="/admin/users" className={linkClass} onClick={closeMobile}>
            Users
          </Link>
        </>
      )}

      {user && user.role === "staff" && (
        <>
          <Link to="/staff" className={linkClass} onClick={closeMobile}>
            Staff Dashboard
          </Link>
          <Link to="/admin/bookings" className={linkClass} onClick={closeMobile}>
            Bookings
          </Link>
          <Link to="/admin/complaints" className={linkClass} onClick={closeMobile}>
            Complaints
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/rooms" className="text-white font-bold text-lg" onClick={closeMobile}>
          StayEase
        </Link>

        <div className="hidden sm:flex items-center gap-5 text-sm">
          <NavLinks />

          {user ? (
            <div className="flex items-center gap-3 ml-2 pl-5 border-l border-slate-700">
              <Link to="/profile" className="text-slate-400 hover:text-white transition">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2 pl-5 border-l border-slate-700">
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="sm:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden mt-3 pb-3 border-t border-slate-700 pt-3 text-sm flex flex-col">
          <NavLinks />

          {user ? (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
              <Link to="/profile" className="text-slate-400 hover:text-white transition" onClick={closeMobile}>
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
              <Link to="/login" className="text-slate-300 hover:text-white transition" onClick={closeMobile}>
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition"
                onClick={closeMobile}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;