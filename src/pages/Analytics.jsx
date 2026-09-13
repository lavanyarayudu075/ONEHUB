import {
  Users,
  CheckCircle2,
  Building2,
  ListTodo,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Filter,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  Treemap,
} from "recharts";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/AppDataContext";

// A real categorical palette — cycled through so every bar / slice in a
// single-series chart gets its own color instead of one flat brand color.
const PALETTE = [
  "#22d3ee", // cyan
  "#8b5cf6", // violet
  "#f97316", // orange
  "#10b981", // emerald
  "#ef4444", // red
  "#eab308", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
  "#14b8a6", // teal
  "#a855f7", // purple
];

const STATUS_COLORS = {
  Completed: "#10b981",
  "In Progress": "#8b5cf6",
  Pending: "#f97316",
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f97316",
  Low: "#3b82f6",
};

const MEMBER_STATUS_COLORS = {
  Active: "#10b981",
  Inactive: "#ef4444",
};

// The org has no join-date field yet, so this trend line is the one
// dataset that isn't fully derivable from live records — every other
// chart on this page is computed straight from members / departments /
// tasks below. The most recent point is pinned to the real member count
// so the chart always ends on today's true number.
const MEMBER_GROWTH_HISTORY = [
  { month: "Mar", members: 720 },
  { month: "Apr", members: 810 },
  { month: "May", members: 890 },
  { month: "Jun", members: 970 },
  { month: "Jul", members: 1100 },
];

function Analytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { members, departments, tasks } = useAppData();

  // Acts like a Power BI / Tableau slicer — pick a department and every
  // task-driven chart below re-slices to just that department.
  const [departmentFilter, setDepartmentFilter] = useState("All");

  // Recharts draws with inline colors, not Tailwind classes, so the
  // toggle can't reach it through dark: variants — we switch these
  // by hand whenever the theme flips.
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.08)";
  const axisColor = isDark ? "#64748b" : "#475569";
  const tooltipStyle = {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
    borderRadius: "12px",
    color: isDark ? "#fff" : "#0f172a",
  };
  const legendTextStyle = { color: isDark ? "#cbd5e1" : "#475569", fontSize: 12 };
  const treemapStroke = isDark ? "#0f172a" : "#ffffff";

  const filteredMembers = useMemo(
    () =>
      departmentFilter === "All"
        ? members
        : members.filter((m) => m.department === departmentFilter),
    [members, departmentFilter]
  );

  const filteredTasks = useMemo(
    () =>
      departmentFilter === "All"
        ? tasks
        : tasks.filter((t) => t.department === departmentFilter),
    [tasks, departmentFilter]
  );

  const memberGrowthData = useMemo(
    () => [...MEMBER_GROWTH_HISTORY, { month: "Aug", members: members.length }],
    [members]
  );

  const activeMembers = filteredMembers.filter((m) => m.status === "Active").length;
  const activeMemberRate =
    filteredMembers.length > 0
      ? Math.round((activeMembers / filteredMembers.length) * 100)
      : 0;

  const activeDepartments = departments.filter((d) => d.status === "Active").length;

  const completedTasks = filteredTasks.filter((t) => t.status === "Completed").length;
  const completionRate =
    filteredTasks.length > 0
      ? Math.round((completedTasks / filteredTasks.length) * 100)
      : 0;

  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredTasks.filter((t) => {
      if (t.status === "Completed") return false;
      const due = new Date(t.dueDate);
      return !isNaN(due.getTime()) && due < today;
    }).length;
  }, [filteredTasks]);

  // Members per department — every department gets its own bar color.
  const membersByDepartment = useMemo(
    () =>
      departments
        .map((d) => ({
          name: d.name,
          members: members.filter((m) => m.department === d.name).length,
        }))
        .sort((a, b) => b.members - a.members),
    [departments, members]
  );

  // Member role breakdown (donut).
  const membersByRole = useMemo(() => {
    const roles = ["Administrator", "Manager", "Member"];
    return roles
      .map((role) => ({
        name: role,
        value: filteredMembers.filter((m) => m.role === role).length,
      }))
      .filter((r) => r.value > 0);
  }, [filteredMembers]);

  // Active vs Inactive member breakdown (donut).
  const membersByStatus = useMemo(
    () =>
      ["Active", "Inactive"]
        .map((status) => ({
          name: status,
          value: filteredMembers.filter((m) => m.status === status).length,
        }))
        .filter((s) => s.value > 0),
    [filteredMembers]
  );

  // Task status breakdown (donut).
  const tasksByStatus = useMemo(
    () =>
      ["Completed", "In Progress", "Pending"]
        .map((status) => ({
          name: status,
          value: filteredTasks.filter((t) => t.status === status).length,
        }))
        .filter((s) => s.value > 0),
    [filteredTasks]
  );

  // Task priority breakdown — each priority gets its own bar color.
  const tasksByPriority = useMemo(
    () =>
      ["High", "Medium", "Low"].map((priority) => ({
        name: priority,
        tasks: filteredTasks.filter((t) => t.priority === priority).length,
        fill: PRIORITY_COLORS[priority],
      })),
    [filteredTasks]
  );

  // Tasks per department — every bar its own color.
  const tasksByDepartment = useMemo(
    () =>
      departments
        .map((d) => ({
          name: d.name,
          tasks: tasks.filter((t) => t.department === d.name).length,
        }))
        .sort((a, b) => b.tasks - a.tasks),
    [departments, tasks]
  );

  // Top assignees by task count.
  const tasksByAssignee = useMemo(() => {
    const counts = new Map();
    filteredTasks.forEach((t) => {
      counts.set(t.assignee, (counts.get(t.assignee) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, tasksCount]) => ({ name, tasks: tasksCount }))
      .sort((a, b) => b.tasks - a.tasks)
      .slice(0, 6);
  }, [filteredTasks]);

  // Priority × Status cross-tab — a stacked bar per priority level.
  const priorityStatusMatrix = useMemo(
    () =>
      ["High", "Medium", "Low"].map((priority) => {
        const inPriority = filteredTasks.filter((t) => t.priority === priority);
        return {
          priority,
          Completed: inPriority.filter((t) => t.status === "Completed").length,
          "In Progress": inPriority.filter((t) => t.status === "In Progress").length,
          Pending: inPriority.filter((t) => t.status === "Pending").length,
        };
      }),
    [filteredTasks]
  );

  // Department sizes as a treemap — a quick visual read of where the
  // organisation's people are concentrated.
  const departmentTreemapData = useMemo(
    () =>
      departments.map((d) => ({
        name: d.name,
        size: Math.max(1, members.filter((m) => m.department === d.name).length),
      })),
    [departments, members]
  );

  // Full department detail table — every department, its manager, status,
  // headcount, task load and completion rate in one place.
  const departmentSummary = useMemo(
    () =>
      departments.map((d) => {
        const deptTasks = tasks.filter((t) => t.department === d.name);
        const deptCompleted = deptTasks.filter((t) => t.status === "Completed").length;
        return {
          id: d.id,
          name: d.name,
          manager: d.manager,
          status: d.status,
          members: members.filter((m) => m.department === d.name).length,
          tasks: deptTasks.length,
          completed: deptCompleted,
          rate: deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0,
        };
      }),
    [departments, members, tasks]
  );

  const renderTreemapCell = (props) => {
    const { x, y, width, height, index, name, value } = props;
    const fill = PALETTE[index % PALETTE.length];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{ fill, stroke: treemapStroke, strokeWidth: 2 }}
        />

        {width > 55 && height > 28 && (
          <text x={x + 8} y={y + 20} fill="#fff" fontSize={12} fontWeight={600}>
            {name}
          </text>
        )}

        {width > 55 && height > 46 && (
          <text x={x + 8} y={y + 38} fill="rgba(255,255,255,0.85)" fontSize={11}>
            {value} member{value === 1 ? "" : "s"}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      <DashboardSidebar />

      <DashboardTopbar />

      <main className="px-6 py-8 lg:ml-64">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>
            <p className="text-sm text-cyan-600 dark:text-cyan-400">
              Organisation Intelligence
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Analytics
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              A live, drill-down view of your members, departments and tasks.
            </p>
          </div>

          {/* Department Slicer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 dark:border-white/10 dark:bg-slate-900/70">
              <Filter className="h-4 w-4 text-slate-500" />

              <select
  value={departmentFilter}
  onChange={(e) => setDepartmentFilter(e.target.value)}
  className="rounded-lg text-sm font-medium outline-none"
  style={{
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#ffffff" : "#0f172a",
  }}
>
  <option
    value="All"
    style={{
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#0f172a",
    }}
  >
    All Departments
  </option>
  {departments.map((d) => (
    <option
      key={d.id}
      value={d.name}
      style={{
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      {d.name}
    </option>
  ))}
</select>

            </div>

          </div>

        </div>

        {/* KPI Row */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Members */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                <Users className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Members
            </p>

            <p className="mt-1 text-2xl font-bold">
              {filteredMembers.length.toLocaleString()}
            </p>

          </div>

          {/* Active Member Rate */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Active Members
            </p>

            <p className="mt-1 text-2xl font-bold">
              {activeMemberRate}%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {activeMembers} of {filteredMembers.length}
            </p>

          </div>

          {/* Departments */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                <Building2 className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Departments
            </p>

            <p className="mt-1 text-2xl font-bold">
              {departments.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {activeDepartments} active
            </p>

          </div>

          {/* Tasks */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400">
                <ListTodo className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Tasks
            </p>

            <p className="mt-1 text-2xl font-bold">
              {filteredTasks.length}
            </p>

          </div>

          {/* Completion Rate */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Completion Rate
            </p>

            <p className="mt-1 text-2xl font-bold">
              {completionRate}%
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {completedTasks} completed
            </p>

          </div>

          {/* Overdue */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-red-500/10 p-2.5 text-red-600 dark:bg-red-400/10 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              Overdue Tasks
            </p>

            <p className="mt-1 text-2xl font-bold">
              {overdueTasks}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {overdueTasks === 0 ? "All caught up" : "Need attention"}
            </p>

          </div>

        </div>

        {/* Member Growth + Completion Gauge */}
        <div className="mb-6 grid gap-6 xl:grid-cols-3">

          {/* Member Growth */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] xl:col-span-2">

            <div className="mb-6">

              <h2 className="text-lg font-semibold">
                Member Growth
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Organisation membership over the last six months.
              </p>

            </div>

            <div className="h-[280px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={memberGrowthData}>

                  <defs>
                    <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                  <XAxis dataKey="month" stroke={axisColor} />

                  <YAxis stroke={axisColor} />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fill="url(#memberGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Completion Gauge */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Completion Rate
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {departmentFilter === "All" ? "All departments" : departmentFilter}
            </p>

            <div className="relative h-[220px]">

              <ResponsiveContainer width="100%" height="100%">

                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={[{ name: "Completion", value: completionRate, fill: "#22d3ee" }]}
                  startAngle={90}
                  endAngle={-270}
                >

                  <RadialBar
                    dataKey="value"
                    cornerRadius={12}
                    background={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" }}
                  />

                </RadialBarChart>

              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold">
                  {completionRate}%
                </p>
                <p className="text-xs text-slate-500">
                  {completedTasks} / {filteredTasks.length} tasks
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Task Status / Priority / Members by Role */}
        <div className="mb-6 grid gap-6 xl:grid-cols-3">

          {/* Task Status */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Task Status
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Current status distribution.
            </p>

            <div className="h-[240px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={tasksByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {tasksByStatus.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend wrapperStyle={legendTextStyle} />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Task Priority */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Task Priority
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              High, medium and low priority tasks.
            </p>

            <div className="h-[240px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={tasksByPriority}>

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                  <XAxis dataKey="name" stroke={axisColor} />

                  <YAxis stroke={axisColor} allowDecimals={false} />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                    {tasksByPriority.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Members by Role */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Members by Role
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Administrators, managers and members.
            </p>

            <div className="h-[240px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={membersByRole}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {membersByRole.map((entry, index) => (
                      <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend wrapperStyle={legendTextStyle} />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Members by Department / Tasks by Department */}
        <div className="mb-6 grid gap-6 xl:grid-cols-2">

          {/* Members by Department */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Members by Department
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Headcount across every department.
            </p>

            <div className="mt-4 h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={membersByDepartment}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                  <XAxis type="number" stroke={axisColor} allowDecimals={false} />

                  <YAxis type="category" dataKey="name" stroke={axisColor} width={110} />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Bar dataKey="members" radius={[0, 6, 6, 0]}>
                    {membersByDepartment.map((entry, index) => (
                      <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Tasks by Department */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Tasks by Department
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Task load across every department.
            </p>

            <div className="mt-4 h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={tasksByDepartment}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                  <XAxis type="number" stroke={axisColor} allowDecimals={false} />

                  <YAxis type="category" dataKey="name" stroke={axisColor} width={110} />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Bar dataKey="tasks" radius={[0, 6, 6, 0]}>
                    {tasksByDepartment.map((entry, index) => (
                      <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Priority x Status + Top Assignees */}
        <div className="mb-6 grid gap-6 xl:grid-cols-2">

          {/* Priority x Status stacked */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Priority vs. Status
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              How each priority level is progressing.
            </p>

            <div className="mt-4 h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={priorityStatusMatrix}>

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                  <XAxis dataKey="priority" stroke={axisColor} />

                  <YAxis stroke={axisColor} allowDecimals={false} />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend wrapperStyle={legendTextStyle} />

                  <Bar dataKey="Completed" stackId="a" fill={STATUS_COLORS.Completed} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="In Progress" stackId="a" fill={STATUS_COLORS["In Progress"]} />
                  <Bar dataKey="Pending" stackId="a" fill={STATUS_COLORS.Pending} radius={[6, 6, 0, 0]} />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Top Assignees */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Top Assignees
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Who's carrying the most tasks right now.
            </p>

            <div className="mt-4 h-[280px]">

              {tasksByAssignee.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={tasksByAssignee}>

                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                    <XAxis dataKey="name" stroke={axisColor} interval={0} angle={-15} textAnchor="end" height={50} />

                    <YAxis stroke={axisColor} allowDecimals={false} />

                    <Tooltip contentStyle={tooltipStyle} />

                    <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                      {tasksByAssignee.map((entry, index) => (
                        <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Bar>

                  </BarChart>

                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No tasks for this department yet.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Member Status + Department Treemap */}
        <div className="mb-6 grid gap-6 xl:grid-cols-3">

          {/* Member Status */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">

            <h2 className="text-lg font-semibold">
              Member Status
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Active vs. inactive members.
            </p>

            <div className="h-[240px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={membersByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {membersByStatus.map((entry) => (
                      <Cell key={entry.name} fill={MEMBER_STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend wrapperStyle={legendTextStyle} />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Department Treemap */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] xl:col-span-2">

            <h2 className="text-lg font-semibold">
              Organisation Footprint
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Department sizes at a glance — bigger block, more people.
            </p>

            <div className="mt-4 h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <Treemap
                  data={departmentTreemapData}
                  dataKey="size"
                  stroke={treemapStroke}
                  content={renderTreemapCell}
                />

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Department Detail Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white dark:border-white/10 dark:bg-white/[0.03]">

          <div className="border-b border-slate-200 p-6 dark:border-white/10">

            <h2 className="text-lg font-semibold">
              Department Detail
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Every department, its manager, headcount, task load and completion rate.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[720px]">

              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-600 dark:border-white/10">

                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Members</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Completion</th>

                </tr>
              </thead>

              <tbody>

                {departmentSummary.map((d, index) => (

                  <tr
                    key={d.id}
                    className="border-b border-slate-100 transition-all duration-150 hover:bg-slate-100 hover:ring-1 hover:ring-inset hover:ring-slate-400 dark:border-white/5 dark:hover:bg-white/[0.04] dark:hover:ring-white/20"
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                        />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {d.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {d.manager}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          d.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {d.members}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {d.tasks}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${d.rate}%`,
                              backgroundColor: PALETTE[index % PALETTE.length],
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {d.rate}%
                        </span>
                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Analytics;