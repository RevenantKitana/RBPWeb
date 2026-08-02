import type { AudioDemo, BgmTrack, YoutubeCard, ResourceItem } from "@/app/types";
import { getMediaAssets } from "@/app/data/asset";

const fallbackImageIds = [
  "photo-1763771757355-d2a395b5f8ea",
  "photo-1748957995777-dc9843f88c1d",
  "photo-1601042879364-f3947d3f9c16",
];

function createTrackListFromAssets(kind: "demo" | "bgm") {
  const mediaKind = kind === "bgm" ? "audio-bgm" : "audio-demo";

  return getMediaAssets(mediaKind)
    .map((asset, index) => ({
      title: asset.name,
      genre: kind === "bgm" ? "BGM" : "Demo",
      duration: "Loading...",
      src: asset.src,
      imgId: fallbackImageIds[index % fallbackImageIds.length],
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const AUDIO_DEMOS: AudioDemo[] = createTrackListFromAssets("demo");
export const BGM_TRACKS: BgmTrack[] = createTrackListFromAssets("bgm");

export const YOUTUBE_CARDS: YoutubeCard[] = [
  {
    title: "EM NÊN DỪNG LẠI (Revek Remix · Melodic House)",
    description: "Người con gái chẳng cần kiêu sa, nụ cười đẹp nhất khi chiều tà...",
    link: "https://youtu.be/LchDM0V_jJU?si=WuT1V0iks2UOFTDH",
  },
  {
    title: "LO NGƯỜI ƯỚT ÁO (Revek Remix · Chill House)",
    description: "Anh nói thương em vậy mà !?? | Sigma Meow xin được đồng hành cùng anh em...",
    link: "https://youtu.be/b5mrEG2wM3k?si=8O6CP8ISAJ5svOcy",
  },
  {
    title: "E Là Không Thể (Revek Remix · Chill House)",
    description: "⚠️ CẢNH BÁO: Đây không phải bản gốc! Hãy ủng hộ nghệ sĩ chính chủ để tôn trọng chất xám và công sức của họ ❤️",
    link: "https://youtu.be/zWCRRNawiyU?si=NXrOyRHAlMYgvLPz",
  },
  {
    title: "Tây Tiến - Vidic X HTropix (Revek Bootleg Mix)",
    description: "Official Music Video: Tây Tiến - Vidic X HTropix | Khi Văn Học Thành Bài Hát Siêu Hay",
    link: "https://youtu.be/b-WXQHRbo9Y?si=5dklRZzgVoQDWCbd",
  },
];

export const RESOURCES: ResourceItem[] = [
  { title: "Completed SoundTracks Pack by Revek", type: "PACK", desc: "Free audio wav files", link: "https://drive.google.com/drive/folders/1H_yDAdX_YQbsu8UoG5y4Ti-qok9cBhPK?usp=drive_link" },
];
