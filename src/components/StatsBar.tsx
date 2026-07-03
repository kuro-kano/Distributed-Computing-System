"use client";

import { useEffect, useState } from "react";

interface StatsBarProps {
  total: number;
  counts: { todo: number; inprogress: number; done: number };
}

export default function StatsBar({ total, counts }: StatsBarProps) {
  const [mongoConnected, setMongoConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setMongoConnected(data.mongoStatus === "connected");
      } catch {
        if (!cancelled) setMongoConnected(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-800 px-4 py-3 shadow">
      <div className="flex flex-wrap gap-4 text-sm">
        <Stat label="Total" value={total} />
        <Stat label="To Do" value={counts.todo} />
        <Stat label="In Progress" value={counts.inprogress} />
        <Stat label="Done" value={counts.done} />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              mongoConnected === null
                ? "bg-gray-500"
                : mongoConnected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span>
            MongoDB{" "}
            {mongoConnected === null
              ? "checking..."
              : mongoConnected
              ? "connected"
              : "disconnected"}
          </span>
        </div>
        <span>v{process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0"}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-semibold text-gray-100">{value}</span>
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
