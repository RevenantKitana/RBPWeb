import { useRef, useState, useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { unsplash } from "@/app/data/content";

export const AUDIO_PLAY_REQUEST = "audio:play-request";

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseId3v2Tags(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 10 || String.fromCharCode(...bytes.slice(0, 3)) !== "ID3") return null;

  const majorVersion = bytes[3];
  const minorVersion = bytes[4];
  const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);

  const view = new DataView(buffer);
  let offset = 10;
  const end = offset + size;
  const decoder = new TextDecoder();

  const decodeText = (data: Uint8Array) => {
    if (data.length === 0) return "";
    const encoding = data[0];
    const payload = data.slice(1);
    if (encoding === 1 || encoding === 2) {
      const textDecoder = encoding === 1 ? new TextDecoder("utf-16le") : new TextDecoder("utf-16be");
      return textDecoder.decode(payload).replace(/\0/g, "").trim();
    }
    return decoder.decode(payload).replace(/\0/g, "").trim();
  };

  const tags: { title?: string; artist?: string; album?: string } = {};

  while (offset + 10 <= end) {
    const frameId = Array.from(bytes.slice(offset, offset + 4), (value) => String.fromCharCode(value)).join("");
    if (!frameId || frameId === "\u0000\u0000\u0000\u0000") break;

    const frameSize = majorVersion >= 4
      ? ((view.getUint8(offset + 4) & 0x7f) << 21) |
        ((view.getUint8(offset + 5) & 0x7f) << 14) |
        ((view.getUint8(offset + 6) & 0x7f) << 7) |
        (view.getUint8(offset + 7) & 0x7f)
      : view.getUint32(offset + 4, false);

    const frameFlags = view.getUint16(offset + 8, false);
    const payload = bytes.slice(offset + 10, offset + 10 + frameSize);

    if (frameId.startsWith("T") && payload.length > 0) {
      const text = decodeText(payload);
      if (frameId === "TIT2") tags.title = text;
      if (frameId === "TPE1") tags.artist = text;
      if (frameId === "TALB") tags.album = text;
    }

    offset += 10 + frameSize + (frameFlags ? 0 : 0);
    if (majorVersion >= 4 && (frameFlags & 0x0000) === 0) {
      // keep moving forward; the frame size already accounts for payload length
    }
  }

  return Object.keys(tags).length > 0 ? tags : null;
}

export function AudioPlayer({
  title,
  genre,
  duration,
  src,
  imgId,
  artist,
  album,
}: {
  title: string;
  genre: string;
  duration: string;
  src: string;
  imgId: string;
  artist?: string;
  album?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingPlayRef = useRef(false);
  const [audioReady, setAudioReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolvedDuration, setResolvedDuration] = useState(duration);
  const [resolvedTitle, setResolvedTitle] = useState(title);
  const [resolvedArtist, setResolvedArtist] = useState(artist);
  const [resolvedAlbum, setResolvedAlbum] = useState(album);

  const stopPlayback = () => {
    const el = audioRef.current;
    if (el && !el.paused) {
      el.pause();
    }
    setPlaying(false);
    setProgress(0);
  };

  const toggle = async () => {
    const el = audioRef.current;

    if (playing) {
      stopPlayback();
      return;
    }

    if (!audioReady) {
      pendingPlayRef.current = true;
      setAudioReady(true);
      window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: null } }));
      return;
    }

    if (!el) return;

    window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: el } }));

    try {
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  useEffect(() => {
    const handlePlayRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ element?: HTMLAudioElement | null; source?: string }>).detail;
      const current = audioRef.current;
      if (!current || detail?.element === current) return;
      if (detail?.source !== "audio" && detail?.source !== "youtube") return;

      if (!current.paused) {
        current.pause();
        setPlaying(false);
        setProgress(0);
      }
    };

    window.addEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);

    return () => {
      window.removeEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!audioReady) return;

    const el = audioRef.current;
    if (!el) return;

    let cancelled = false;

    const onLoadedMetadata = () => {
      setResolvedDuration(formatDuration(el.duration));
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onTime = () => {
      if (el.duration > 0) setProgress((el.currentTime / el.duration) * 100);
    };

    const hydrateMetadata = async () => {
      try {
        const response = await fetch(src, { cache: "force-cache" });
        if (!response.ok) return;
        const buffer = await response.arrayBuffer();
        const tags = parseId3v2Tags(buffer);
        if (cancelled) return;
        if (tags?.title) setResolvedTitle(tags.title);
        if (tags?.artist) setResolvedArtist(tags.artist);
        if (tags?.album) setResolvedAlbum(tags.album);
      } catch {
        // ignore metadata parse failures
      }
    };

    void hydrateMetadata();
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("ended", onEnd);
    el.addEventListener("timeupdate", onTime);

    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: el } }));

      void el.play()
        .then(() => {
          if (!cancelled) {
            setPlaying(true);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPlaying(false);
          }
        });
    }

    return () => {
      cancelled = true;
      pendingPlayRef.current = false;
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [audioReady, src]);

  return (
    <GlassCard className="flex gap-4 p-4 items-center" hover>
      {audioReady ? <audio ref={audioRef} src={src} preload="none" /> : null}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
        <img src={unsplash(imgId, 96, 96)} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground/90 text-sm leading-tight truncate">{resolvedTitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {[resolvedArtist, resolvedAlbum].filter(Boolean).join(" • ") || genre} · {resolvedDuration}
        </p>
        <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause size={13} className="text-primary" />
        ) : (
          <Play size={13} className="text-primary ml-0.5" />
        )}
      </button>
    </GlassCard>
  );
}
