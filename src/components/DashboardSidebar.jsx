import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Members",
    icon: Users,
    path: "/dashboard/members",
  },
  {
    label: "Departments",
    icon: Building2,
    path: "/dashboard/departments",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    path: "/dashboard/tasks",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/dashboard/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-300 bg-white p-2 text-slate-900 shadow-md dark:border-white/10 dark:bg-slate-900 dark:text-white lg:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-300 bg-white/95 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-950/95 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-300 px-6 dark:border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              ONE<span className="text-cyan-600 dark:text-cyan-400">HUB</span>
            </h1>

            <p className="text-xs text-slate-600">
              Organisation Platform
            </p>
          </div>
        </div>

        {/* Organisation */}
        <div className="mx-4 mt-6 rounded-xl border border-slate-300 bg-slate-100 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs text-slate-600">
            ORGANISATION
          </p>

          <p className="mt-1 truncate font-medium text-slate-900 dark:text-white">
            {user?.organizationName || "Demo Organisation"}
          </p>

          <p className="mt-1 truncate text-xs capitalize text-cyan-600 dark:text-cyan-400">
            {user?.role || "Administrator"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Workspace
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              // Overview ("/dashboard") should only be active on an exact
              // match, otherwise it'd stay highlighted on every sub-page
              // too (since they all start with "/dashboard").
              const isActive =
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-300 p-4 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-red-500/10 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-400/10 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;