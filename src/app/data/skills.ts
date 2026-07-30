import type { SkillGroup } from "@/app/types";
import { Brain, Code2, Database, Layers, Wrench } from "lucide-react";

export const SKILLS: SkillGroup[] = [
  {
    category: "Languages",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frameworks",
    icon: Layers,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    items: ["React", "Express", "Vite", "Tailwind CSS", "Radix UI", "Tkinter"],
  },
  {
    category: "Databases",
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    items: ["PostgreSQL", "Prisma", "SQL"],
  },
  {
    category: "AI / CV",
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    items: ["TensorFlow", "Keras", "MobileNetV2", "OpenCV", "Scikit-learn", "Matplotlib"],
  },
  {
    category: "Tools",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    items: ["Docker", "Vercel", "Git", "Postman", "Figma", "Jupyter"],
  },
];
