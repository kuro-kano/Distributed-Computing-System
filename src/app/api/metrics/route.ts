import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import { register, tasksTotal } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const counts = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const countsByStatus: Record<string, number> = {
      todo: 0,
      inprogress: 0,
      done: 0,
    };
    for (const entry of counts) {
      countsByStatus[entry._id] = entry.count;
    }

    for (const [status, count] of Object.entries(countsByStatus)) {
      tasksTotal.set({ status }, count);
    }
  } catch (error) {
    // If the DB is unreachable, still serve whatever metrics we have.
  }

  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    status: 200,
    headers: { "Content-Type": register.contentType },
  });
}
