import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { resendVerificationRequest } from "../api/authApi.js";
import { redirectByRole } from "./Register.jsx";

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await verifyEmail(email, code);
      redirectByRole(user.role, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    setError("");
    setResending(true);
    try {
      await resendVerificationRequest(email);
      setResendMessage("A new code has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong resending the code.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-slate-300 mb-4">No email to verify. Please register first.</p>
          <Link to="/register" className="text-blue-400 hover:underline">
            Go to registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Verify your email</h1>
        <p className="text-slate-400 text-sm mb-6">
          We sent a 6-digit code to <span className="text-slate-300">{email}</span>. Enter it below to
          finish creating your account.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}
        {resendMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            className="w-full bg-slate-700 text-white text-center text-2xl tracking-[0.5em] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full text-center text-blue-400 hover:underline text-sm mt-4 disabled:opacity-60"
        >
          {resending ? "Resending..." : "Resend code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;