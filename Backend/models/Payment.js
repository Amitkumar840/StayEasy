import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        paymentId: {
            type: String
        },

        orderId: {
            type: String
        },

        amount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking", "cash"],
            default: "upi"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;