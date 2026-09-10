import mongoose from "mongoose";

const hotelInfoSchema = new mongoose.Schema(
    {
        hotelName: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        email: {
            type: String
        },

        facilities: [
            {
                type: String
            }
        ],

        images: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

const HotelInfo = mongoose.model("HotelInfo", hotelInfoSchema);

export default HotelInfo;