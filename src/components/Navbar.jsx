import { LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-wide text-white">
            ONE<span className="text-cyan-400">HUB</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm text-slate-300 hover:text-white">
            Home
          </a>

          <a href="#features" className="text-sm text-slate-300 hover:text-white">
            Features
          </a>

          <a href="#organizations" className="text-sm text-slate-300 hover:text-white">
            Organizations
          </a>

          <a href="#about" className="text-sm text-slate-300 hover:text-white">
            About
          </a>
        </div>

        {/* Login */}
        <button className="hidden rounded-lg border border-cyan-400/30 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 md:block">
          Login
        </button>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <a href="#home" className="text-slate-300">
              Home
            </a>

            <a href="#features" className="text-slate-300">
              Features
            </a>

            <a href="#organizations" className="text-slate-300">
              Organizations
            </a>

            <a href="#about" className="text-slate-300">
              About
            </a>

            <button className="rounded-lg border border-cyan-400/30 px-5 py-2 text-cyan-300">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;