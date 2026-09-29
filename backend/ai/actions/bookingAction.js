import Booking from "../../models/Booking.js";
import { validateBooking } from "../../services/bookingService.js";

export const createBookingViaAI = async ({ userId, roomId, checkIn, checkOut, guests }) => {
  const { checkInDate, checkOutDate, totalAmount, room } = await validateBooking({
    roomId,
    checkIn,
    checkOut,
    guests,
  });

  const booking = await Booking.create({
    user: userId,
    room: roomId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalAmount,
  });

  return {
    id: booking._id.toString(),
    roomTitle: room.title,
    checkIn: checkInDate.toDateString(),
    checkOut: checkOutDate.toDateString(),
    totalAmount,
  };
};

export const getUserBookingsViaAI = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate("room", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  return bookings.map((b) => ({
    id: b._id.toString(),
    roomTitle: b.room?.title || "Unknown room",
    checkIn: b.checkIn.toDateString(),
    checkOut: b.checkOut.toDateString(),
    bookingStatus: b.bookingStatus,
    totalAmount: b.totalAmount,
  }));
};

export const cancelBookingViaAI = async ({ userId, bookingId }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== userId.toString()) {
    throw new Error("You do not have permission to cancel this booking");
  }
  if (["cancelled", "checked-out"].includes(booking.bookingStatus)) {
    throw new Error(`This booking is already ${booking.bookingStatus}`);
  }

  booking.bookingStatus = "cancelled";
  await booking.save();

  return { id: booking._id.toString(), bookingStatus: booking.bookingStatus };
};
