import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`,
        { email, password }
      );

      // Save the token so future requests can prove who's logged in
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-200 px-6 py-12 transition-colors duration-500 dark:bg-slate-950">

      {/* Background Effects */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <span className="text-2xl font-bold tracking-wide text-slate-900 transition-colors duration-500 dark:text-white">
            ONE<span className="text-cyan-600 dark:text-cyan-400">HUB</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border-2 border-slate-400 bg-white p-8 shadow-xl shadow-slate-200/60 backdrop-blur-2xl transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/20 sm:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900 transition-colors duration-500 dark:text-white">
              Welcome back 👋
            </h1>

            <p className="mt-2 text-sm text-slate-600 transition-colors duration-500 dark:text-slate-400">
              Sign in to continue to your organisation
            </p>

          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
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
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50 dark:focus:ring-cyan-400/10"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50 dark:focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 bg-white dark:border-white/20 dark:bg-slate-900"
                />

                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Forgot password?
              </Link>

            </div>

            {errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && (
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Register for account
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;