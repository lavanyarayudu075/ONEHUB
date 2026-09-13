import { X, Users, ListTodo, Mail, Building2 } from "lucide-react";

// Shows the real members and tasks that belong to a department, pulled
// from the shared AppDataContext (see src/context/AppDataContext.jsx) via
// props passed down from Departments.jsx.
function DepartmentDetailsModal({ isOpen, onClose, department, members, tasks }) {
  if (!isOpen || !department) return null;

  const departmentMembers = members.filter(
    (m) => m.department === department.name
  );

  const departmentTasks = tasks.filter(
    (t) => t.department === department.name
  );

  const completedTasks = departmentTasks.filter(
    (t) => t.status === "Completed"
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:from-cyan-400/10 dark:to-violet-500/10 dark:text-cyan-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {department.name}
              </h2>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                  department.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                }`}
              >
                {department.status}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description + Manager */}
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {department.description}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-sm font-semibold text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
            {department.manager.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-500">Department Manager</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{department.manager}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-900/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              Members
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {departmentMembers.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-900/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ListTodo className="h-4 w-4" />
              Tasks
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {departmentTasks.length}
              <span className="ml-1 text-sm font-normal text-slate-500">
                ({completedTasks} done)
              </span>
            </p>
          </div>
        </div>

        {/* Members list */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Members in this department
          </h3>

          {departmentMembers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-white/10">
              No members are assigned to this department yet.
            </p>
          ) : (
            <div className="space-y-2">
              {departmentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-900/[0.02] p-3 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                      <Mail className="h-3 w-3 shrink-0" />
                      {member.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">{member.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks list */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Tasks for this department
          </h3>

          {departmentTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-white/10">
              No tasks assigned to this department yet.
            </p>
          ) : (
            <div className="space-y-2">
              {departmentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-900/[0.02] p-3 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {task.assignee} • {task.dueDate}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      task.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : task.status === "In Progress"
                        ? "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400"
                        : "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DepartmentDetailsModal;