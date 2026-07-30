import type { SkillGroup } from "@/app/types";
import { Code2, Database, Layers, Wrench } from "lucide-react";

export const SKILLS: SkillGroup[] = [
  {
    category: "Languages",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    items: ["TypeScript", "Python", "Java", "Go", "Rust", "C++"],
  },
  {
    category: "Frameworks",
    icon: Layers,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    items: ["React", "Next.js", "FastAPI", "Spring Boot", "Gin", "Tailwind CSS"],
  },
  {
    category: "Databases",
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    items: ["PostgreSQL", "Redis", "MongoDB", "Supabase", "InfluxDB"],
  },
  {
    category: "Tools",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    items: ["Docker", "GitHub Actions", "Kubernetes", "Figma", "Neovim", "Postman"],
  },
];
