import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={`doodle-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      aria-pressed={isLight}
    >
      <svg className="doodle-defs" aria-hidden="true">
        <filter id="onehub-wobble" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
        </filter>
      </svg>

      <span className="icon-stack">
        <span className="moon-face">
          <svg viewBox="0 0 40 40" filter="url(#onehub-wobble)">
            <path
              className="moon-body"
              d="M20 3c9.4 0 17 7.6 17 17s-7.6 17-17 17S3 29.4 3 20c0-1 .1-2 .3-3 1.7 6.7 7.8 11.6 15 11.6 8.6 0 15.5-7 15.5-15.6 0-5.7-3-10.6-7.6-13.3C17.9 3.3 19 3 20 3z"
            />
            <circle className="moon-shade" cx="14" cy="16" r="2.2" />
            <circle className="moon-shade" cx="20" cy="24" r="1.6" />
            <circle className="moon-shade" cx="12" cy="24" r="1.2" />
          </svg>
        </span>
        <span className="sun-face">
          <svg viewBox="0 0 40 40" filter="url(#onehub-wobble)">
            <circle className="sun-core" cx="20" cy="20" r="9" />
            <g>
              <line className="ray" x1="20" y1="2" x2="20" y2="8" />
              <line className="ray" x1="20" y1="32" x2="20" y2="38" />
              <line className="ray" x1="2" y1="20" x2="8" y2="20" />
              <line className="ray" x1="32" y1="20" x2="38" y2="20" />
              <line className="ray" x1="7" y1="7" x2="11.5" y2="11.5" />
              <line className="ray" x1="28.5" y1="28.5" x2="33" y2="33" />
              <line className="ray" x1="33" y1="7" x2="28.5" y2="11.5" />
              <line className="ray" x1="11.5" y1="28.5" x2="7" y2="33" />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}