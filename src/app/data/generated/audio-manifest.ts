export interface AudioManifestEntry {
  kind: "demo" | "bgm";
  fileName: string;
  src: string;
}

export const AUDIO_MANIFEST: AudioManifestEntry[] = [
  {
    "kind": "demo",
    "fileName": "revek ft Thế Phương - Đi để trở về.mp3",
    "src": "/audio/demo/revek ft Thế Phương - Đi để trở về.mp3"
  },
  {
    "kind": "demo",
    "fileName": "Tai sinh (Tung duong) x Love again (alok).mp3",
    "src": "/audio/demo/Tai sinh (Tung duong) x Love again (alok).mp3"
  },
  {
    "kind": "demo",
    "fileName": "Thuy chung.mp3",
    "src": "/audio/demo/Thuy chung.mp3"
  },
  {
    "kind": "bgm",
    "fileName": "[Wadanohara and the Great Blue Sea] 127 - Honeymoon.mp3",
    "src": "/audio/bgm/[Wadanohara and the Great Blue Sea] 127 - Honeymoon.mp3"
  }
];
