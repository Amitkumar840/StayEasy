import { useState, useEffect } from "react";
import { getAllComplaintsRequest, updateComplaintRequest } from "../../api/complaintApi.js";

const STATUSES = ["pending", "in-progress", "resolved", "closed"];

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-400",
  "in-progress": "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
  closed: "bg-slate-500/10 text-slate-400",
};

const PRIORITY_COLORS = {
  low: "text-slate-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllComplaintsRequest(statusFilter ? { status: statusFilter } : {});
      setComplaints(res.data.data);
    } catch (err) {
      setError("Something went wrong loading complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateComplaintRequest(id, newStatus);
      loadComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong updating the complaint.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Complaints</h1>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-slate-400">Loading complaints...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && complaints.length === 0 && (
          <p className="text-slate-400">No complaints found.</p>
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-white font-medium">{c.subject}</h3>
                    <p className="text-slate-400 text-sm">
                      {c.user?.name} {"\u00B7"} {c.user?.email}
                    </p>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${STATUS_COLORS[c.status] || "bg-slate-500/10 text-slate-400"}`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-slate-300 text-sm my-2">{c.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs">
                    <span className="text-slate-500">{c.category}</span>{" "}
                    <span className={PRIORITY_COLORS[c.priority] || "text-slate-400"}>
                      {"\u00B7"} {c.priority} priority
                    </span>
                  </p>

                  <select
                    value={c.status}
                    disabled={updatingId === c._id}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className="bg-slate-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;
