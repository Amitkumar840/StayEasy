import { useState, useEffect } from "react";
import { createComplaintRequest, getMyComplaintsRequest } from "../api/complaintApi.js";

const CATEGORIES = ["Room", "Food", "Service", "Staff", "Cleanliness", "Other"];

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-400",
  "in-progress": "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
  closed: "bg-slate-500/10 text-slate-400",
};

const emptyForm = { subject: "", description: "", category: "Room", priority: "medium" };

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyComplaintsRequest();
      setComplaints(res.data.data);
    } catch (err) {
      setError("Something went wrong loading your complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createComplaintRequest(formData);
      setFormData(emptyForm);
      loadComplaints();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">My Complaints</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-2xl p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Submit a new complaint</h2>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {formError}
            </div>
          )}

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            required
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Describe the issue"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            rows={3}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg px-5 py-2 transition"
          >
            {submitting ? "Submitting..." : "Submit complaint"}
          </button>
        </form>

        {loading && <p className="text-slate-400">Loading your complaints...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && complaints.length === 0 && (
          <p className="text-slate-400">No complaints found.</p>
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white font-medium">{c.subject}</h3>
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${STATUS_COLORS[c.status] || "bg-slate-500/10 text-slate-400"}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{c.description}</p>
                <p className="text-slate-500 text-xs">
                  {c.category} {"\u00B7"} {c.priority} priority
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
