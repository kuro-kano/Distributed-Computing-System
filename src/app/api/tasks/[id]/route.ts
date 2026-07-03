import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import { httpRequestsTotal } from "@/lib/metrics";

const ALLOWED_FIELDS = ["title", "description", "status", "priority", "assignee"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.isValidObjectId(params.id)) {
      httpRequestsTotal.inc({ method: "PATCH", route: "/api/tasks/[id]", status_code: "400" });
      return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
    }

    await dbConnect();
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    const task = await Task.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      httpRequestsTotal.inc({ method: "PATCH", route: "/api/tasks/[id]", status_code: "404" });
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    httpRequestsTotal.inc({ method: "PATCH", route: "/api/tasks/[id]", status_code: "200" });
    return NextResponse.json({ task });
  } catch (error) {
    httpRequestsTotal.inc({ method: "PATCH", route: "/api/tasks/[id]", status_code: "500" });
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.isValidObjectId(params.id)) {
      httpRequestsTotal.inc({ method: "DELETE", route: "/api/tasks/[id]", status_code: "400" });
      return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
    }

    await dbConnect();
    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      httpRequestsTotal.inc({ method: "DELETE", route: "/api/tasks/[id]", status_code: "404" });
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    httpRequestsTotal.inc({ method: "DELETE", route: "/api/tasks/[id]", status_code: "200" });
    return NextResponse.json({ success: true });
  } catch (error) {
    httpRequestsTotal.inc({ method: "DELETE", route: "/api/tasks/[id]", status_code: "500" });
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
