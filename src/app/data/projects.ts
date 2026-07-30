import type { Project } from "@/app/types";

export const PROJECTS: Project[] = [
  {
    title: "EchoSync",
    summary: "Real-time audio collaboration platform enabling distributed musicians to jam together with sub-100ms latency.",
    tech: ["WebRTC", "React", "Go", "Redis"],
    role: "Full-Stack Developer",
    github: "#",
    demo: "#",
    architecture: "Event-driven microservices with a WebSocket broadcast bus and edge-cached STUN/TURN relay servers.",
    imgId: "photo-1733412505442-36cfa59a4240",
  },
  {
    title: "Opus API",
    summary: "REST API for music metadata — platforms query tempo, key, mood, and instrumentation via ML classifiers.",
    tech: ["Python", "FastAPI", "PyTorch", "PostgreSQL"],
    role: "Backend + ML Engineer",
    github: "#",
    demo: null,
    architecture: "Audio fingerprinting → feature extraction → ensemble classifier → cached JSON responses.",
    imgId: "photo-1683064325134-3acfdef9c6d7",
  },
  {
    title: "HUST Scheduler",
    summary: "Timetable optimizer for university students that resolves class conflicts using constraint satisfaction algorithms.",
    tech: ["TypeScript", "Next.js", "Supabase", "CSP"],
    role: "Solo Developer",
    github: "#",
    demo: "#",
    architecture: "Backtracking CSP solver with arc-consistency pruning, served via Next.js App Router with Supabase realtime.",
    imgId: "photo-1758073519996-6d3c63b4922c",
  },
];
