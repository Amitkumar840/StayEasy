import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { redirectByRole } from "./Register.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      redirectByRole(user.role, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-6">Log in to your StayEase account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
