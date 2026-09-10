import Booking from "../models/Booking.js";
import Room from "../models/Room.js";


// Check Room Availability
export const checkRoomAvailability = async (
    roomId,
    checkInDate,
    checkOutDate
) => {

    const existingBooking = await Booking.findOne({
        room: roomId,
        bookingStatus: {
            $ne: "cancelled"
        },
        $or: [
            {
                checkInDate: {
                    $lte: checkOutDate
                },
                checkOutDate: {
                    $gte: checkInDate
                }
            }
        ]
    });


    if (existingBooking) {
        return false;
    }


    return true;
};



// Create Booking Service
export const createBookingService = async (bookingData) => {

    const {
        room,
        checkInDate,
        checkOutDate
    } = bookingData;


    const available = await checkRoomAvailability(
        room,
        checkInDate,
        checkOutDate
    );


    if (!available) {
        throw new Error("Room is already booked");
    }


    const booking = await Booking.create(bookingData);


    return booking;
};  