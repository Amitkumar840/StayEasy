import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Room title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Room description is required"],
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Deluxe", "Suite", "Family"],
      required: [true, "Room type is required"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({ title: "text", description: "text" });

const Room = mongoose.model("Room", roomSchema);

export default Room;
