import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [departmentsRes, membersRes, tasksRes] = await Promise.all([
        api.get("/departments"),
        api.get("/members"),
        api.get("/tasks"),
      ]);

      setDepartments(departmentsRes.departments);
      setMembers(membersRes.members);
      setTasks(tasksRes.tasks);
    } catch (err) {
      console.error("Failed to load organisation data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addDepartment = async (payload) => {
    const { department } = await api.post("/departments", payload);
    setDepartments((prev) => [department, ...prev]);
    return department;
  };

  const editDepartment = async (id, payload) => {
    const { department } = await api.put(`/departments/${id}`, payload);
    setDepartments((prev) => prev.map((d) => (d.id === id ? department : d)));
    return department;
  };

  const removeDepartment = async (id) => {
    await api.delete(`/departments/${id}`);
    setDepartments((prev) => prev.filter((d) => d.id !== id));

    const [membersRes, tasksRes] = await Promise.all([api.get("/members"), api.get("/tasks")]);
    setMembers(membersRes.members);
    setTasks(tasksRes.tasks);
  };

  const addMember = async (payload) => {
    const { member } = await api.post("/members", payload);
    setMembers((prev) => [member, ...prev]);
    return member;
  };

  const editMember = async (id, payload) => {
    const { member } = await api.put(`/members/${id}`, payload);
    setMembers((prev) => prev.map((m) => (m.id === id ? member : m)));
    return member;
  };

  const removeMember = async (id) => {
    await api.delete(`/members/${id}`);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addTask = async (payload) => {
    const { task } = await api.post("/tasks", payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const editTask = async (id, payload) => {
    const { task } = await api.put(`/tasks/${id}`, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const value = {
    members,
    departments,
    tasks,
    isLoading,
    error,
    reload: loadAll,
    addMember,
    editMember,
    removeMember,
    addDepartment,
    editDepartment,
    removeDepartment,
    addTask,
    editTask,
    removeTask,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside an <AppDataProvider>");
  }

  return context;
}