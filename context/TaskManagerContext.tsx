"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type TaskType = "upload" | "delete" | "move";

export interface Task {
  id: string;
  type: TaskType;
  label: string;
  progress: number;
  status: "running" | "done" | "error";
}

interface TaskManagerContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "progress" | "status">) => string;
  updateTask: (id: string, progress: number) => void;
  finishTask: (id: string) => void;
  failTask: (id: string) => void;
  removeTask: (id: string) => void;
}

const TaskManagerContext = createContext<TaskManagerContextType | null>(null);

export function TaskManagerProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Omit<Task, "progress" | "status">): string => {
    const id = crypto.randomUUID();
    setTasks((prev) => [...prev, { ...task, id, progress: 0, status: "running" }]);
    return id;
  };

  const updateTask = (id: string, progress: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, progress } : t))
    );
  };

  const finishTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, progress: 100, status: "done" } : t
      )
    );
    setTimeout(() => {
    removeTask(id);
  }, 3000);
  };

  const failTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "error" } : t))
    );
    setTimeout(() => {
    removeTask(id);
  }, 3000);
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskManagerContext.Provider
      value={{ tasks, addTask, updateTask, finishTask, failTask, removeTask }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
}

export function useTaskManager() {
  const ctx = useContext(TaskManagerContext);
  if (!ctx) throw new Error("useTaskManager must be used inside TaskManagerProvider");
  return ctx;
}