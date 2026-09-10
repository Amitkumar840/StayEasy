import Complaint from "../models/Complaint.js";


// Create Complaint
export const createComplaint = async (req, res) => {
    try {

        const { subject, message } = req.body;

        const complaint = await Complaint.create({
            user: req.user.id,
            subject,
            message
        });


        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get User Complaints
export const getMyComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find({
            user: req.user.id
        });


        res.status(200).json({
            success: true,
            complaints
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get All Complaints (Admin)
export const getAllComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find()
            .populate("user", "name email");


        res.status(200).json({
            success: true,
            complaints
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Update Complaint Status (Admin)
export const updateComplaint = async (req, res) => {
    try {

        const { status, reply } = req.body;


        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                status,
                reply
            },
            {
                new: true
            }
        );


        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};