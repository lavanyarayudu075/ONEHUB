import {
  Building2,
  Mail,
  Phone,
  Globe,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";

import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

function Settings() {
  const [organisationName, setOrganisationName] =
    useState("Demo Organisation");

  const [organisationType, setOrganisationType] =
    useState("Educational Institution");

  const [description, setDescription] =
    useState(
      "A modern organisation powered by ONEHUB."
    );

  const [email, setEmail] =
    useState("admin@demoorganisation.com");

  const [phone, setPhone] =
    useState("+91 98765 43210");

  const [website, setWebsite] =
    useState("https://demoorganisation.com");

  const [notifications, setNotifications] =
    useState(true);

  const [emailAlerts, setEmailAlerts] =
    useState(true);

  const [twoFactor, setTwoFactor] =
    useState(false);

  const handleSave = () => {
    alert("Organisation settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      <DashboardSidebar />

      <DashboardTopbar />

      <main className="px-6 py-8 lg:ml-64">

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm text-cyan-600 dark:text-cyan-400">
            Workspace Configuration
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your organisation and ONEHUB preferences.
          </p>

        </div>

        <div className="mx-auto max-w-5xl space-y-6">

          {/* Organisation Profile */}
          <section className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]">

            <div className="border-b border-slate-200 p-6 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Organisation Profile
                  </h2>

                  <p className="text-sm text-slate-500">
                    Basic information about your organisation.
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">

              {/* Organisation Name */}
              <div>

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Organisation Name
                </label>

                <input
                  type="text"
                  value={organisationName}
                  onChange={(e) =>
                    setOrganisationName(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                />

              </div>

              {/* Organisation Type */}
              <div>

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Organisation Type
                </label>

                <select
                  value={organisationType}
                  onChange={(e) =>
                    setOrganisationType(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                >

                  <option>
                    Educational Institution
                  </option>

                  <option>
                    School
                  </option>

                  <option>
                    Hospital
                  </option>

                  <option>
                    NGO
                  </option>

                  <option>
                    Corporate Organisation
                  </option>

                  <option>
                    Government Organisation
                  </option>

                </select>

              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                />

              </div>

            </div>

          </section>

          {/* Contact Information */}
          <section className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]">

            <div className="border-b border-slate-200 p-6 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                  <Mail className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    Contact Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Contact details for your organisation.
                  </p>

                </div>

              </div>

            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                  />

                </div>

              </div>

              {/* Phone */}
              <div>

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                  />

                </div>

              </div>

              {/* Website */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-400">
                  Website
                </label>

                <div className="relative">

                  <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400/40"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* Preferences */}
          <section className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]">

            <div className="border-b border-slate-200 p-6 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400">
                  <Bell className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Control how ONEHUB communicates with you.
                  </p>

                </div>

              </div>

            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">

              {/* Notifications */}
              <div className="flex items-center justify-between p-6">

                <div>

                  <p className="font-medium">
                    Push Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive notifications about organisation activity.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    notifications
                      ? "bg-cyan-500 dark:bg-cyan-400"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* Email Alerts */}
              <div className="flex items-center justify-between p-6">

                <div>

                  <p className="font-medium">
                    Email Alerts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive important activity updates by email.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setEmailAlerts(!emailAlerts)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    emailAlerts
                      ? "bg-cyan-500 dark:bg-cyan-400"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      emailAlerts
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* Security */}
          <section className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]">

            <div className="border-b border-slate-200 p-6 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    Security
                  </h2>

                  <p className="text-sm text-slate-500">
                    Protect your organisation account.
                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center justify-between p-6">

              <div>

                <p className="font-medium">
                  Two-Factor Authentication
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Add an extra layer of protection to your account.
                </p>

              </div>

              <button
                onClick={() =>
                  setTwoFactor(!twoFactor)
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  twoFactor
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              >

                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    twoFactor
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </section>

          {/* Save */}
          <div className="flex justify-end">

            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >

              <Save className="h-5 w-5" />

              Save Changes

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Settings;