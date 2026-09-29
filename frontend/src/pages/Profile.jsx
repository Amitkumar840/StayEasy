import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { updateProfileRequest, changePasswordRequest } from "../api/profileApi.js";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Keeps the form in sync if the user object loads or changes
  // after this component has already mounted (e.g. on first page
  // load, before /auth/me has resolved).
  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);
    try {
      const res = await updateProfileRequest({ name, phone });
      updateUser(res.data.data);
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setPasswordSaving(true);
    try {
      await changePasswordRequest({ currentPassword, newPassword });
      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>

        <form onSubmit={handleProfileSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Account details</h2>

          {profileMessage && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2">
              {profileMessage}
            </div>
          )}
          {profileError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {profileError}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-slate-700/50 text-slate-400 rounded-lg px-3 py-2 outline-none cursor-not-allowed"
            />
            <p className="text-slate-500 text-xs mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg px-5 py-2 transition"
          >
            {profileSaving ? "Saving..." : "Save changes"}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Change password</h2>

          {passwordMessage && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2">
              {passwordMessage}
            </div>
          )}
          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg px-5 py-2 transition"
          >
            {passwordSaving ? "Updating..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;