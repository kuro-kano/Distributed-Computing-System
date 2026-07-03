import os from "os";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { httpRequestsTotal } from "@/lib/metrics";

export const dynamic = "force-dynamic";

function getServerIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const addresses = interfaces[name];
    if (!addresses) continue;
    for (const addr of addresses) {
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return "unknown";
}

export async function GET() {
  let mongoStatus: "connected" | "disconnected" = "disconnected";

  try {
    await dbConnect();
    mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (error) {
    mongoStatus = "disconnected";
  }

  httpRequestsTotal.inc({ method: "GET", route: "/api/health", status_code: "200" });

  return NextResponse.json({
    status: "ok",
    hostname: os.hostname(),
    serverIp: getServerIp(),
    mongoStatus,
    timestamp: new Date().toISOString(),
  });
}
