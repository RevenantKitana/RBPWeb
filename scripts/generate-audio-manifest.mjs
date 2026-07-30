import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public", "audio");
const outputFile = path.join(rootDir, "src", "app", "data", "generated", "audio-manifest.ts");

const supportedExtensions = new Set([".mp3", ".m4a", ".wav"]);

async function listAudioFiles(kind) {
  const folder = path.join(publicDir, kind);
  try {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    return files.map((fileName) => ({
      kind,
      fileName,
      src: `/audio/${kind}/${fileName}`,
    }));
  } catch {
    return [];
  }
}

async function generate() {
  const demo = await listAudioFiles("demo");
  const bgm = await listAudioFiles("bgm");
  const content = `export interface AudioManifestEntry {
  kind: "demo" | "bgm";
  fileName: string;
  src: string;
}

export const AUDIO_MANIFEST: AudioManifestEntry[] = ${JSON.stringify([...demo, ...bgm], null, 2)};
`;

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, content, "utf8");
}

await generate();
