import {
  GraduationCap,
  Building2,
  HeartHandshake,
  Hospital,
  BriefcaseBusiness,
} from "lucide-react";
const organizations = [
  {
    icon: GraduationCap,
    title: "Schools",
    description:
      "Manage students, teachers, academics, attendance, communication, and administration.",
  },
  {
    icon: Building2,
    title: "Institutions",
    description:
      "Centralize departments, staff, operations, resources, and institutional analytics.",
  },
  {
    icon: HeartHandshake,
    title: "NGOs",
    description:
      "Coordinate volunteers, projects, beneficiaries, fundraising, and social impact.",
  },
  {
    icon: Hospital,
    title: "Hospitals",
    description:
      "Connect staff, departments, operations, resources, and administrative workflows.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Organisations",
    description:
      "Manage teams, workflows, employees, projects, analytics, and business operations.",
  },
];
function Organizations() {
  return (
    <section
      id="organizations"
      className="relative overflow-hidden bg-white px-6 py-24 transition-colors duration-500 dark:bg-slate-950"
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-float-slow absolute -right-24 top-0 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl"
        />
        <div
          className="animate-float-slower absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
            Built For Everyone
          </p>
          <h2 className="text-4xl font-bold text-slate-900 transition-colors duration-500 dark:text-white sm:text-5xl">
            One platform. Multiple possibilities.
          </h2>
          <p className="mt-5 text-lg text-slate-600 transition-colors duration-500 dark:text-slate-400">
            ONEHUB adapts to the unique needs of different types of
            organisations.
          </p>
        </div>
        {/* Organization Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {organizations.map((organization) => {
            const Icon = organization.icon;
            return (
              <div
                key={organization.title}
                className="group rounded-2xl border-2 border-slate-300 bg-slate-900/[0.03] p-6 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-black hover:bg-slate-900/[0.06] dark:border dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-white/40"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-cyan-400/20 text-violet-600 transition group-hover:scale-110 dark:text-violet-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 transition-colors duration-500 dark:text-white">
                  {organization.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 transition-colors duration-500 dark:text-slate-400">
                  {organization.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default Organizations;