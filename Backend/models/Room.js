import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["Single", "Double", "Suite", "Deluxe"],
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        description: {
            type: String
        },

        images: [
            {
                type: String
            }
        ],

        capacity: {
            type: Number,
            required: true
        },

        amenities: [
            {
                type: String
            }
        ],

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;