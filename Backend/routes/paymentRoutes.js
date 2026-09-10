import express from "express";

const router = express.Router();


// Create Payment
router.post(
    "/create",
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Payment route working"
        });
    }
);


// Verify Payment
router.post(
    "/verify",
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Payment verification route working"
        });
    }
);


export default router;