import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/common/Logo.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { apiClient } from "../../services/api/client.js";
import { toast } from "../../components/ui/Toast.jsx";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  // 60-second cooldown timer
  useEffect(() => {
    if (!submitted || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await apiClient("/auth/forgot-password", {
        method: "POST",
        body: { email: cleanEmail },
      });
      setSubmitted(true);
      setCountdown(60);
      toast.success("Password reset link dispatched.");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      await apiClient("/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim() },
      });
      toast.info("A new reset link has been dispatched");
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend reset link.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 my-8">
      {/* Brand Header */}
      {!submitted && (
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Logo className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900">
            Reset your password
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Enter your registered email and we will send you a secure password recovery link.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <Feedback tone="error" role="alert">
            {error}
          </Feedback>
        </div>
      )}

      {submitted ? (
        /* ─── CONFIRMATION CARD ────────────────────────────────────────── */
        <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Icon: MailCheck */}
          <div className="bg-teal-50 text-teal-700 p-4 rounded-2xl mx-auto w-fit mb-3 border border-teal-100 flex items-center justify-center shadow-xs">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25 4.5-4.5" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Password Reset Link Sent
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            We&apos;ve sent a secure reset link to <strong className="text-slate-900 font-semibold">{email}</strong>. Please check your inbox and spam folder.
          </p>

          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100/80 text-xs text-teal-900 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-teal-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>The link will expire in <strong>15 minutes</strong>.</span>
          </div>

          {/* 60-Second Countdown & Resend Button */}
          <div className="pt-3">
            {countdown > 0 ? (
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 font-medium cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Resend link in 00:{countdown.toString().padStart(2, "0")}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResend}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium transition-all text-sm active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {resending ? "Sending fresh link…" : "Resend Reset Link"}
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/login"
              className="text-teal-700 hover:underline font-semibold text-sm inline-flex items-center gap-1.5"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      ) : (
        /* ─── INITIAL SUBMISSION FORM ───────────────────────────────────── */
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="account-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-xl px-4 py-2.5 text-sm transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl py-3 px-4 text-sm shadow-md shadow-teal-700/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending reset link…</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="text-center text-sm text-slate-500 pt-6 mt-6 border-t border-slate-100">
            <Link
              to="/login"
              className="text-teal-700 hover:underline font-semibold inline-flex items-center justify-center gap-1"
            >
              ← Return to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
