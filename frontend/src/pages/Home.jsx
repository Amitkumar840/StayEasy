import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wifi, Waves, UtensilsCrossed, ParkingCircle, Bell, Clock, ShieldCheck, Sparkles, Bot } from "lucide-react";
import { getRoomsRequest } from "../api/roomApi.js";
import RoomCard from "../components/room/RoomCard.jsx";
import Footer from "../components/Footer.jsx";

const AMENITIES = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: ParkingCircle, label: "Parking" },
  { icon: Bell, label: "Room Service" },
  { icon: Clock, label: "24/7 Support" },
];

const WHY_StayEase = [
  { icon: Sparkles, title: "Easy booking", text: "Reserve a room in minutes, with a clear price and no hidden fees." },
  { icon: ShieldCheck, title: "Secure authentication", text: "Your account and bookings are protected with industry-standard security." },
  { icon: Clock, title: "Real-time availability", text: "See exactly which rooms are free for your dates - never overbooked." },
  { icon: Bot, title: "AI hotel assistant", text: "Ask questions or book a room right from chat, any time of day." },
];

const TESTIMONIALS = [
  { name: "Ananya R.", text: "The booking process was so smooth, and the room was exactly as described. Will definitely stay again." },
  { name: "Vikram S.", text: "Great location, friendly staff, and the AI assistant actually answered my questions instantly at midnight." },
  { name: "Priya M.", text: "Clean, comfortable, and the front desk resolved a small issue with my room within the hour." },
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await getRoomsRequest({});
        setFeaturedRooms(res.data.data.slice(0, 6));
      } catch (err) {
        setFeaturedRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (roomType) params.set("roomType", roomType);
    if (guests) params.set("capacity", guests);
    navigate(`/rooms${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-slate-900">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Welcome to StayEase</h1>
        <p className="text-slate-300 text-lg mb-8">
          Comfortable stays. Smart bookings. Personalized service.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/rooms"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition"
          >
            Explore Rooms
          </Link>
          <Link
            to="/rooms"
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-6 py-3 transition border border-slate-700"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

      <section className="px-6 -mt-10 relative z-10">
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-slate-800 rounded-2xl p-5 shadow-xl grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-slate-400 text-xs mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Guests</label>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Any"
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Room type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            Search Rooms
          </button>
        </form>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Rooms</h2>
        {loadingRooms ? (
          <p className="text-slate-400">Loading rooms...</p>
        ) : featuredRooms.length === 0 ? (
          <p className="text-slate-400">No rooms available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-800/50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Hotel Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="bg-slate-700 rounded-full p-4">
                  <Icon className="text-blue-400" size={24} />
                </div>
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Why StayEase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_StayEase.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-slate-800 rounded-2xl p-5">
              <Icon className="text-blue-400 mb-3" size={28} />
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-slate-400 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800/50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What Our Guests Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-300 text-sm mb-3">"{t.text}"</p>
                <p className="text-white font-medium text-sm">{"\u2014"} {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;