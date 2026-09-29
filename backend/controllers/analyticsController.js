import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { sendSuccess } from "utils/responseHandler.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalCustomers,
      totalStaff,
      revenueResult,
      roomTypeBreakdown,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "available" }),
      Room.countDocuments({ status: "occupied" }),
      Room.countDocuments({ status: "maintenance" }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: "pending" }),
      Booking.countDocuments({ bookingStatus: "confirmed" }),
      Booking.countDocuments({ bookingStatus: "cancelled" }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "staff" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.aggregate([
        {
          $lookup: {
            from: "rooms",
            localField: "room",
            foreignField: "_id",
            as: "roomInfo",
          },
        },
        { $unwind: "$roomInfo" },
        { $group: { _id: "$roomInfo.roomType", count: { $sum: 1 } } },
      ]),
    ]);

    const revenue = revenueResult[0]?.total || 0;

    sendSuccess(res, 200, "Admin stats fetched successfully", {
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        maintenance: maintenanceRooms,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
      },
      users: {
        customers: totalCustomers,
        staff: totalStaff,
      },
      revenue,
      roomTypePopularity: roomTypeBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
