// Shared stat block — the same icon+label+value card was hand-duplicated
// four times each in Members.jsx, Departments.jsx and Tasks.jsx (and a
// slightly different flavor in Analytics.jsx). This is that markup,
// pulled out once, parameterized by icon, label, value and color.
//
// `tone` picks a color pairing (icon color + icon background tint) from
// the palette already used across the app, so call sites just say
// tone="cyan" instead of repeating the two Tailwind classes every time.
//
// `subtext` is optional — Analytics-style cards ("6 of 8 active") pass
// it, plain stat cards (Members/Departments/Tasks) leave it out.

const TONES = {
  cyan: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  violet: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400",
  red: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400",
  orange: "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400",
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
};

function StatCard({ icon: Icon, label, value, subtext, tone = "cyan" }) {
  const toneClass = TONES[tone] || TONES.cyan;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm text-slate-600 dark:text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold">
            {value}
          </p>

          {subtext && (
            <p className="mt-1 text-xs text-slate-500">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;