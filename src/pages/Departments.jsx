import {
  Search,
  Plus,
  Users,
  Building2,
  UserRound,
  Activity,
  X,
  FileSpreadsheet,
} from "lucide-react";

import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import ImportExcelModal from "../components/ImportExcelModal";
import DepartmentDetailsModal from "../components/DepartmentDetailsModal";
import RowActionsMenu from "../components/RowActionsMenu";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAppData } from "../context/AppDataContext";

const DEPARTMENTS_FIELD_MAP = {
  name: "name",
  description: "description",
  manager: "manager",
  status: "status",
};

const DEPARTMENTS_REQUIRED_FIELDS = [
  { key: "name", label: "Name" },
  { key: "manager", label: "Manager" },
];

const DEPARTMENTS_PREVIEW_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "manager", label: "Manager" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
];

const DEPARTMENTS_TEMPLATE_HEADERS = ["Name", "Description", "Manager", "Status"];

const emptyForm = {
  name: "",
  description: "",
  manager: "",
  status: "Active",
};

function Departments() {
  const {
    departments,
    members,
    tasks,
    isLoading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment,
  } = useAppData();
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [isImportOpen, setIsImportOpen] = useState(false);

  const [viewDepartment, setViewDepartment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase())
  );

  const getDepartmentMemberCount = (departmentName) =>
    members.filter((m) => m.department === departmentName).length;

  const totalMembers = members.length;

  const uniqueManagers = new Set(
    departments.map((department) => department.manager)
  ).size;

  const activeDepartments = departments.filter(
    (department) => department.status === "Active"
  ).length;

  const openModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);
    setForm({
      name: department.name,
      description: department.description,
      manager: department.manager,
      status: department.status,
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

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.manager.trim()) {
      setFormError("Department name and manager are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      manager: form.manager.trim(),
      status: form.status,
    };

    setIsSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await editDepartment(editingId, payload);
      } else {
        await addDepartment(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportDepartments = async (rows) => {
    const existingNames = new Set(departments.map((d) => d.name.toLowerCase()));
    const newRows = rows.filter((row) => !existingNames.has(String(row.name).toLowerCase()));

    let failures = 0;

    for (const row of newRows) {
      try {
        await addDepartment({
          name: row.name,
          description: row.description || "",
          manager: row.manager || "Unassigned",
          status: row.status || "Active",
        });
      } catch (err) {
        console.error("Failed to import department:", row.name, err);
        failures += 1;
      }
    }

    if (failures > 0) {
      alert(`${failures} row(s) couldn't be imported. Check the console for details.`);
    }
  };

  const openDepartmentDetails = (department) => {
    setViewDepartment(department);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (department) => {
    setDeleteTarget(department);
    setIsDeleteOpen(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!deleteTarget) return;

    try {
      await removeDepartment(deleteTarget.id);
    } catch (err) {
      alert(err.message || "Failed to delete this department. Please try again.");
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
              Organisation Structure
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Departments
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Organise teams and manage departmental responsibilities.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

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
              Add Department
            </button>

          </div>

        </div>

        {/* Load error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
            Couldn't load departments from the server: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Total Departments
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {departments.length}
                </p>
              </div>

            </div>

          </div>

          {/* Members */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Total Members
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalMembers.toLocaleString()}
                </p>
              </div>

            </div>

          </div>

          {/* Managers */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Department Managers
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {uniqueManagers}
                </p>
              </div>

            </div>

          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Active Departments
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {activeDepartments}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Search */}
        <div className="mb-6">

          <div className="relative w-full max-w-md">

            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/40 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
            />

          </div>

        </div>

        {/* Department Grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredDepartments.map((department) => (

            <div
              key={department.id}
              className="group rounded-2xl border border-slate-300 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-slate-900/[0.05] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/20 dark:hover:bg-white/[0.05]"
            >

              {/* Card Header */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:from-cyan-400/10 dark:to-violet-500/10 dark:text-cyan-400">
                    <Building2 className="h-6 w-6" />
                  </div>

                  <div>

                    <h2 className="font-semibold text-slate-900 dark:text-white">
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

                <RowActionsMenu
                  onEdit={() => openEditModal(department)}
                  onDelete={() => openDeleteModal(department)}
                />

              </div>

              {/* Description */}
              <p className="mt-5 min-h-[48px] text-sm leading-relaxed text-slate-600">
                {department.description}
              </p>

              {/* Manager */}
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-white/5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-sm font-semibold text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                  {department.manager.charAt(0)}
                </div>

                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-500">
                    Department Manager
                  </p>

                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {department.manager}
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/5">

                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">

                  <Users className="h-4 w-4" />

                  {getDepartmentMemberCount(department.name)} members

                </div>

                <button
                  onClick={() => openDepartmentDetails(department)}
                  className="text-sm font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-slate-300 bg-white py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-slate-600 dark:text-slate-400">
              Loading departments...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredDepartments.length === 0 && (
          <div className="rounded-2xl border border-slate-300 bg-white py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">

            <Building2 className="mx-auto h-10 w-10 text-slate-600" />

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              No departments found.
            </p>

          </div>
        )}

      </main>

      {/* Add / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingId ? "Edit Department" : "Add Department"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmitDepartment}>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Department Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={handleFormChange("name")}
                  placeholder="e.g. Product Design"
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
                  placeholder="What does this department do?"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                />
              </div>

              {/* Manager + Status */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Manager
                  </label>

                  <input
                    type="text"
                    value={form.manager}
                    onChange={handleFormChange("manager")}
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={handleFormChange("status")}
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

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
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Department"}
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
        title="Import Departments from Excel"
        fieldMap={DEPARTMENTS_FIELD_MAP}
        requiredFields={DEPARTMENTS_REQUIRED_FIELDS}
        previewColumns={DEPARTMENTS_PREVIEW_COLUMNS}
        templateHeaders={DEPARTMENTS_TEMPLATE_HEADERS}
        templateFileName="onehub-departments-template.xlsx"
        onImport={handleImportDepartments}
      />

      {/* Department Details Modal */}
      <DepartmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        department={viewDepartment}
        members={members}
        tasks={tasks}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteDepartment}
        title="Delete this department?"
        message={
          deleteTarget
            ? `${deleteTarget.name} will be permanently removed. Members already assigned to it will keep that department name on their profile until you update them.`
            : ""
        }
      />

    </div>
  );
}

export default Departments;