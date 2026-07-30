import type { ArticleItem } from "@/app/types";

export const ARTICLES: ArticleItem[] = [
  {
    title: "Building a Low-Latency Audio Engine in Go",
    category: "Programming",
    date: "Jan 2025",
    excerpt: "How replacing a Python prototype with Go cut latency from 340ms to 18ms — and what goroutine-safe audio buffers taught me.",
    readTime: 8,
    imgId: "photo-1733412505442-36cfa59a4240",
  },
  {
    title: "The Mathematics of Reverberation",
    category: "Music",
    date: "Nov 2024",
    excerpt: "A deep dive into convolution reverb, impulse responses, and how digital spaces mimic physical acoustics.",
    readTime: 12,
    imgId: "photo-1507752533523-5186b0bc4c43",
  },
  {
    title: "Why I Produce Music to Become a Better Engineer",
    category: "Personal",
    date: "Sep 2024",
    excerpt: "Constraints breed creativity. How limited plugins and hard deadlines made me iterate faster in both disciplines.",
    readTime: 5,
    imgId: "photo-1748957995777-dc9843f88c1d",
  },
  {
    title: "Distributed Clocks & DAWs: What Music Taught Me",
    category: "Programming",
    date: "Mar 2025",
    excerpt: "Latency compensation in DAWs illuminated distributed clocks, event sourcing, and operational transforms more than any textbook.",
    readTime: 15,
    imgId: "photo-1683064325134-3acfdef9c6d7",
  },
];
