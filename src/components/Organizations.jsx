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
      className="bg-slate-900/40 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Built For Everyone
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            One platform. Multiple possibilities.
          </h2>

          <p className="mt-5 text-lg text-slate-400">
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
                className="group rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/30"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-cyan-400/20 text-violet-300 transition group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {organization.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
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