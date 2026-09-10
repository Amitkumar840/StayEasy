import User from "../models/User.js";


// Get User Profile
export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {

        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                phone
            },
            {
                new: true
            }
        ).select("-password");


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get All Users (Admin)
export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password");


        res.status(200).json({
            success: true,
            users
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};