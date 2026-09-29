import Complaint from "../models/Complaint.js";
import { sendSuccess } from "utils/responseHandler.js";

const VALID_CATEGORIES = ["Room", "Food", "Service", "Staff", "Cleanliness", "Other"];
const VALID_STATUSES = ["pending", "in-progress", "resolved", "closed"];


export const createComplaint = async (req, res, next) => {
  try {
    const { subject, description, category, priority, bookingId } = req.body;

    if (!subject || !description || !category) {
      res.status(400);
      throw new Error("Subject, description and category are all required");
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400);
      throw new Error("Invalid category");
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      booking: bookingId || null,
      subject,
      description,
      category,
      priority: priority || "medium",
    });

    sendSuccess(res, 201, "Complaint submitted successfully", complaint);
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, "Your complaints fetched successfully", complaints);
  } catch (error) {
    next(error);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Complaints fetched successfully", complaints);
  } catch (error) {
    next(error);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error("A valid status is required");
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found");
    }

    sendSuccess(res, 200, "Complaint updated successfully", complaint);
  } catch (error) {
    next(error);
  }
};
