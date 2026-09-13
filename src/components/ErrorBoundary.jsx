import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

// React only catches render/lifecycle errors in a component that opts in
// via getDerivedStateFromError/componentDidCatch — a plain try/catch in a
// function component does NOT catch errors thrown while rendering, so
// this has to be a class component. Wraps each page (see App.jsx) so a
// bug in, say, Analytics.jsx's chart data can't blank out the entire app
// (sidebar, topbar, everything) — just that one page's content area.
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Goes to the same console.error your other error handling already
    // relies on — a real logging service is a "Testing & reliability"
    // step beyond what's needed right now.
    console.error("Caught by ErrorBoundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // A render error usually means some in-memory state got into a shape
    // a component didn't expect — resetting local state isn't enough to
    // guarantee that shape is gone, so a full reload is the reliable fix.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This section hit an unexpected error. The rest of ONEHUB is unaffected —
              reloading this page usually fixes it.
            </p>

            <button
              onClick={this.handleReset}
              className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              <RotateCcw className="h-4 w-4" />
              Reload
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
