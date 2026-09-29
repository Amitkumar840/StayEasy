import mongoose from "mongoose";

const hotelInfoSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true, default: "StayEase" },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    checkInTime: { type: String, default: "2:00 PM" },
    checkOutTime: { type: String, default: "11:00 AM" },
    cancellationPolicy: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    services: { type: [String], default: [] },
    rules: { type: [String], default: [] },
    faqs: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const HotelInfo = mongoose.model("HotelInfo", hotelInfoSchema);

export default HotelInfo;