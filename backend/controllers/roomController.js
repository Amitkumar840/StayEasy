import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess } from "utils/responseHandler.js";

export const getRooms = async (req, res, next) => {
  try {
    const { roomType, minPrice, maxPrice, capacity, isAvailable, search } = req.query;

    const filter = {};

    if (roomType) filter.roomType = roomType;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (capacity) filter.capacity = { $gte: Number(capacity) };

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const rooms = await Room.find(filter).sort({ createdAt: -1 });

    sendSuccess(res, 200, "Rooms fetched successfully", rooms);
  } catch (error) {
    next(error);
  }
};

const ACTIVE_STATUSES = ["pending", "confirmed", "checked-in"];

export const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, roomType, capacity } = req.query;

    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error("checkIn and checkOut dates are both required");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      res.status(400);
      throw new Error("Invalid checkIn or checkOut date");
    }

    if (checkOutDate <= checkInDate) {
      res.status(400);
      throw new Error("checkOut must be after checkIn");
    }

    const filter = { isAvailable: true, status: "available" };
    if (roomType) filter.roomType = roomType;
    if (capacity) filter.capacity = { $gte: Number(capacity) };

    const candidateRooms = await Room.find(filter);

    const overlappingBookings = await Booking.find({
      room: { $in: candidateRooms.map((r) => r._id) },
      bookingStatus: { $in: ACTIVE_STATUSES },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select("room");

    const bookedRoomIds = new Set(overlappingBookings.map((b) => b.room.toString()));

    const availableRooms = candidateRooms.filter((r) => !bookedRoomIds.has(r._id.toString()));

    sendSuccess(res, 200, "Available rooms fetched successfully", availableRooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    sendSuccess(res, 200, "Room fetched successfully", room);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    sendSuccess(res, 201, "Room created successfully", room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    sendSuccess(res, 200, "Room updated successfully", room);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    for (const image of room.images) {
      await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }

    sendSuccess(res, 200, "Room deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const uploadRoomImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "StayEase/rooms" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    room.images.push({ url: uploadResult.secure_url, publicId: uploadResult.public_id });
    await room.save();

    sendSuccess(res, 200, "Image uploaded successfully", room);
  } catch (error) {
    next(error);
  }
};

export const deleteRoomImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    const { publicId } = req.query;
    if (!publicId) {
      res.status(400);
      throw new Error("publicId query parameter is required");
    }

    await cloudinary.uploader.destroy(publicId);

    room.images = room.images.filter((img) => img.publicId !== publicId);
    await room.save();

    sendSuccess(res, 200, "Image deleted successfully", room);
  } catch (error) {
    next(error);
  }
};