import type { AudioDemo, BgmTrack, YoutubeCard, ResourceItem } from "@/app/types";

const demoAudioEntries = import.meta.glob("/public/audio/demo/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const bgmAudioEntries = import.meta.glob("/public/audio/bgm/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const fallbackImageIds = [
  "photo-1763771757355-d2a395b5f8ea",
  "photo-1748957995777-dc9843f88c1d",
  "photo-1601042879364-f3947d3f9c16",
];

function formatTrackTitle(fileName: string) {
  return fileName
    .replace(/\.(mp3|m4a|wav)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function createTrackList(entries: Record<string, string>, kind: "demo" | "bgm") {
  return Object.entries(entries)
    .map(([path, src], index) => ({
      title: formatTrackTitle(path.split("/").pop() ?? "Untitled"),
      genre: kind === "bgm" ? "BGM" : "Demo",
      duration: "Loading...",
      src,
      imgId: fallbackImageIds[index % fallbackImageIds.length],
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const AUDIO_DEMOS: AudioDemo[] = createTrackList(demoAudioEntries, "demo") as AudioDemo[];
export const BGM_TRACKS: BgmTrack[] = createTrackList(bgmAudioEntries, "bgm") as BgmTrack[];

export const YOUTUBE_CARDS: YoutubeCard[] = [
  {
    title: "EM NÊN DỪNG LẠI (Revek Remix · Melodic House)",
    description: "Người con gái chẳng cần kiêu sa, nụ cười đẹp nhất khi chiều tà...",
    link: "https://youtu.be/LchDM0V_jJU?si=WuT1V0iks2UOFTDH",
  },
  {
    title: "Midnight Circuit — Full Album Playthrough",
    description: "A full playthrough of the Midnight Circuit project with atmosphere, arrangement, and textures.",
    link: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  },
  {
    title: "My FL Studio Setup Tour & Workflow 2024",
    description: "A short setup tour showing the tools, plugins, and workflow used in the current production process.",
    link: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
];

export const RESOURCES: ResourceItem[] = [
  { title: "Midnight Circuit — FLP", type: "FLP", desc: "Full FL Studio project with all plugins listed.", link: "#" },
  { title: "Wabi-Sabi Drum Kit", type: "WAV", desc: "24 acoustic one-shots processed with tape saturation.", link: "#" },
  { title: "EchoVault STEMS", type: "STEMS", desc: "Isolated drums, bass, synths, and FX from the EP.", link: "#" },
  { title: "Lo-fi Chord Progressions", type: "MIDI", desc: "20 jazz-influenced lo-fi chord progressions in all keys.", link: "#" },
  { title: "KHOAWAVE Presets Vol. 1", type: "PRESET", desc: "40 Serum + Vital pads, leads, and textures.", link: "#" },
  { title: "City Tape Sample Pack", type: "PACK", desc: "Urban field recordings from Hanoi mixed with percussion.", link: "#" },
];
