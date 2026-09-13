import { LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-wide text-slate-900 transition-colors duration-500 dark:text-white">
            ONE<span className="text-cyan-600 dark:text-cyan-400">HUB</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Home
          </a>

          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Features
          </a>

          <a href="#organizations" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Organizations
          </a>

          
        </div>

        {/* Right side: Theme Toggle + Login (desktop only) */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
            <Link
            to="/login"
            className="rounded-lg border border-cyan-500/40 px-5 py-2 text-sm font-medium text-cyan-600 transition hover:bg-cyan-500/10 dark:border-cyan-400/30 dark:text-cyan-300 dark:hover:bg-cyan-400/10"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-900 dark:text-white md:hidden"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 transition-colors duration-500 dark:border-white/10 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-5">
            <a href="#home" className="text-slate-600 dark:text-slate-300">
              Home
            </a>

            <a href="#features" className="text-slate-600 dark:text-slate-300">
              Features
            </a>

            <a href="#organizations" className="text-slate-600 dark:text-slate-300">
              Organizations
            </a>

            <a href="#about" className="text-slate-600 dark:text-slate-300">
              About
            </a>

            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
                <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-cyan-500/40 px-5 py-2 text-cyan-600 dark:border-cyan-400/30 dark:text-cyan-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;