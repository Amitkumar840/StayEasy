import Booking from "../models/Booking.js";
import { validateBooking } from "../services/bookingService.js";
import { sendSuccess } from "utils/responseHandler.js";

export const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      res.status(400);
      throw new Error("roomId, checkIn, checkOut and guests are all required");
    }

    const { checkInDate, checkOutDate, totalAmount } = await validateBooking({
      roomId,
      checkIn,
      checkOut,
      guests,
    });

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      specialRequests: specialRequests || "",
    });

    const populated = await booking.populate("room", "title roomNumber roomType pricePerNight");

    sendSuccess(res, 201, "Booking created successfully", populated);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", "title roomNumber roomType pricePerNight images")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Your bookings fetched successfully", bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "room",
      "title roomNumber roomType pricePerNight images"
    );

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isStaffOrAdmin = ["staff", "admin"].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      res.status(403);
      throw new Error("You do not have permission to view this booking");
    }

    sendSuccess(res, 200, "Booking fetched successfully", booking);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { bookingStatus } = req.query;
    const filter = {};
    if (bookingStatus) filter.bookingStatus = bookingStatus;

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("room", "title roomNumber roomType")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Bookings fetched successfully", bookings);
  } catch (error) {
    next(error);
  }
};

const TERMINAL_STATUSES = ["cancelled", "checked-out"];
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    const validStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

    if (!bookingStatus || !validStatuses.includes(bookingStatus)) {
      res.status(400);
      throw new Error("A valid bookingStatus is required");
    }

    const existing = await Booking.findById(req.params.id);
    if (!existing) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (TERMINAL_STATUSES.includes(existing.bookingStatus)) {
      res.status(400);
      throw new Error(
        `This booking is already ${existing.bookingStatus} and cannot be changed. Please create a new booking instead.`
      );
    }

    if (bookingStatus === "checked-in" && existing.paymentStatus !== "paid") {
      res.status(400);
      throw new Error("This booking cannot be checked in until payment has been received.");
    }

    existing.bookingStatus = bookingStatus;
    await existing.save();

    sendSuccess(res, 200, "Booking status updated successfully", existing);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You do not have permission to cancel this booking");
    }

    if (["cancelled", "checked-out"].includes(booking.bookingStatus)) {
      res.status(400);
      throw new Error(`This booking is already ${booking.bookingStatus} and cannot be cancelled`);
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    sendSuccess(res, 200, "Booking cancelled successfully", booking);
  } catch (error) {
    next(error);
  }
};