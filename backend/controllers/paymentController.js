import { processMockPayment } from "../services/paymentService.js";
import { sendSuccess } from "utils/responseHandler.js";

export const payForBooking = async (req, res, next) => {
  try {
    const { bookingId, amount, method } = req.body;

    if (!bookingId || !amount) {
      res.status(400);
      throw new Error("bookingId and amount are required");
    }

    const result = await processMockPayment({
      bookingId,
      userId: req.user._id,
      amount,
      method,
    });

    sendSuccess(res, 200, "Payment processed successfully", result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};