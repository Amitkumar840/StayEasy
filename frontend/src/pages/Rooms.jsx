import { useState, useEffect } from "react";
import { getRoomsRequest, getAvailableRoomsRequest } from "../api/roomApi.js";
import RoomCard from "../components/room/RoomCard.jsx";
import RoomFilter from "../components/room/RoomFilter.jsx";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError("");
      try {
        // If the user has picked both dates, use real date-conflict
        // checking against actual bookings rather than the plain
        // room list, which only reflects the static isAvailable flag.
        const useAvailabilitySearch = filters.checkIn && filters.checkOut;
        const res = useAvailabilitySearch
          ? await getAvailableRoomsRequest(filters)
          : await getRoomsRequest(filters);
        setRooms(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Something went wrong loading rooms. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Our Rooms</h1>

        <RoomFilter filters={filters} onChange={setFilters} />

        {filters.checkIn && filters.checkOut && (
          <p className="text-slate-400 text-sm mb-4">
            Showing rooms actually available for your selected dates.
          </p>
        )}

        {loading && <p className="text-slate-400">Loading rooms...</p>}

        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && rooms.length === 0 && (
          <p className="text-slate-400">No rooms match your filters.</p>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;