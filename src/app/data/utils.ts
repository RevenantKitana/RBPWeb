export const unsplash = (id: string, w = 800, h = 500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const generateTags = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .filter((w) => w.length > 4)
    .slice(0, 3);

export const RESOURCE_COLORS: Record<string, string> = {
  FLP: "bg-orange-400/15 text-orange-300 border-orange-400/20",
  WAV: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  STEMS: "bg-violet-400/15 text-violet-300 border-violet-400/20",
  MIDI: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  PRESET: "bg-pink-400/15 text-pink-300 border-pink-400/20",
  PACK: "bg-amber-400/15 text-amber-300 border-amber-400/20",
};

export const CATEGORY_COLORS: Record<string, string> = {
  Programming: "bg-blue-400/20 text-blue-300",
  Music: "bg-violet-400/20 text-violet-300",
  Personal: "bg-amber-400/20 text-amber-400",
};
