import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

// Replaces raw alert()/window.confirm()-adjacent error popups with small,
// dismissible cards stacked in the corner of the screen — styled to match
// the rest of the app (rounded-2xl, slate/white card, dark: variants)
// instead of the browser's native alert box.
//
// Usage: const toast = useToast(); toast.success("Saved!"); toast.error(err.message);

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    barClass: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-500/10 dark:bg-red-400/10",
    barClass: "bg-red-500",
  },
  info: {
    icon: Info,
    iconClass: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-400/10",
    barClass: "bg-cyan-500",
  },
};

const DEFAULT_DURATION = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message, { type = "info", duration = DEFAULT_DURATION } = {}) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  // Convenience wrappers so call sites read as toast.success(...) /
  // toast.error(...) instead of toast.show(msg, { type: "success" }).
  const value = {
    show,
    dismiss,
    success: (message, opts) => show(message, { ...opts, type: "success" }),
    error: (message, opts) => show(message, { ...opts, type: "error" }),
    info: (message, opts) => show(message, { ...opts, type: "info" }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-3 px-4 sm:items-end sm:right-4 sm:left-auto">
          {toasts.map((toast) => {
            const variant = VARIANTS[toast.type] || VARIANTS.info;
            const Icon = variant.icon;

            return (
              <div
                key={toast.id}
                role="status"
                className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/40"
              >
                <div className={`absolute inset-y-0 left-0 w-1 ${variant.barClass}`} />

                <div className="flex items-start gap-3 py-3 pl-5 pr-3">
                  <div className={`mt-0.5 rounded-lg p-1.5 ${variant.iconBg} ${variant.iconClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <p className="flex-1 pt-1 text-sm text-slate-700 dark:text-slate-300">
                    {toast.message}
                  </p>

                  <button
                    onClick={() => dismiss(toast.id)}
                    className="mt-0.5 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}