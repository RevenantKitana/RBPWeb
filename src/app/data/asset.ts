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
  "/background/AA%20ThornSin(1).jpg",
  "/background/Breeze%20Slime%20-%20Dragon%20Traveler.mp4",
  "/background/sunset-deltarune.mp4",
  "/background/%5B16%2B%5D%20Titania%20-%20Dragon%20Traveler.mp4",
// Demo Audio
  "/audio/demo/revek%20ft%20Thế%20Phương%20-%20Đi%20để%20trở%20về.mp3",
  "/audio/demo/Tai%20sinh%20(Tung%20duong)%20x%20Love%20again%20(alok).mp3",
  "/audio/demo/Thuy%20chung.mp3",
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
