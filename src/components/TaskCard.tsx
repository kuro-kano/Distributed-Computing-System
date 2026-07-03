"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  low: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  high: "bg-red-500/20 text-red-300 border-red-500/40",
};

function truncate(text: string, max: number) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !confirmingDelete && onEdit(task)}
          className={`mb-3 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-sm transition-shadow hover:shadow-md ${
            snapshot.isDragging ? "rotate-1 shadow-lg ring-2 ring-blue-500/50" : ""
          }`}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-100">{task.title}</h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mb-2 text-xs text-gray-400">
              {truncate(task.description, 80)}
            </p>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>{task.assignee ? task.assignee : "Unassigned"}</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>

          <div className="mt-2 flex justify-end border-t border-gray-700/60 pt-2">
            {confirmingDelete ? (
              <div
                className="flex items-center gap-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-gray-400">Delete?</span>
                <button
                  onClick={() => onDelete(task._id)}
                  className="rounded bg-red-600 px-2 py-0.5 font-medium text-white hover:bg-red-500"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded bg-gray-700 px-2 py-0.5 font-medium text-gray-200 hover:bg-gray-600"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
                className="text-xs text-gray-500 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
