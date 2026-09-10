import Booking from "../models/Booking.js";
import Room from "../models/Room.js";


// Create Booking
export const createBooking = async (req, res) => {
    try {

        const {
            room,
            checkInDate,
            checkOutDate,
            guests,
            totalAmount
        } = req.body;


        const roomData = await Room.findById(room);

        if (!roomData) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }


        if (!roomData.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Room is not available"
            });
        }


        const booking = await Booking.create({
            user: req.user.id,
            room,
            checkInDate,
            checkOutDate,
            guests,
            totalAmount
        });


        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get User Bookings
export const getMyBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({
            user: req.user.id
        })
        .populate("room");


        res.status(200).json({
            success: true,
            bookings
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate("user")
            .populate("room");


        res.status(200).json({
            success: true,
            bookings
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Cancel Booking
export const cancelBooking = async (req, res) => {
    try {

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        });


        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }


        booking.bookingStatus = "cancelled";

        await booking.save();


        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};