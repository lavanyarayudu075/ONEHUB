import {
  Search,
  Plus,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ListTodo,
  X,
  FileSpreadsheet,
  Download,
} from "lucide-react";

import * as XLSX from "xlsx";

import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import ImportExcelModal from "../components/ImportExcelModal";
import RowActionsMenu from "../components/RowActionsMenu";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAppData } from "../context/AppDataContext";

const TASKS_FIELD_MAP = {
  title: "title",
  description: "description",
  assignee: "assignee",
  department: "department",
  priority: "priority",
  "due date": "dueDate",
  duedate: "dueDate",
  status: "status",
};

const TASKS_REQUIRED_FIELDS = [
  { key: "title", label: "Title" },
  { key: "assignee", label: "Assignee" },
];

const TASKS_PREVIEW_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "assignee", label: "Assignee" },
  { key: "department", label: "Department" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
];

const TASKS_TEMPLATE_HEADERS = [
  "Title",
  "Description",
  "Assignee",
  "Department",
  "Priority",
  "Due Date",
  "Status",
];

// Same field set as the preview columns, plus description and due date
// so the exported file is a complete, re-importable record of each task.
const TASKS_EXPORT_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "assignee", label: "Assignee" },
  { key: "department", label: "Department" },
  { key: "priority", label: "Priority" },
  { key: "dueDate", label: "Due Date" },
  { key: "status", label: "Status" },
];

const emptyForm = {
  title: "",
  description: "",
  assignee: "",
  department: "",
  priority: "Medium",
  dueDate: "",
  status: "Pending",
};

function toDateInputValue(value) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDueDate(value) {
  if (!value) return "No due date";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function Tasks() {
  const { tasks, isLoading, error, addTask, editTask, removeTask } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Per-row outcome of the last Excel import, shown in the Import
  // Results popup below instead of a single "N rows failed" alert.
  const [importResults, setImportResults] = useState([]);
  const [isImportResultsOpen, setIsImportResultsOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase()) ||
      task.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const openModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      department: task.department === "Unassigned" ? "" : task.department,
      priority: task.priority,
      dueDate: toDateInputValue(task.dueDate),
      status: task.status,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.assignee.trim()) {
      setFormError("Task title and assignee are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      assignee: form.assignee.trim(),
      department: form.department.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
      status: form.status,
    };

    setIsSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await editTask(editingId, payload);
      } else {
        await addTask(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportTasks = async (rows) => {
    const results = [];

    for (const row of rows) {
      try {
        await addTask({
          title: row.title,
          description: row.description || "",
          assignee: row.assignee,
          department: row.department || "",
          priority: row.priority || "Medium",
          dueDate: toDateInputValue(row.dueDate),
          status: row.status || "Pending",
        });
        results.push({ label: row.title, status: "success" });
      } catch (err) {
        console.error("Failed to import task:", row.title, err);
        results.push({
          label: row.title,
          status: "failed",
          detail: err.message || "Something went wrong.",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const hadProblems = results.some((r) => r.status !== "success");

    if (!hadProblems) {
      alert(`${successCount} task(s) imported successfully.`);
    } else {
      setImportResults(results);
      setIsImportResultsOpen(true);
    }
  };

  // Downloads whatever's currently visible in the table (respecting the
  // search box and both filters) as a real .xlsx file.
  const handleExportTasks = () => {
    if (filteredTasks.length === 0) {
      alert("There's nothing to export yet.");
      return;
    }

    const data = filteredTasks.map((task) => {
      const record = {};
      TASKS_EXPORT_COLUMNS.forEach((col) => {
        record[col.label] = task[col.key] ?? "";
      });
      return record;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "onehub-tasks-export.xlsx");
  };

  const openDeleteModal = (task) => {
    setDeleteTarget(task);
    setIsDeleteOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!deleteTarget) return;

    try {
      await removeTask(deleteTarget.id);
    } catch (err) {
      alert(err.message || "Failed to delete this task. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      <DashboardSidebar />

      <DashboardTopbar />

      <main className="px-6 py-8 lg:ml-64">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm text-cyan-600 dark:text-cyan-400">
              Organisation Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Tasks
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Create, assign and track organisational tasks.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleExportTasks}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <Download className="h-5 w-5" />
              Export to Excel
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <FileSpreadsheet className="h-5 w-5" />
              Import from Excel
            </button>

            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </button>

          </div>

        </div>

        {/* Load error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
            Couldn't load tasks from the server: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                <ListTodo className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Total Tasks
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalTasks}
                </p>
              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {pendingTasks}
                </p>
              </div>

            </div>

          </div>

          {/* In Progress */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  In Progress
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {inProgressTasks}
                </p>
              </div>

            </div>

          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {completedTasks}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white dark:border-white/10 dark:bg-white/[0.03]">

          {/* Filters */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 xl:flex-row xl:items-center xl:justify-between">

            {/* Search */}
            <div className="relative w-full xl:max-w-md">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-slate-300 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
              />

            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="All">
                  All Priority
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

            </div>

          </div>

          {/* Task List */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>

                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-600 dark:border-white/10">

                  <th className="px-6 py-4">
                    Task
                  </th>

                  <th className="px-6 py-4">
                    Assignee
                  </th>

                  <th className="px-6 py-4">
                    Department
                  </th>

                  <th className="px-6 py-4">
                    Priority
                  </th>

                  <th className="px-6 py-4">
                    Due Date
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTasks.map((task) => (

                  <tr
                    key={task.id}
                    className="border-b border-slate-100 transition-all duration-150 hover:bg-slate-100 hover:ring-1 hover:ring-inset hover:ring-slate-400 dark:border-white/5 dark:hover:bg-white/[0.04] dark:hover:ring-white/20"
                  >

                    {/* Task */}
                    <td className="px-6 py-5">

                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {task.title}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-slate-600">
                          {task.description}
                        </p>
                      </div>

                    </td>

                    {/* Assignee */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-xs font-semibold text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                          {task.assignee.charAt(0)}
                        </div>

                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {task.assignee}
                        </span>

                      </div>

                    </td>

                    {/* Department */}
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                      {task.department}
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                            : task.priority === "Medium"
                            ? "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
                            : "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400"
                        }`}
                      >
                        {task.priority}
                      </span>

                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                      {formatDueDate(task.dueDate)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                            : task.status === "In Progress"
                            ? "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400"
                            : "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
                        }`}
                      >
                        {task.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <RowActionsMenu
                        onEdit={() => openEditModal(task)}
                        onDelete={() => openDeleteModal(task)}
                      />
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* Loading */}
            {isLoading && (
              <div className="py-12 text-center text-slate-600">
                Loading tasks...
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredTasks.length === 0 && (
              <div className="py-12 text-center text-slate-600">
                No tasks found.
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Create / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingId ? "Edit Task" : "Create Task"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmitTask}>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Task Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={handleFormChange("title")}
                  placeholder="e.g. Prepare Q3 budget review"
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={form.description}
                  onChange={handleFormChange("description")}
                  placeholder="What needs to be done?"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                />
              </div>

              {/* Assignee + Department */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Assignee
                  </label>

                  <input
                    type="text"
                    value={form.assignee}
                    onChange={handleFormChange("assignee")}
                    placeholder="e.g. Sneha Patel"
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department
                  </label>

                  <input
                    type="text"
                    value={form.department}
                    onChange={handleFormChange("department")}
                    placeholder="e.g. Finance"
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:focus:border-cyan-400/40"
                  />
                </div>

              </div>

              {/* Priority + Due Date */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={handleFormChange("priority")}
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={handleFormChange("dueDate")}
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:focus:border-cyan-400/40"
                  />
                </div>

              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={handleFormChange("status")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Task"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Import from Excel Modal */}
      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Tasks from Excel"
        fieldMap={TASKS_FIELD_MAP}
        requiredFields={TASKS_REQUIRED_FIELDS}
        previewColumns={TASKS_PREVIEW_COLUMNS}
        templateHeaders={TASKS_TEMPLATE_HEADERS}
        templateFileName="onehub-tasks-template.xlsx"
        onImport={handleImportTasks}
      />

      {/* Import Results — shown only when at least one row didn't cleanly
          succeed, so you know exactly which rows and why instead of just
          a failure count. */}
      {isImportResultsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Import Results
              </h2>

              <button
                onClick={() => setIsImportResultsOpen(false)}
                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">

              {importResults.map((r, i) => (

                <div
                  key={i}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-white/5"
                >

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {r.label}
                    </p>

                    {r.detail && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {r.detail}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      r.status === "success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : r.status === "skipped"
                        ? "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400"
                        : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                    }`}
                  >
                    {r.status}
                  </span>

                </div>

              ))}

            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsImportResultsOpen(false)}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Done
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Delete this task?"
        message={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This can't be undone.`
            : ""
        }
      />

    </div>
  );
}

export default Tasks;