import { Link } from "react-router-dom";
import { Users, Wifi } from "lucide-react";

const RoomCard = ({ room }) => {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="h-48 bg-slate-700 flex items-center justify-center">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0].url}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-500 text-sm">No image available</span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-white">{room.title}</h3>
          <span className="text-xs bg-blue-500/10 text-blue-400 rounded-full px-2 py-1">
            {room.roomType}
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
          <span className="flex items-center gap-1">
            <Users size={16} /> {room.capacity} guests
          </span>
          {room.amenities && room.amenities.length > 0 && (
            <span className="flex items-center gap-1">
              <Wifi size={16} /> {room.amenities.length} amenities
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white">{"\u20B9"}{room.pricePerNight}</span>
            <span className="text-slate-400 text-sm"> / night</span>
          </div>
          <Link
            to={`/rooms/${room._id}`}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
