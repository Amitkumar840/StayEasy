import express from "express";

import {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint
} from "../controllers/complaintController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";


const router = express.Router();


// Create Complaint
router.post(
    "/",
    protect,
    createComplaint
);


// Get User Complaints
router.get(
    "/my-complaints",
    protect,
    getMyComplaints
);


// Get All Complaints (Admin)
router.get(
    "/",
    protect,
    admin,
    getAllComplaints
);


// Update Complaint (Admin)
router.put(
    "/:id",
    protect,
    admin,
    updateComplaint
);


export default router;