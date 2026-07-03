// Shared task types used by both the client components and the Mongoose model.
// The `status` literals double as the drag-and-drop column IDs.

export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high";

// Client-side shape of a task as returned by the API (JSON: string `_id`,
// ISO-string timestamps). The server-side Mongoose document type is `ITask`
// in `@/lib/models/Task`.
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

// Payload produced by the create/edit form in `TaskModal`.
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
}
