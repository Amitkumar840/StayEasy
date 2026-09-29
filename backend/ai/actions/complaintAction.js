import Complaint from "../../models/Complaint.js";

const VALID_CATEGORIES = ["Room", "Food", "Service", "Staff", "Cleanliness", "Other"];

/**
 * Creates a real complaint through the same model used by the
 * normal complaints API. Category is loosely matched against the
 * valid set and falls back to "Other" rather than rejecting the
 * whole request over a category the model phrased slightly off.
 */
export const createComplaintViaAI = async ({ userId, subject, description, category }) => {
  const matchedCategory =
    VALID_CATEGORIES.find((c) => c.toLowerCase() === (category || "").toLowerCase()) || "Other";

  const complaint = await Complaint.create({
    user: userId,
    subject,
    description,
    category: matchedCategory,
    priority: "medium",
  });

  return {
    id: complaint._id.toString(),
    subject: complaint.subject,
    category: complaint.category,
    status: complaint.status,
  };
};
