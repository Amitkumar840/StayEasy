import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import { initializeSocket } from "./socket/socket.js";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();


// Database Connection
connectDB();


// Cloudinary Connection
connectCloudinary();


const app = express();


// Create HTTP Server
const server = createServer(app);


// Socket Connection
initializeSocket(server);


// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ 
    extended: true 
}));

app.use(cookieParser());



// Routes

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/chat", chatRoutes);



// Default Route
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Hotel Management System Backend Running..."
    });

});



// Error Middleware
// app.use(errorMiddleware);



const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});