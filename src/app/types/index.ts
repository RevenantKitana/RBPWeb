import type { LucideIcon } from "lucide-react";

export type Lang = "en" | "vi";
export type AIStage =
  | "idle"
  | "selecting"
  | "gathering"
  | "generating"
  | "publishing"
  | "completed";
export type AIStepKey =
  | "selecting"
  | "gathering"
  | "generating"
  | "publishing"
  | "completed";

export interface ForumPost {
  id?: number;
  userId?: number;
  title: string;
  body?: string;
  category?: string;
  tags?: string[];
  contentPreview?: string;
  link?: string;
}

export interface SkillGroup {
  category: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  items: string[];
}

export interface Project {
  title: string;
  summary: string;
  tech: string[];
  role: string;
  github: string;
  demo: string | null;
  architecture: string;
  imgId: string;
}

export interface FeaturedWork {
  title: string;
  year: string;
  genre: string;
  desc: string;
  imgId: string;
  streams: string;
}

export interface AudioDemo {
  title: string;
  genre: string;
  duration: string;
  src: string;
  imgId: string;
}

export interface BgmTrack {
  title: string;
  genre: string;
  duration: string;
  src: string;
  imgId: string;
}

export interface YoutubeCard {
  title: string;
  description: string;
  link: string;
}

export interface YoutubeEmbedState {
  videoId: string;
  title: string;
  description: string;
  thumbUrl: string;
}

export interface ResourceItem {
  title: string;
  type: string;
  desc: string;
  link: string;
}

export interface ArticleItem {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime: number;
  imgId: string;
}
