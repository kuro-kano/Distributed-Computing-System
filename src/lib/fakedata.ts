import { Task } from "@/types/task";
  
  export const fakeTasks: Task[] = [
    // ---------- TO DO ----------
    {
      id: "1",
      title: "Set up load balancer",
      description: "Configure DNS + NAT for the 3 web servers",
      status: "todo",
      priority: "high",
      assignee: "Kaan",
      createdAt: "2026-07-01",
    },
    {
      id: "2",
      title: "Configure Prometheus",
      description: "Scrape metrics from all web servers and MongoDB",
      status: "todo",
      priority: "medium",
      assignee: "Kaan",
      createdAt: "2026-07-01",
    },
    {
      id: "3",
      title: "Design Grafana dashboard",
      description: "Visualize request rate, latency, and CPU per server",
      status: "todo",
      priority: "low",
      assignee: "Team",
      createdAt: "2026-07-02",
    },

    // ---------- IN PROGRESS ----------
    {
      id: "4",
      title: "Write Dockerfile",
      description: "Multi-stage build for the Next.js app (standalone output)",
      status: "inprogress",
      priority: "high",
      assignee: "Kaan",
      createdAt: "2026-07-02",
    },
    {
      id: "5", 
      title: "Build Task Board UI",
      description: "Kanban board with 3 columns and task cards",
      status: "inprogress",
      priority: "medium",
      assignee: "Kaan",
      createdAt: "2026-07-03",
    },

    // ---------- DONE ----------
    {
      id: "6",
      title: "MongoDB Setup",
      description: "Set up MongoDB replica set on the database server",
      status: "done",
      priority: "high",
      assignee: "Kaan",
      createdAt: "2026-06-30",
    },
    {
      id: "7",
      title: "Create Next.js project",
      description: "Scaffold project with TypeScript and Tailwind CSS",
      status: "done",
      priority: "medium",
      assignee: "Kaan",
      createdAt: "2026-06-29",
    },
    {
      id: "8",
      title: "Draw architecture diagram",
      description: "3-tier design: load balancer, web servers, database",
      status: "done",
      priority: "low",
      assignee: "Team",
      createdAt: "2026-06-28",
    },
  ];