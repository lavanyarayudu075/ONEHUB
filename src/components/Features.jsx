import {
  BrainCircuit,
  Users,
  BarChart3,
  ShieldCheck,
  Workflow,
  Database,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Intelligence",
    description:
      "Use AI to analyze organisational data, generate insights, automate tasks, and support better decision-making.",
  },
  {
    icon: Users,
    title: "People Management",
    description:
      "Manage employees, students, staff, volunteers, departments, and teams from a centralized platform.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Transform organisational data into meaningful dashboards, reports, trends, and actionable insights.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based",
    description:
      "Control access using roles and permissions so every user sees only the information they are authorized to access.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive organisational processes and reduce manual work with intelligent workflows.",
  },
  {
    icon: Database,
    title: "Centralized Data",
    description:
      "Keep important organisational information securely connected in one centralized platform.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white px-6 py-24 transition-colors duration-500 dark:bg-slate-950"
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-float-slower absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div
          className="animate-float-slow absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-violet-400/10 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="animate-float-slower absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
            Powerful Features
          </p>

          <h2 className="text-4xl font-bold text-slate-900 transition-colors duration-500 dark:text-white sm:text-5xl">
            Everything your organisation needs
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-600 transition-colors duration-500 dark:text-slate-400">
            ONEHUB brings management, automation, analytics and AI together
            in one intelligent platform.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border-2 border-slate-300 bg-slate-900/[0.03] p-6 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-black hover:bg-slate-900/[0.06] dark:border dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-white/40"
              >

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-600 transition group-hover:scale-110 dark:text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 transition-colors duration-500 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600 transition-colors duration-500 dark:text-slate-400">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Features;