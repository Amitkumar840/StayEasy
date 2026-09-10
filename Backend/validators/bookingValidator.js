import { body } from "express-validator";


export const bookingValidator = [

    body("room")
        .notEmpty()
        .withMessage("Room id is required"),


    body("checkInDate")
        .notEmpty()
        .withMessage("Check-in date is required"),


    body("checkOutDate")
        .notEmpty()
        .withMessage("Check-out date is required"),


    body("guests")
        .isNumeric()
        .withMessage("Guests must be a number"),


    body("totalAmount")
        .isNumeric()
        .withMessage("Total amount must be a number")

];