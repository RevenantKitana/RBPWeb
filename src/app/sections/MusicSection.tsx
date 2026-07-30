import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang, YoutubeEmbedState } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { AudioPlayer, AUDIO_PLAY_REQUEST } from "@/app/components/shared/AudioPlayer";
import { T, AUDIO_DEMOS, YOUTUBE_CARDS, RESOURCES, RESOURCE_COLORS } from "@/app/data/content";

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") ?? "";
    }
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "");
    }
  } catch {
    // ignore invalid url
  }
  return "";
}

function getYouTubeThumbnail(videoId: string, quality: "hqdefault" | "mqdefault" | "default" = "hqdefault") {
  return videoId ? `https://img.youtube.com/vi/${videoId}/${quality}.jpg` : "";
}

export function MusicSection({ lang }: { lang: Lang }) {
  const t = T[lang].music;
  const [selectedVideo, setSelectedVideo] = useState<YoutubeEmbedState | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoCards = useMemo(
    () =>
      YOUTUBE_CARDS.map((video) => {
        const videoId = getYouTubeVideoId(video.link);
        return {
          ...video,
          videoId,
          thumbUrl: getYouTubeThumbnail(videoId),
        };
      }),
    []
  );

  const activeVideo = selectedVideo ?? (videoCards[0] ? {
    videoId: videoCards[0].videoId,
    title: videoCards[0].title,
    description: videoCards[0].description,
    thumbUrl: videoCards[0].thumbUrl,
  } : null);

  const iframeOrigin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    const handlePlayRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string }>).detail;
      if (detail?.source !== "audio") return;

      const frameWindow = iframeRef.current?.contentWindow;
      if (frameWindow) {
        frameWindow.postMessage({ event: "command", func: "stopVideo", args: [] }, "*");
      }
    };

    const handleYouTubeStateMessage = (event: MessageEvent) => {
      if (!iframeRef.current?.contentWindow || event.source !== iframeRef.current.contentWindow) return;
      let data: any = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (data?.event === "onStateChange" && data?.data === 1) {
        window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "youtube" } }));
      }
    };

    window.addEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
    window.addEventListener("message", handleYouTubeStateMessage);
    return () => {
      window.removeEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
      window.removeEventListener("message", handleYouTubeStateMessage);
    };
  }, []);

  return (
    <section id="music" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="left" />
        </FadeIn>

        <div className="mb-16">
          <FadeIn>
            <GlassCard className="p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
                    {t.aliasLabel}
                  </p>
                  <p
                    className="text-2xl text-primary"
                    style={{ fontFamily: '"Gilda Display", serif' }}
                  >
                    REVEK
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
                    {t.genresLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Deep House",
                      "Electro Dance Music",
                      "Melodic House",
                    ].map((g) => (
                      <span
                        key={g}
                        className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-foreground/65"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
                    {t.dawLabel}
                  </p>
                  <p className="text-sm text-foreground/80">FL Studio 21</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
                    {t.rolesLabel}
                  </p>
                  {[
                    "Arranger/Beatmaker",
                    "Sound Designer",
                    "Mixing/Mastering Engineer",
                  ].map((r) => (
                    <p key={r} className="text-sm text-foreground/80">
                      {r}
                    </p>
                  ))}
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>

        <div className="mb-16">
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.audioTitle}
            </p>
          </FadeIn>
          {AUDIO_DEMOS.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-muted-foreground">
              No audio demos available.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AUDIO_DEMOS.map((demo, i) => (
                <FadeIn key={demo.title} delay={i * 0.08}>
                  <AudioPlayer {...demo} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>

        <div className="mb-16">
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.ytTitle}
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <GlassCard className="overflow-hidden p-0">
              <div className="aspect-video bg-black">
                {activeVideo?.videoId ? (
                  <iframe
                    ref={iframeRef}
                    key={activeVideo.videoId}
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(iframeOrigin)}`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                    Không có video YouTube để phát.
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-foreground/90">{activeVideo?.title ?? "Video"}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {activeVideo?.description ?? "Đang phát video YouTube được chọn."}
                </p>
              </div>
            </GlassCard>

            <div className="space-y-4">
              {videoCards.map((video, i) => (
                <FadeIn key={video.title} delay={i * 0.06}>
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "youtube" } }));
                      setSelectedVideo({
                        videoId: video.videoId,
                        title: video.title,
                        description: video.description,
                        thumbUrl: video.thumbUrl,
                      });
                    }}
                    className="w-full text-left"
                  >
                    <GlassCard className="overflow-hidden hover:translate-y-[-2px] transition-transform" hover>
                      <div className="flex gap-3 p-3">
                        <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          {video.thumbUrl ? (
                            <img
                              src={video.thumbUrl}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                              {activeVideo?.videoId === video.videoId ? (
                                <Pause size={12} className="text-white" />
                              ) : (
                                <Play size={12} className="text-white ml-[1px]" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/90 leading-snug line-clamp-2">
                            {video.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FadeIn>
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-1">
                {t.resourceTitle}
              </p>
              <p className="text-xs text-muted-foreground/70">{t.resourceSub}</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCES.map((resource, i) => (
              <FadeIn key={resource.title} delay={i * 0.06}>
                <GlassCard className="p-4 flex items-start gap-4" hover>
                  <span
                    className={`flex-shrink-0 font-mono text-[10px] font-medium px-2 py-1 rounded-lg border ${
                      RESOURCE_COLORS[resource.type] ?? "bg-white/10 text-white/60 border-white/10"
                    }`}
                  >
                    {resource.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground/90 leading-snug">{resource.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{resource.desc}</p>
                    <a href={resource.link} className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                      {t.downloadLabel}
                    </a>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
