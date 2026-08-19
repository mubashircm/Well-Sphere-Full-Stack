import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { apiClient } from "../../services/api/client.js";
import Logo from "../../components/common/Logo.jsx";
import ForgotPasswordPage from "./ForgotPasswordPage.jsx";

const copy = {
  login: ["Welcome back", "Sign in to access your saved guides and personalized health feeds."],
  signup: ["Create your account", "Join WellSphere to save articles, follow health topics, and track daily wellness."],
  forgot: ["Reset your password", "Enter your registered email and we will send you a secure password recovery link."],
  reset: ["Choose a new password", "Create a new strong password for your WellSphere account."],
};

function EyeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  );
}

export function AuthPage({ mode = "login" }) {
  if (mode === "forgot") {
    return <ForgotPasswordPage />;
  }

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 2FA State
  const [is2FA, setIs2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState({
    challengeId: "",
    tempToken: "",
    email: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpInputRef = useRef(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [title, description] = copy[mode] || copy.login;

  // Auto-focus OTP input when 2FA is triggered
  useEffect(() => {
    if (is2FA && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [is2FA]);

  // Countdown timer for 2FA resend
  useEffect(() => {
    if (!is2FA || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [is2FA, countdown]);

  function getRedirectDestination(user) {
    if (location.state?.from?.pathname) {
      return location.state.from.pathname;
    }
    if (user?.role === "superadmin") return "/admin";
    if (user?.role === "editor") return "/editor";
    return "/dashboard";
  }

  async function handleResendOtp() {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      const result = await apiClient("/auth/resend-2fa", {
        method: "POST",
        body: {
          challengeId: twoFactorData.challengeId,
          tempToken: twoFactorData.tempToken,
          email: twoFactorData.email,
        },
      });

      if (result) {
        setTwoFactorData((prev) => ({
          ...prev,
          challengeId: result.challengeId || prev.challengeId,
          tempToken: result.tempToken || prev.tempToken,
        }));
      }

      setMessage("A fresh 6-digit security code has been sent to your email.");
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  }

  async function handleVerify2FA(e) {
    e.preventDefault();
    const cleanOtp = otpCode.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await apiClient("/auth/verify-2fa", {
        method: "POST",
        body: {
          challengeId: twoFactorData.challengeId,
          tempToken: twoFactorData.tempToken,
          email: twoFactorData.email,
          otp: cleanOtp,
          code: cleanOtp,
        },
      });

      const authenticatedUser = result.user || result.data?.user;
      setUser(authenticatedUser);
      navigate(getRedirectDestination(authenticatedUser), { replace: true });
    } catch (err) {
      setError(err.message || "The verification code is invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (is2FA) {
      return handleVerify2FA(event);
    }

    const form = new FormData(event.currentTarget);
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const body = Object.fromEntries(form);
      if (mode === "signup") {
        body.termsAccepted = form.get("termsAccepted") === "on";
      }
      if (mode === "reset") {
        body.token = params.get("token");
      }

      const endpoint = {
        login: "/auth/login",
        signup: "/auth/signup",
        forgot: "/auth/forgot-password",
        reset: "/auth/reset-password",
      }[mode];

      const result = await apiClient(endpoint, { method: "POST", body });

      if (result?.require2FA || result?.requiresOtp) {
        setIs2FA(true);
        setTwoFactorData({
          challengeId: result.challengeId || "",
          tempToken: result.tempToken || "",
          email: result.email || body.email || "",
        });
        setMessage("A 6-digit verification code has been dispatched to your email.");
        setCountdown(60);
      } else if (mode === "forgot" || mode === "reset") {
        setMessage(
          mode === "reset"
            ? "Password reset successful! You can now sign in with your new password."
            : "If an account with that email exists, a password reset link has been dispatched."
        );
      } else {
        const authenticatedUser = result.user || result.data?.user;
        setUser(authenticatedUser);
        navigate(getRedirectDestination(authenticatedUser), { replace: true });
      }
    } catch (requestError) {
      setError(requestError.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordFields = mode !== "forgot" && !is2FA;

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 my-8">
      {/* Brand Header with Logo */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-4">
          <Logo className="h-10 w-auto" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900">
          {is2FA ? "Two-Factor Verification" : title}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          {is2FA ? (
            <>
              Enter the 6-digit code sent to{" "}
              <strong className="text-slate-800">{twoFactorData.email}</strong> to authenticate your session.
            </>
          ) : (
            description
          )}
        </p>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="mb-6">
          <Feedback tone="error" role="alert">
            {error}
          </Feedback>
        </div>
      )}
      {message && (
        <div className="mb-6">
          <Feedback tone="info" role="status">
            {message}
          </Feedback>
        </div>
      )}

      {is2FA ? (
        /* ─── 2FA OTP STEP ─────────────────────────────────────────────────── */
        <form onSubmit={handleVerify2FA} className="space-y-5">
          <div>
            <label htmlFor="otp-code-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-center">
              Security Code
            </label>
            <input
              ref={otpInputRef}
              id="otp-code-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              required
              className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 rounded-xl px-4 py-3 transition-all outline-none bg-slate-50 focus:bg-white text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length < 6}
            className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl py-3 px-4 text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying Security Code…</span>
              </>
            ) : (
              "Confirm & Sign In →"
            )}
          </button>

          {/* Resend OTP Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <button
              type="button"
              onClick={() => {
                setIs2FA(false);
                setOtpCode("");
                setError("");
                setMessage("");
              }}
              className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              ← Back to login
            </button>

            {countdown > 0 ? (
              <span className="font-mono text-slate-400">
                Resend code in 0:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer disabled:opacity-50"
              >
                {resending ? "Sending…" : "Resend Code"}
              </button>
            )}
          </div>
        </form>
      ) : (
        /* ─── STANDARD AUTH FORM ───────────────────────────────────────────── */
        <form noValidate onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="account-name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="account-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Dr. Jordan Hayes"
                required
                className="w-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-xl px-4 py-2.5 text-sm transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          )}

          <div>
            <label htmlFor="account-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="w-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-xl px-4 py-2.5 text-sm transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {passwordFields && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="account-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                {mode === "login" && (
                  <NavLink
                    to="/forgot-password"
                    className="text-xs text-teal-700 hover:underline font-medium"
                  >
                    Forgot?
                  </NavLink>
                )}
              </div>

              <div className="relative">
                <input
                  id="account-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••••••"
                  required
                  className="w-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-xl px-4 py-2.5 pr-11 text-sm transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {mode !== "login" && (
                <p className="text-xs text-slate-500 mt-1">
                  Use 12 or more characters with uppercase, lowercase, and a number.
                </p>
              )}
            </div>
          )}

          {(mode === "signup" || mode === "reset") && (
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  required
                  className="w-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-xl px-4 py-2.5 pr-11 text-sm transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 leading-relaxed my-3">
              <input
                id="termsAccepted"
                type="checkbox"
                name="termsAccepted"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600 shrink-0 cursor-pointer accent-teal-700"
              />
              <label htmlFor="termsAccepted" className="cursor-pointer select-none">
                By creating an account, you agree to our{" "}
                <NavLink to="/terms" className="font-medium text-teal-700 hover:underline">
                  Terms &amp; Conditions
                </NavLink>{" "}
                and acknowledge our{" "}
                <NavLink to="/disclaimer" className="font-medium text-teal-700 hover:underline">
                  Medical Disclaimer
                </NavLink>.
              </label>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl py-3 px-4 text-sm shadow-md shadow-teal-700/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Please wait…</span>
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : mode === "signup" ? (
                "Create Account"
              ) : mode === "forgot" ? (
                "Send Reset Link"
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="text-center text-sm text-slate-500 pt-6 mt-6 border-t border-slate-100">
        {mode === "login" ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>
              Don&apos;t have an account?{" "}
              <NavLink to="/register" className="text-teal-700 hover:underline font-semibold">
                Sign up
              </NavLink>
            </span>
          </div>
        ) : mode === "signup" ? (
          <p>
            Already have an account?{" "}
            <NavLink to="/login" className="text-teal-700 hover:underline font-semibold">
              Sign in
            </NavLink>
          </p>
        ) : (
          <NavLink
            to="/login"
            className="text-teal-700 hover:underline font-semibold inline-flex items-center justify-center gap-1"
          >
            ← Return to sign in
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
