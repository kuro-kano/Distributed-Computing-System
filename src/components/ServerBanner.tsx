"use client";

import { useEffect, useState } from "react";

interface HealthData {
  hostname: string;
  serverIp: string;
  mongoStatus: "connected" | "disconnected";
  timestamp: string;
}

function hashToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export default function ServerBanner() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchHealth() {
      const start = performance.now();
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const elapsed = Math.round(performance.now() - start);
        if (!res.ok) throw new Error("Health check failed");
        const data: HealthData = await res.json();
        if (!cancelled) {
          setHealth(data);
          setLatency(elapsed);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const hue = health ? hashToHue(health.hostname) : 210;
  const accent = `hsl(${hue}, 70%, 50%)`;

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 text-sm transition-colors"
      style={{
        borderColor: accent,
        backgroundColor: `hsla(${hue}, 70%, 15%, 0.6)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
        {health ? (
          <span>
            Served by: <strong>{health.hostname}</strong> ({health.serverIp})
          </span>
        ) : error ? (
          <span className="text-red-400">Unable to reach server</span>
        ) : (
          <span className="text-gray-400">Connecting...</span>
        )}
      </div>
      {latency !== null && (
        <span className="text-gray-400">Latency: {latency}ms</span>
      )}
    </div>
  );
}
