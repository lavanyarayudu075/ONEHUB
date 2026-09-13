import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Sparkles,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [organisationName, setOrganisationName] = useState("");
  const [organisationType, setOrganisationType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/register`,
        {
          organisationName,
          organisationType,
          name,
          email,
          password,
        }
      );

      console.log("Registration successful:", response.data);

      alert(response.data.message);

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
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
      
      {/* Main Container */}

      <div className="relative z-10 w-full max-w-lg">

        {/* Logo */}

        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">

            <Sparkles className="h-5 w-5 text-white" />

          </div>

          <span className="text-2xl font-bold tracking-wide text-slate-900 transition-colors duration-500 dark:text-white">

            ONE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>

          </span>

        </Link>

        {/* Registration Card */}

        <div className="rounded-3xl border border-slate-400 bg-white p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-2xl transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 sm:p-10">

          {/* Heading */}

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900 transition-colors duration-500 dark:text-white">

              Create your organisation

            </h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">

              Set up your organisation and start using ONEHUB

            </p>

          </div>

          {/* Form */}

          <form
          onSubmit={handleSubmit}
          className="space-y-5">

            {/* Organisation Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                Organisation Name

              </label>

              <div className="relative">

                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
  type="text"
  placeholder="Enter organisation name"
  value={organisationName}
  onChange={(e) => setOrganisationName(e.target.value)}
  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50"
/>

              </div>

            </div>

            {/* Organisation Type */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                Organisation Type

              </label>

              <select
  value={organisationType}
  onChange={(e) => setOrganisationType(e.target.value)}
  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-700 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:focus:border-cyan-400/50"
>

                <option value="">Select organisation type</option>

                <option value="school">School</option>

                <option value="institution">University</option>

                <option value="ngo">NGO</option>

                <option value="hospital">Hospital</option>

                <option value="organisation">Organisation</option>

              </select>

            </div>

            {/* Admin Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                Admin Name

              </label>

              <div className="relative">

                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
  type="text"
  placeholder="Enter your full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50"
/>

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                Admin Email
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
<input
  type="email"
  placeholder="admin@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50"
/>

              </div>

            </div>
             {/* Password */}
<div>
  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Password
  </label>
  <div className="relative">
    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Create a password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300"
    >
      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  </div>
</div>

{/* Confirm Password */}
<div>
  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Confirm Password
  </label>
  <div className="relative">
    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm your password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/50"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300"
    >
      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  </div>
</div>

            {/* Create Button */}

<button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Organisation..." : "Create Organisation"}
</button>

          </form>

          {/* Login */}

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;