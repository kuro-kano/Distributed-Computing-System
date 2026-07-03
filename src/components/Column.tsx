"use client";

import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard";
import type { Task, TaskStatus } from "@/types/task";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-600">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-60"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 7l2-4h14l2 4" />
        <path d="M9 12h6" />
      </svg>
      <p className="text-xs">No tasks yet</p>
    </div>
  );
}

export default function Column({ id, title, tasks, onEdit, onDelete }: ColumnProps) {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col rounded-lg bg-gray-800/60 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-gray-200">{title}</h2>
        <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[120px] flex-1 rounded-md p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-700/40" : ""
            }`}
          >
            {tasks.length === 0 ? (
              <EmptyState />
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
