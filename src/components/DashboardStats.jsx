import {
  Users,
  Building2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { useAppData } from "../context/AppDataContext";
import StatCard from "./StatCard";

// These four numbers used to be hardcoded ("1,248" members, "24"
// departments, etc.) with fake "+12.5% from last month" trend lines —
// none of it reflected the real organisation data. Now every value comes
// straight from AppDataContext, the same source Members/Departments/Tasks
// already use, so the dashboard can never drift out of sync with them.
//
// The old "% change from last month" trend line is gone entirely rather
// than faked — there's no historical snapshot of past counts to compute
// a real trend from yet. "Productivity" became "Completion Rate", the
// same task-completion metric Analytics.jsx already surfaces, computed
// the same way, so the two pages never disagree on what it means.
function DashboardStats() {
  const { members, departments, tasks } = useAppData();

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const stats = [
    {
      title: "Total Members",
      value: members.length.toLocaleString(),
      icon: Users,
      tone: "cyan",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      tone: "violet",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      tone: "blue",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          icon={stat.icon}
          label={stat.title}
          value={stat.value}
          tone={stat.tone}
        />
      ))}

    </div>
  );
}

export default DashboardStats;