import { Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setStatus("error");
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 transition-colors duration-500 dark:bg-slate-950">

      {/* Background Effects */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wide text-slate-900 transition-colors duration-500 dark:text-white">
            ONE<span className="text-cyan-600 dark:text-cyan-400">HUB</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border-2 border-slate-400 bg-white p-8 shadow-xl shadow-slate-200/60 backdrop-blur-2xl transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/20 sm:p-10">

          {status === "success" ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Password updated ✅
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 transition-colors duration-500 dark:text-white">
                  Set a new password
                </h1>
                <p className="mt-2 text-sm text-slate-600 transition-colors duration-500 dark:text-slate-400">
                  Choose a new password for your ONEHUB account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    New password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50 dark:focus:ring-cyan-400/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50 dark:focus:ring-cyan-400/10"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Updating..." : "Update password"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;