import Room from "../models/Room.js";


// Add New Room (Admin)
export const addRoom = async (req, res) => {
    try {

        const room = await Room.create(req.body);

        res.status(201).json({
            success: true,
            message: "Room added successfully",
            room
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get All Rooms
export const getAllRooms = async (req, res) => {
    try {

        const rooms = await Room.find();

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get Single Room
export const getRoomById = async (req, res) => {
    try {

        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.status(200).json({
            success: true,
            room
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Update Room (Admin)
export const updateRoom = async (req, res) => {
    try {

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );


        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            room
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Delete Room (Admin)
export const deleteRoom = async (req, res) => {
    try {

        await Room.findByIdAndDelete(req.params.id);


        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};