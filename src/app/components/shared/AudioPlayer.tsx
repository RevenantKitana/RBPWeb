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

export function AudioPlayer({
  title,
  genre,
  duration,
  src,
  imgId,
}: {
  title: string;
  genre: string;
  duration: string;
  src: string;
  imgId: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolvedDuration, setResolvedDuration] = useState(duration);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (playing) {
      el.pause();
      setPlaying(false);
      setProgress(0);
      return;
    }

    window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: el } }));

    try {
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

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

    window.addEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("ended", onEnd);
    el.addEventListener("timeupdate", onTime);

    return () => {
      window.removeEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("timeupdate", onTime);
    };
  }, []);

  return (
    <GlassCard className="flex gap-4 p-4 items-center" hover>
      <audio ref={audioRef} src={src} preload="none" />
      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
        <img src={unsplash(imgId, 96, 96)} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground/90 text-sm leading-tight truncate">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{genre} · {resolvedDuration}</p>
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
