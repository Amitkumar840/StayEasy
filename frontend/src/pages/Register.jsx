import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      navigate("/verify-email", { state: { email: result.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
        <p className="text-slate-400 text-sm mb-6">Join StayEase to start booking</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

// Shared helper so Login, Register and VerifyEmail all send the
// user to the right dashboard after a successful auth call.
export const redirectByRole = (role, navigate) => {
  if (role === "admin") navigate("/admin");
  else if (role === "staff") navigate("/staff");
  else navigate("/dashboard");
};

export default Register;