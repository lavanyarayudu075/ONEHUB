import {
  Bell,
  LogOut,
  Search,
  UserCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardTopbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-300 bg-white/95 px-6 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-950/80 lg:ml-64">

      {/* Search */}
      <div className="relative hidden w-full max-w-md md:block">

        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-xl border border-slate-300 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/40 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/30"
        />

      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-4">

        {/* Notifications */}
        <button className="relative rounded-xl border border-slate-300 bg-slate-100 p-2.5 text-slate-600 transition hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:text-white">

          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />

        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]"
          >

            <UserCircle className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />

            <div className="hidden text-left sm:block">

              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.name || "Admin User"}
              </p>

              <p className="text-xs capitalize text-slate-600">
                {user?.role || "Administrator"}
              </p>

            </div>

          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-300 bg-white p-2 shadow-xl shadow-slate-300/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/40">

              <div className="border-b border-slate-200 px-3 py-2 dark:border-white/10">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name || "Admin User"}
                </p>
                <p className="truncate text-xs text-slate-600">
                  {user?.email}
                </p>
                {user?.organizationName && (
                  <p className="mt-1 truncate text-xs text-cyan-600 dark:text-cyan-400">
                    {user.organizationName}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}

export default DashboardTopbar;