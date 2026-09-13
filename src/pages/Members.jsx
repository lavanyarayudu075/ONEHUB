import {
  Search,
  UserPlus,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
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

const MEMBERS_FIELD_MAP = {
  name: "name",
  email: "email",
  role: "role",
  department: "department",
  status: "status",
};

const MEMBERS_REQUIRED_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

const MEMBERS_PREVIEW_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
];

const MEMBERS_TEMPLATE_HEADERS = ["Name", "Email", "Role", "Department", "Status"];

// Same shape as the preview columns above — reused here so the
// downloaded file's column headers line up with what you'd expect from
// the import template.
const MEMBERS_EXPORT_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
];

const emptyForm = {
  name: "",
  email: "",
  role: "Member",
  department: "",
  status: "Active",
};

function Members() {
  const { members, isLoading, error, addMember, editMember, removeMember } = useAppData();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

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

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const openModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department === "Unassigned" ? "" : member.department,
      status: member.status,
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

  const handleSubmitMember = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department.trim(),
      status: form.status,
    };

    setIsSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await editMember(editingId, payload);
      } else {
        await addMember(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportMembers = async (rows) => {
    const existingEmails = new Set(members.map((m) => m.email.toLowerCase()));
    const results = [];

    for (const row of rows) {
      if (existingEmails.has(String(row.email).toLowerCase())) {
        results.push({
          label: row.email,
          status: "skipped",
          detail: "A member with this email already exists.",
        });
        continue;
      }

      try {
        await addMember({
          name: row.name,
          email: row.email,
          role: row.role || "Member",
          department: row.department || "",
          status: row.status || "Active",
        });
        results.push({ label: row.email, status: "success" });
      } catch (err) {
        console.error("Failed to import member:", row.email, err);
        results.push({
          label: row.email,
          status: "failed",
          detail: err.message || "Something went wrong.",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const hadProblems = results.some((r) => r.status !== "success");

    if (!hadProblems) {
      alert(`${successCount} member(s) imported successfully.`);
    } else {
      setImportResults(results);
      setIsImportResultsOpen(true);
    }
  };

  // Downloads whatever's currently visible in the table (respecting the
  // search box and role filter) as a real .xlsx file.
  const handleExportMembers = () => {
    if (filteredMembers.length === 0) {
      alert("There's nothing to export yet.");
      return;
    }

    const data = filteredMembers.map((member) => {
      const record = {};
      MEMBERS_EXPORT_COLUMNS.forEach((col) => {
        record[col.label] = member[col.key] ?? "";
      });
      return record;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "onehub-members-export.xlsx");
  };

  const openDeleteModal = (member) => {
    setDeleteTarget(member);
    setIsDeleteOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!deleteTarget) return;

    try {
      await removeMember(deleteTarget.id);
    } catch (err) {
      alert(err.message || "Failed to delete this member. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      <DashboardSidebar />

      <DashboardTopbar />

      <main className="px-6 py-8 lg:ml-64">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Members
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Manage people across your organisation.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleExportMembers}
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
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              <UserPlus className="h-5 w-5" />

              Add Member
            </button>

          </div>

        </div>

        {/* Load error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
            Couldn't load members from the server: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Members
                </p>

                <p className="text-2xl font-bold">
                  {members.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <UserCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Active
                </p>

                <p className="text-2xl font-bold">
                  {members.filter((m) => m.status === "Active").length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Managers
                </p>

                <p className="text-2xl font-bold">
                  {members.filter((m) => m.role === "Manager").length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-red-500/10 p-3 text-red-600 dark:bg-red-400/10 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Inactive
                </p>

                <p className="text-2xl font-bold">
                  {members.filter((m) => m.status === "Inactive").length}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Members Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]">

          {/* Filters */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 md:flex-row md:items-center md:justify-between">

            {/* Search */}
            <div className="relative w-full md:max-w-md">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
              />

            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="All">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-white/10">

                  <th className="px-6 py-4">
                    Member
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Department
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

                {filteredMembers.map((member) => (

                  <tr
                    key={member.id}
                    className="border-b border-slate-100 transition-all duration-150 hover:bg-slate-100 hover:ring-1 hover:ring-inset hover:ring-slate-400 dark:border-white/5 dark:hover:bg-white/[0.04] dark:hover:ring-white/20"
                  >

                    {/* Member */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 font-semibold text-cyan-600 dark:text-cyan-400">
                          {member.name.charAt(0)}
                        </div>

                        <div>

                          <p className="font-medium text-slate-900 dark:text-white">
                            {member.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {member.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Role */}
                    <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-300">
                      {member.role}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                      {member.department}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          member.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                        }`}
                      >
                        {member.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <RowActionsMenu
                        onEdit={() => openEditModal(member)}
                        onDelete={() => openDeleteModal(member)}
                      />
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* Loading */}
            {isLoading && (
              <div className="py-12 text-center text-slate-500">
                Loading members...
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredMembers.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No members found.
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingId ? "Edit Member" : "Add Member"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmitMember}>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={handleFormChange("name")}
                  placeholder="e.g. Ananya Rao"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={handleFormChange("email")}
                  placeholder="e.g. ananya@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                />
              </div>

              {/* Role + Department */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>

                  <select
                    value={form.role}
                    onChange={handleFormChange("role")}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department
                  </label>

                  <input
                    type="text"
                    value={form.department}
                    onChange={handleFormChange("department")}
                    placeholder="e.g. Engineering"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
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
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
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
        title="Import Members from Excel"
        fieldMap={MEMBERS_FIELD_MAP}
        requiredFields={MEMBERS_REQUIRED_FIELDS}
        previewColumns={MEMBERS_PREVIEW_COLUMNS}
        templateHeaders={MEMBERS_TEMPLATE_HEADERS}
        templateFileName="onehub-members-template.xlsx"
        onImport={handleImportMembers}
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
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
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
        onConfirm={confirmDeleteMember}
        title="Delete this member?"
        message={
          deleteTarget
            ? `${deleteTarget.name} will be permanently removed from your organisation. This can't be undone.`
            : ""
        }
      />

    </div>
  );
}

export default Members;