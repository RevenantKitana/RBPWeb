export interface AudioManifestEntry {
  kind: "demo" | "bgm";
  fileName: string;
  src: string;
}

export const AUDIO_MANIFEST: AudioManifestEntry[] = [];
