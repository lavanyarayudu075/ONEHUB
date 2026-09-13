import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Gives any modal/overlay three standard accessibility behaviors for
// free, instead of every modal reimplementing (or forgetting) them:
//
//   1. Escape closes it.
//   2. Tab / Shift+Tab cycles focus only among elements inside the
//      modal — without this, tabbing eventually leaks out to the page
//      underneath a modal that's supposed to be blocking it.
//   3. Whatever had focus before the modal opened (usually the button
//      that triggered it) gets focus back once it closes, instead of
//      focus silently dropping to <body>.
//
// Usage inside a modal component:
//   const containerRef = useRef(null);
//   useModalA11y({ isOpen, onClose, containerRef });
//   if (!isOpen) return null;
//   return (
//     <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="my-modal-title" tabIndex={-1}>
//       ...
//     </div>
//   );
export function useModalA11y({ isOpen, onClose, containerRef }) {
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;

    // Wait a tick — the container isn't in the DOM yet on the very
    // render that flips isOpen to true.
    const focusTimer = setTimeout(() => {
      const container = containerRef.current;
      const focusables = container?.querySelectorAll(FOCUSABLE_SELECTOR);
      (focusables?.[0] || container)?.focus();
    }, 0);

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const nodes = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      // Give focus back to whatever opened the modal (e.g. the "Delete"
      // row action) instead of leaving keyboard focus stranded on
      // <body> once the modal unmounts.
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}
