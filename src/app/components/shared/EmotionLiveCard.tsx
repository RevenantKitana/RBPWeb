import { AlertTriangle, Camera, CircleSlashed, Cpu, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { useCameraStream } from "@/app/hooks/useCameraStream";
import { useEmotionWebSocket } from "@/app/hooks/useEmotionWebSocket";
import type { Lang } from "@/app/types";
import { T } from "@/app/data/content";

function getStatusLabel(status: string, t: ReturnType<typeof T[Lang]>) {
  if (status === "connecting") return t.software.emotionStateConnecting;
  if (status === "connected") return t.software.emotionStateConnected;
  if (status === "disconnected") return t.software.emotionStateReconnecting;
  if (status === "error") return t.software.emotionStateError;
  return t.software.emotionStateIdle;
}

export function EmotionLiveCard({ lang }: { lang: Lang }) {
  const t = T[lang].software;
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const { videoRef, ready, permissionError } = useCameraStream(cameraEnabled);
  const { status, faces, count, inferenceMs, lastError } = useEmotionWebSocket(videoRef, cameraEnabled && ready);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [renderWidth, setRenderWidth] = useState(0);
  const [renderHeight, setRenderHeight] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setRenderWidth(rect.width);
      setRenderHeight(rect.height);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const overlays = useMemo(() => {
    if (!renderWidth || !renderHeight) {
      return [];
    }

    return faces.map((face, index) => {
      const [x, y, width, height] = face.box;
      return {
        id: `${face.emotion}-${index}`,
        emotion: face.emotion,
        confidence: face.confidence,
        left: (x / 320) * renderWidth,
        top: (y / 240) * renderHeight,
        width: (width / 320) * renderWidth,
        height: (height / 240) * renderHeight,
      };
    });
  }, [faces, renderWidth, renderHeight]);

  const label = getStatusLabel(status, T[lang]);

  return (
    <GlassCard className="p-6 flex flex-col h-full min-h-[460px] gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{t.emotionFeatureTitle}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{t.emotionFeatureSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCameraEnabled((current) => !current)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:border-white/20 hover:bg-white/10"
          >
            {cameraEnabled ? t.emotionActionStop : t.emotionActionStart}
          </button>
          <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">
            {label}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-black/90 border border-white/10" ref={wrapperRef}>
        <div className="relative aspect-[4/3] w-full bg-slate-950">
          <video
            ref={videoRef}
            className="h-full w-full object-fill"
            muted
            playsInline
            autoPlay
          />
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              className="pointer-events-none absolute rounded-lg border border-primary/70 bg-primary/10 shadow-[0_0_0_4px_rgba(196,181,253,0.03)]"
              style={{
                left: overlay.left,
                top: overlay.top,
                width: overlay.width,
                height: overlay.height,
              }}
            >
              <div className="absolute left-0 top-0 flex h-7 min-h-[1.75rem] w-full items-center justify-between gap-2 rounded-t-lg bg-black/80 px-2 text-[10px] uppercase tracking-[0.22em] text-primary">
                <span>{overlay.emotion}</span>
                <span>{`${Math.round(overlay.confidence * 100)}%`}</span>
              </div>
            </div>
          ))}
          {permissionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center text-sm text-red-200">
              <AlertTriangle className="mr-2 inline-block" size={18} />
              {permissionError}
            </div>
          )}
          {!cameraEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center text-sm text-white/80">
              <div className="space-y-2">
                <p>{t.emotionCameraInactive}</p>
                <p className="text-xs text-muted-foreground">{t.emotionCameraInstructions}</p>
              </div>
            </div>
          )}
          {cameraEnabled && !ready && !permissionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center text-sm text-white/80">
              <div className="space-y-2">
                <p>{t.emotionCameraInitializing}</p>
                <p className="text-xs text-muted-foreground">{t.emotionCameraInstructions}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{t.emotionStatsFaces}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{count}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{t.emotionStatsLatency}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {inferenceMs !== null ? `${inferenceMs.toFixed(0)} ms` : t.emotionStatsWaiting}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{t.emotionStatsService}</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
            {status === "connected" ? (
              <Cpu size={14} className="text-primary" />
            ) : status === "error" ? (
              <AlertTriangle size={14} className="text-red-400" />
            ) : (
              <RefreshCw size={14} className="text-muted-foreground" />
            )}
            {status}
          </p>
          {lastError ? (
            <p className="mt-2 text-xs text-red-300">{lastError}</p>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
