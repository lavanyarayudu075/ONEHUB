import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// A "..." button that opens an Edit/Delete dropdown. Used on Members rows,
// Tasks rows, and Department cards.
function RowActionsMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 144; // matches w-36 below

    setPosition({
      top: rect.bottom + 6,
      left: Math.max(8, rect.right - menuWidth),
    });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-50 w-36 rounded-xl border border-slate-300 bg-white p-1.5 shadow-xl shadow-slate-300/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/40"
          >
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

export default RowActionsMenu;