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
      className="relative overflow-hidden bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Powerful Features
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Everything your organisation needs
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-400">
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
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300 transition group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-400">
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