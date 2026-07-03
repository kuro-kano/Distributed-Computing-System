import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import { httpRequestsTotal } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find().sort({ createdAt: -1 });
    httpRequestsTotal.inc({ method: "GET", route: "/api/tasks", status_code: "200" });
    return NextResponse.json({ tasks });
  } catch (error) {
    httpRequestsTotal.inc({ method: "GET", route: "/api/tasks", status_code: "500" });
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      httpRequestsTotal.inc({ method: "POST", route: "/api/tasks", status_code: "400" });
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await Task.create({
      title: body.title.trim(),
      description: body.description ?? "",
      priority: body.priority ?? "medium",
      assignee: body.assignee ?? "",
      status: body.status ?? "todo",
    });

    httpRequestsTotal.inc({ method: "POST", route: "/api/tasks", status_code: "201" });
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    httpRequestsTotal.inc({ method: "POST", route: "/api/tasks", status_code: "500" });
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
