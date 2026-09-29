import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoomByIdRequest } from "../api/roomApi.js";
import { Users } from "lucide-react";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getRoomByIdRequest(id);
        setRoom(res.data.data);
      } catch (err) {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Room not found."}</p>
          <Link to="/rooms" className="text-blue-400 hover:underline">
            Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/rooms" className="text-blue-400 hover:underline text-sm mb-4 inline-block">
          Back to rooms
        </Link>

        <div className="h-72 bg-slate-800 rounded-2xl mb-6 flex items-center justify-center">
          {room.images && room.images.length > 0 ? (
            <img
              src={room.images[0].url}
              alt={room.title}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <span className="text-slate-500">No image available</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">{room.title}</h1>
          <span className="text-sm bg-blue-500/10 text-blue-400 rounded-full px-3 py-1">
            {room.roomType}
          </span>
        </div>

        <p className="text-slate-400 mb-6">{room.description}</p>

        <div className="flex items-center gap-6 text-slate-300 mb-6">
          <span className="flex items-center gap-2">
            <Users size={18} /> Up to {room.capacity} guests
          </span>
          <span className="text-2xl font-bold text-white">
            {"\u20B9"}{room.pricePerNight}
            <span className="text-slate-400 text-sm font-normal"> / night</span>
          </span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-slate-800 text-slate-300 text-sm rounded-lg px-3 py-1"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/booking/${room._id}`}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RoomDetails;
