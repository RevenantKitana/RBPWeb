export type MediaCategory = "background" | "audio-demo" | "audio-bgm";
export type MediaResourceType = "image" | "video" | "audio";

export interface MediaAsset {
  kind: MediaCategory;
  resourceType: MediaResourceType;
  src: string;
  name: string;
}

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL

const MEDIA_SOURCE_PATHS = [
// Backgrounds
  "/background/ThornSin%20Flower.jpg",
  "/background/Thornsin%20BG%202.jpg",
  "/background/Thornsin%20BG%203.jpg",
  "/background/Thornsin%20BG%204.jpg",
  "/background/Thornsin%20BG%205.jpg",
  "/background/ThornSin%20BG%206.jpg",
  "/background/ThornSin%20BG%207.jpg",
  "/background/sunset-deltarune.mp4",
  "/background/Breeze%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Flame%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Breeze%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Ice%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Breeze%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Lighting%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Rock%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/Shadow%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20Cleopatra%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20Hitomi%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20Tyrfing%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20Vivienne%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20TamamoNoMae%20-%20Dragon%20Traveler.mp4",
  "/background/%5B16%2B%5D%20Titania%20-%20Dragon%20Traveler.mp4",
// Demo Audio
  "/audio/demo/xin%20%C4%91%E1%BB%ABng%20r%E1%BB%9Di%20xa%20anh.mp3",
  "/audio/demo/ngay%20hai%20ta%20sat%20vai.mp3",
  "/audio/demo/demo%20tim%20em.mp3",
  "/audio/demo/yeu%20dung%20so%20dau.mp3",
// BGM Audio
  "/audio/bgm/[Wadanohara%20and%20the%20Great%20Blue%20Sea]%20127%20-%20Honeymoon.mp3",
  "/audio/bgm/Dragon%20Traveler%20-%20Game%20Soundtrack%202.mp3",
  "/audio/bgm/Nor%20SoundTrack%20-%20ParishChurch.mp3",
  "/audio/bgm/ThornSin%20SoundTrack%20-%20Serrect%20Passage%20(Orchestral%20Version).mp3",
] as const;

function formatDisplayName(value: string) {
  const withoutExtension = value.replace(/\.[^/.]+$/, "");
  return withoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveMediaUrl(assetPath: string) {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return new URL(normalizedPath, R2_BASE_URL).toString();
}

export function resolveMediaAsset(assetPath: string): MediaAsset {
  const resolvedSrc = resolveMediaUrl(assetPath);
  const pathname = (() => {
    try {
      return new URL(resolvedSrc, R2_BASE_URL).pathname;
    } catch {
      return resolvedSrc;
    }
  })();
  const decodedPath = decodeURIComponent(pathname);
  const fileName = decodedPath.split("/").filter(Boolean).pop() ?? decodedPath;
  const name = formatDisplayName(fileName);

  if (decodedPath.toLowerCase().includes("/audio/demo/")) {
    return {
      kind: "audio-demo",
      resourceType: "audio",
      src: resolvedSrc,
      name,
    };
  }

  if (decodedPath.toLowerCase().includes("/audio/bgm/")) {
    return {
      kind: "audio-bgm",
      resourceType: "audio",
      src: resolvedSrc,
      name,
    };
  }

  if (decodedPath.toLowerCase().includes("/bg/") || decodedPath.toLowerCase().includes("/background/")) {
    if (/\.(mp4|webm|ogg|mov)$/i.test(fileName)) {
      return {
        kind: "background",
        resourceType: "video",
        src: resolvedSrc,
        name,
      };
    }

    return {
      kind: "background",
      resourceType: "image",
      src: resolvedSrc,
      name,
    };
  }

  return {
    kind: "background",
    resourceType: "image",
    src: resolvedSrc,
    name,
  };
}

export const MEDIA_ASSETS: MediaAsset[] = MEDIA_SOURCE_PATHS.map((path) => resolveMediaAsset(path));

export function getMediaAssets(kind: MediaCategory | MediaCategory[]) {
  const targetKinds = Array.isArray(kind) ? kind : [kind];
  return MEDIA_ASSETS.filter((asset) => targetKinds.includes(asset.kind));
}
