"use client";

import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import Column from "@/components/Column";
import StatsBar from "@/components/StatsBar";
import TaskModal from "@/components/TaskModal";
import type { Task, TaskStatus, TaskFormData } from "@/types/task";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function SkeletonColumn() {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col rounded-lg bg-gray-800/60 p-3">
      <div className="mb-3 h-5 w-24 animate-skeleton rounded bg-gray-700" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-skeleton rounded-lg bg-gray-800 border border-gray-700"
          />
        ))}
      </div>
    </div>
  );
}

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  function getTasksByStatus(status: TaskStatus) {
    return tasks.filter((t) => t.status === status);
  }

  async function handleDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const previousTasks = tasks;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const sourceList = getTasksByStatus(sourceStatus);
    const moved = sourceList[source.index];
    if (!moved) return;

    sourceList.splice(source.index, 1);

    const destList =
      sourceStatus === destStatus ? sourceList : getTasksByStatus(destStatus);

    const updatedMoved = { ...moved, status: destStatus };
    destList.splice(destination.index, 0, updatedMoved);

    const otherTasks = tasks.filter(
      (t) => t.status !== sourceStatus && t.status !== destStatus
    );

    let nextTasks: Task[];
    if (sourceStatus === destStatus) {
      nextTasks = [...otherTasks, ...destList];
    } else {
      nextTasks = [...otherTasks, ...sourceList, ...destList];
    }

    setTasks(nextTasks);

    if (sourceStatus !== destStatus) {
      try {
        const res = await fetch(`/api/tasks/${moved._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destStatus }),
        });
        if (!res.ok) throw new Error("Update failed");
      } catch (error) {
        setTasks(previousTasks);
        toast.error("Failed to move task");
      }
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setActiveTask(undefined);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setModalMode("edit");
    setActiveTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setActiveTask(undefined);
  }

  async function handleModalSubmit(data: TaskFormData) {
    if (modalMode === "create") {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Create failed");
        const { task } = await res.json();
        setTasks((prev) => [task, ...prev]);
        toast.success("Task created");
        closeModal();
      } catch (error) {
        toast.error("Failed to create task");
      }
    } else if (activeTask) {
      try {
        const res = await fetch(`/api/tasks/${activeTask._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Update failed");
        const { task } = await res.json();
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
        toast.success("Task updated");
        closeModal();
      } catch (error) {
        toast.error("Failed to update task");
      }
    }
  }

  async function handleDelete(id: string) {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Task deleted");
    } catch (error) {
      setTasks(previousTasks);
      toast.error("Failed to delete task");
    }
  }

  const counts = {
    todo: getTasksByStatus("todo").length,
    inprogress: getTasksByStatus("inprogress").length,
    done: getTasksByStatus("done").length,
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Task Board</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New Task
        </button>
      </div>

      <StatsBar total={tasks.length} counts={counts} />

      {loading ? (
        <div className="flex flex-col gap-4 md:flex-row">
          {COLUMNS.map((col) => (
            <SkeletonColumn key={col.id} />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-4 md:flex-row">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={getTasksByStatus(col.id)}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {modalOpen && (
        <TaskModal
          mode={modalMode}
          task={activeTask}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
