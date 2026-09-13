import { Mail, Sparkles, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("sent");
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

          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {status === "sent" ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Check your email 📩
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                If <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span> is
                registered with ONEHUB, we've sent a link to reset your password.
                It expires in 10 minutes.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 transition-colors duration-500 dark:text-white">
                  Forgot password?
                </h1>
                <p className="mt-2 text-sm text-slate-600 transition-colors duration-500 dark:text-slate-400">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lavanyarayudu075@gmail.com"
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
                  {status === "loading" ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;