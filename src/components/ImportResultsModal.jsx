import { useRef } from "react";
import { X, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y";

const STATUS_STYLE = {
  success: { Icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400" },
  skipped: { Icon: MinusCircle, className: "text-slate-500" },
  failed: { Icon: XCircle, className: "text-red-600 dark:text-red-400" },
};

// Shown after an Excel import whenever at least one row didn't cleanly
// succeed — gives a per-row breakdown (imported / skipped / failed, with
// the specific reason for each) instead of the old single "N row(s)
// couldn't be imported, check the console" toast, which told you nothing
// about which rows or why without opening dev tools.
//
// results: [{ label, status: "success" | "skipped" | "failed", detail? }]
function ImportResultsModal({ isOpen, onClose, results = [] }) {
  const containerRef = useRef(null);
  useModalA11y({ isOpen, onClose, containerRef });

  if (!isOpen) return null;

  const successCount = results.filter((r) => r.status === "success").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-results-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl outline-none dark:border-white/10 dark:bg-slate-900"
      >

        <div className="mb-4 flex items-center justify-between">
          <h2 id="import-results-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Import Results
          </h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
            {successCount} imported
          </span>

          {skippedCount > 0 && (
            <span className="rounded-full bg-slate-500/10 px-3 py-1 font-medium text-slate-600 dark:bg-slate-400/10 dark:text-slate-400">
              {skippedCount} skipped
            </span>
          )}

          {failedCount > 0 && (
            <span className="rounded-full bg-red-500/10 px-3 py-1 font-medium text-red-600 dark:bg-red-400/10 dark:text-red-400">
              {failedCount} failed
            </span>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
          {results.map((r, i) => {
            const { Icon, className } = STATUS_STYLE[r.status] || STATUS_STYLE.failed;

            return (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-white/5"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${className}`} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {r.label}
                  </p>

                  {r.detail && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {r.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

export default ImportResultsModal;
