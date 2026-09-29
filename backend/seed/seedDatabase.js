import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.js";
import Room from "../models/Room.js";
import HotelInfo from "../models/HotelInfo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const rooms = [
  { roomNumber: "101", title: "Deluxe King Room", description: "A spacious deluxe room with a king-size bed, city view, and modern amenities.", roomType: "Deluxe", pricePerNight: 3500, capacity: 2, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service"] },
  { roomNumber: "102", title: "Cozy Single Room", description: "A comfortable single room perfect for solo travelers, with all essential amenities.", roomType: "Single", pricePerNight: 1500, capacity: 1, amenities: ["Wi-Fi", "TV", "Air Conditioning"] },
  { roomNumber: "103", title: "Classic Double Room", description: "A well-appointed double room with two beds, ideal for friends or colleagues traveling together.", roomType: "Double", pricePerNight: 2200, capacity: 2, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Room Service"] },
  { roomNumber: "104", title: "Executive Suite", description: "A luxurious suite with a separate living area, premium furnishings, and stunning city views.", roomType: "Suite", pricePerNight: 6500, capacity: 3, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"] },
  { roomNumber: "105", title: "Family Room", description: "A spacious room designed for families, with extra bedding and a kid-friendly layout.", roomType: "Family", pricePerNight: 4200, capacity: 4, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Fridge"] },
  { roomNumber: "106", title: "Deluxe Twin Room", description: "A modern deluxe room with twin beds and premium bedding, great for business travelers.", roomType: "Deluxe", pricePerNight: 3800, capacity: 2, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"] },
  { roomNumber: "107", title: "Budget Single Room", description: "An affordable, no-frills single room for the practical traveler.", roomType: "Single", pricePerNight: 1200, capacity: 1, amenities: ["Wi-Fi", "Air Conditioning"] },
  { roomNumber: "108", title: "Presidential Suite", description: "Our top-tier suite with panoramic views, a private lounge, and premium concierge service.", roomType: "Suite", pricePerNight: 9500, capacity: 4, amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony", "Jacuzzi"] },
];

const hotelInfo = {
  hotelName: "StayEase",
  description: "A modern hotel focused on comfortable stays, smart bookings, and personalized service.",
  address: "123 Smart Avenue, Business District",
  phone: "+91-98765-43210",
  email: "info@StayEase.example.com",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  cancellationPolicy: "Bookings can be cancelled free of charge any time before check-in. Refunds for paid bookings are processed within 5-7 business days.",
  amenities: ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Parking", "Gym", "24/7 Support"],
  services: ["Room Service", "Laundry", "Airport Transfers (on request)", "Concierge"],
  rules: [
    "A valid government-issued photo ID is required at check-in.",
    "StayEase is a smoke-free property; smoking is only permitted in designated outdoor areas.",
    "Pets are not currently allowed on the property.",
  ],
  faqs: [
    { question: "What time is check-in?", answer: "Check-in time is 2:00 PM." },
    { question: "What time is check-out?", answer: "Check-out time is 11:00 AM." },
    { question: "Is breakfast included?", answer: "Yes, a complimentary breakfast buffet is served daily from 7:00 AM to 10:30 AM." },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    await Room.deleteMany({});
    const createdRooms = await Room.insertMany(rooms);
    console.log(`Seeded ${createdRooms.length} rooms.`);

    await HotelInfo.findOneAndReplace({}, hotelInfo, { upsert: true });
    console.log("Seeded hotel info.");

    const demoUsers = [
      { name: "Admin User", email: "admin@StayEase.example.com", phone: "9000000001", password: "admin123", role: "admin" },
      { name: "Staff User", email: "staff@StayEase.example.com", phone: "9000000002", password: "staff123", role: "staff" },
      { name: "Demo Customer One", email: "customer1@StayEase.example.com", phone: "9000000003", password: "customer123", role: "customer" },
      { name: "Demo Customer Two", email: "customer2@StayEase.example.com", phone: "9000000004", password: "customer123", role: "customer" },
      { name: "Demo Customer Three", email: "customer3@StayEase.example.com", phone: "9000000005", password: "customer123", role: "customer" },
    ];

    for (const demoUser of demoUsers) {
      const exists = await User.findOne({ email: demoUser.email });
      if (!exists) {
        await User.create(demoUser);
        console.log(`Created demo user: ${demoUser.email} (${demoUser.role})`);
      } else {
        console.log(`Demo user already exists, skipping: ${demoUser.email}`);
      }
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();