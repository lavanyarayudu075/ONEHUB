import { AlertTriangle, X } from "lucide-react";

// Generic "are you sure?" modal used before any destructive action
// (deleting a member, department, or task). Replaces window.confirm().
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDeleteModal;