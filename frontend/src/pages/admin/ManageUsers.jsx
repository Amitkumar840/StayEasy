import { useState, useEffect } from "react";
import { getUsersRequest, updateUserRequest, deactivateUserRequest } from "../../api/userApi.js";

const ROLES = ["customer", "staff", "admin"];

const ROLE_COLORS = {
  customer: "bg-slate-500/10 text-slate-400",
  staff: "bg-blue-500/10 text-blue-400",
  admin: "bg-purple-500/10 text-purple-400",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsersRequest();
      setUsers(res.data.data);
    } catch (err) {
      setError("Something went wrong loading users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id);
    try {
      await updateUserRequest(id, { role });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong updating the role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this user? They will no longer be able to log in.")) return;
    setUpdatingId(id);
    try {
      await deactivateUserRequest(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong deactivating the user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReactivate = async (id) => {
    setUpdatingId(id);
    try {
      await updateUserRequest(id, { isActive: true });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong reactivating the user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full sm:w-96 bg-slate-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <p className="text-slate-400">Loading users...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <p className="text-slate-400">No users match your search.</p>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div key={u._id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{u.name}</h3>
                    <span className={`text-xs rounded-full px-2 py-1 ${ROLE_COLORS[u.role] || "bg-slate-500/10 text-slate-400"}`}>
                      {u.role}
                    </span>
                    {!u.isActive && (
                      <span className="text-xs rounded-full px-2 py-1 bg-red-500/10 text-red-400">
                        deactivated
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {u.email} {"\u00B7"} {u.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    disabled={updatingId === u._id}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-slate-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {u.isActive ? (
                    <button
                      onClick={() => handleDeactivate(u._id)}
                      disabled={updatingId === u._id}
                      className="text-red-400 hover:underline text-sm disabled:opacity-60"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(u._id)}
                      disabled={updatingId === u._id}
                      className="text-green-400 hover:underline text-sm disabled:opacity-60"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;