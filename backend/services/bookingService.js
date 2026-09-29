import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

const ACTIVE_STATUSES = ["pending", "confirmed", "checked-in"];

export const validateBooking = async ({ roomId, checkIn, checkOut, guests }) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    const error = new Error("Invalid check-in or check-out date");
    error.statusCode = 400;
    throw error;
  }

  if (checkInDate < today) {
    const error = new Error("Check-in date cannot be in the past");
    error.statusCode = 400;
    throw error;
  }

  if (checkOutDate <= checkInDate) {
    const error = new Error("Check-out date must be after check-in date");
    error.statusCode = 400;
    throw error;
  }

  if (!guests || guests < 1) {
    const error = new Error("Guest count must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  if (guests > room.capacity) {
    const error = new Error(`This room can accommodate up to ${room.capacity} guests`);
    error.statusCode = 400;
    throw error;
  }

  if (room.status !== "available" || !room.isAvailable) {
    const error = new Error("This room is not currently available for booking");
    error.statusCode = 400;
    throw error;
  }

  // Overlap check: two date ranges [a, b) and [c, d) overlap when a < d and c < b.
  const overlapping = await Booking.findOne({
    room: roomId,
    bookingStatus: { $in: ACTIVE_STATUSES },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  if (overlapping) {
    const error = new Error("This room is already booked for the selected dates");
    error.statusCode = 400;
    throw error;
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * room.pricePerNight;

  return { room, checkInDate, checkOutDate, nights, totalAmount };
};
