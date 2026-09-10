import { body } from "express-validator";


export const roomValidator = [

    body("roomNumber")
        .notEmpty()
        .withMessage("Room number is required"),


    body("title")
        .notEmpty()
        .withMessage("Room title is required"),


    body("type")
        .notEmpty()
        .withMessage("Room type is required"),


    body("price")
        .isNumeric()
        .withMessage("Price must be a number"),


    body("capacity")
        .isNumeric()
        .withMessage("Capacity must be a number")

];