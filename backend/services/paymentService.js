import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

export const processMockPayment = async ({ bookingId, userId, amount, method }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.user.toString() !== userId.toString()) {
    const error = new Error("You do not have permission to pay for this booking");
    error.statusCode = 403;
    throw error;
  }

  if (booking.paymentStatus === "paid") {
    const error = new Error("This booking has already been paid for");
    error.statusCode = 400;
    throw error;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const transactionId = `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const payment = await Payment.create({
    booking: bookingId,
    user: userId,
    amount,
    method: method || "mock_card",
    status: "success",
    transactionId,
  });

  booking.paymentStatus = "paid";
  await booking.save();

  return {
    transactionId: payment.transactionId,
    status: payment.status,
    amount: payment.amount,
  };
};