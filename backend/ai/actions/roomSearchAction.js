import Room from "../../models/Room.js";
import Booking from "../../models/Booking.js";

const ACTIVE_STATUSES = ["pending", "confirmed", "checked-in"];

// A safety cap in case the room catalog grows very large one day -
// generous enough that it never truncates a realistic small-hotel
// inventory (the actual bug we hit: a 5-room cap silently hid a
// real, cheaper room from the AI's context).
const MAX_ROOMS_RETURNED = 50;

/**
 * Searches real rooms in MongoDB based on loosely-parsed filters.
 * When checkIn and checkOut are both provided, this checks actual
 * bookings for real date conflicts (the same logic as the public
 * /rooms/available endpoint) rather than only the static
 * isAvailable flag - so the AI never tells a customer a room is
 * free when it is actually booked for those dates.
 */
export const searchRooms = async ({ roomType, maxPrice, minCapacity, checkIn, checkOut } = {}) => {
  const filter = { isAvailable: true };

  if (roomType) filter.roomType = new RegExp(`^${roomType}$`, "i");
  if (maxPrice) filter.pricePerNight = { $lte: Number(maxPrice) };
  if (minCapacity) filter.capacity = { $gte: Number(minCapacity) };

  // Sorted by price so the AI always has a true, complete, ordered
  // picture of the catalog - never a silently truncated slice that
  // happens to exclude the cheapest (or newest) room.
  let rooms = await Room.find(filter).sort({ pricePerNight: 1 }).limit(MAX_ROOMS_RETURNED);

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime()) && checkOutDate > checkInDate) {
      const overlapping = await Booking.find({
        room: { $in: rooms.map((r) => r._id) },
        bookingStatus: { $in: ACTIVE_STATUSES },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate },
      }).select("room");

      const bookedRoomIds = new Set(overlapping.map((b) => b.room.toString()));
      rooms = rooms.filter((r) => !bookedRoomIds.has(r._id.toString()));
    }
  }

  return rooms.map((r) => ({
    id: r._id.toString(),
    title: r.title,
    roomType: r.roomType,
    pricePerNight: r.pricePerNight,
    capacity: r.capacity,
    amenities: r.amenities,
  }));
};