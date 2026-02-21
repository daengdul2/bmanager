"use client";

import { useTaskManager } from "@/context/TaskManagerContext";

export default function GlobalTaskProgress() {
  const { tasks, removeTask } = useTaskManager();

  if (tasks.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-md space-y-2 z-50">
      {tasks.map((task) => (
        <div key={task.id} className="bg-slate-900 text-white p-4 rounded-xl shadow">
          <div className="text-xs mb-2">{task.label}</div>

          <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>

          <div className="text-right text-xs mt-1">
            {task.status === "error" ? "Error" : `${task.progress}%`}
          </div>

          {task.status !== "running" && (
            <button
              onClick={() => removeTask(task.id)}
              className="text-xs text-gray-400 mt-2 animate-pulse"
            >
              Tutup
            </button>
          )}
        </div>
      ))}
    </div>
  );
}