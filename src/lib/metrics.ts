import client from "prom-client";

interface MetricsCache {
  register: client.Registry;
  httpRequestsTotal: client.Counter<string>;
  tasksTotal: client.Gauge<string>;
}

declare global {
  // eslint-disable-next-line no-var
  var _metricsCache: MetricsCache | undefined;
}

function createMetrics(): MetricsCache {
  const register = new client.Registry();
  register.setDefaultLabels({ app: "taskboard" });
  client.collectDefaultMetrics({ register });

  const httpRequestsTotal = new client.Counter({
    name: "taskboard_http_requests_total",
    help: "Total number of HTTP requests handled by the taskboard API",
    labelNames: ["method", "route", "status_code"] as const,
    registers: [register],
  });

  const tasksTotal = new client.Gauge({
    name: "taskboard_tasks_total",
    help: "Total number of tasks by status",
    labelNames: ["status"] as const,
    registers: [register],
  });

  return { register, httpRequestsTotal, tasksTotal };
}

const cached: MetricsCache = global._metricsCache ?? createMetrics();

if (!global._metricsCache) {
  global._metricsCache = cached;
}

export const register = cached.register;
export const httpRequestsTotal = cached.httpRequestsTotal;
export const tasksTotal = cached.tasksTotal;
