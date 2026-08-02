import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/app/types";
import { Navbar } from "@/app/components/shared/Navbar";
import { AUDIO_PLAY_REQUEST } from "@/app/components/shared/AudioPlayer";
import { HeroSection } from "@/app/sections/HeroSection";
import { AboutSection } from "@/app/sections/AboutSection";
import { SoftwareSection } from "@/app/sections/SoftwareSection";
import { MusicSection } from "@/app/sections/MusicSection";
import { ArticlesSection } from "@/app/sections/ArticlesSection";
import { BiographySection } from "@/app/sections/BiographySection";
import { ContactSection } from "@/app/sections/ContactSection";
import { getMediaAssets } from "@/app/data/asset";

type BackgroundAsset = {
  type: "image" | "video";
  src: string;
  name: string;
};

type BgmTrackOption = {
  src: string;
  name: string;
};

const availableBackgrounds: BackgroundAsset[] = getMediaAssets("background")
  .filter((asset) => asset.resourceType === "image" || asset.resourceType === "video")
  .map((asset) => ({
    type: asset.resourceType === "video" ? "video" : "image",
    src: asset.src,
    name: asset.name,
  }));

const discoveredBgmTracks: BgmTrackOption[] = getMediaAssets("audio-bgm").map((asset) => ({
  src: asset.src,
  name: asset.name,
}));

const availableBgmTracks: BgmTrackOption[] = discoveredBgmTracks.length > 0
  ? discoveredBgmTracks
  : [];

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [musicOn, setMusicOn] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedBackground, setSelectedBackground] = useState<string | null>(availableBackgrounds[0]?.src ?? null);
  const [selectedBgm, setSelectedBgm] = useState<string | null>(() => {
    const randomTrack = availableBgmTracks[Math.floor(Math.random() * availableBgmTracks.length)];
    return randomTrack?.src ?? null;
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeBgmTimeout = useRef<number | null>(null);
  const intentionalPauseRef = useRef(false);
  const youtubePlaybackActiveRef = useRef(false);
  const backgroundAsset = selectedBackground
    ? availableBackgrounds.find((asset) => asset.src === selectedBackground) ?? availableBackgrounds[0] ?? null
    : availableBackgrounds[0] ?? null;
  const currentBgmTrack = useMemo(() => {
    const selectedTrack = availableBgmTracks.find((track) => track.src === selectedBgm);
    if (selectedTrack) {
      return { src: selectedTrack.src, title: selectedTrack.name };
    }

    if (availableBgmTracks[0]) {
      return { src: availableBgmTracks[0].src, title: availableBgmTracks[0].name };
    }

    return null;
  }, [availableBgmTracks, selectedBgm]);

  const ensureBgmSource = () => {
    const el = audioRef.current;
    if (!el || !currentBgmTrack) return;

    const nextSrc = currentBgmTrack.src;
    const loadedSrc = el.getAttribute("data-src");
    if (loadedSrc === nextSrc) return;

    el.src = nextSrc;
    el.load();
    el.setAttribute("data-src", nextSrc);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang === "en" || savedLang === "vi") {
      setLang(savedLang);
    }
    setMusicOn(true);
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const handleSetMusic = (on: boolean) => {
    setMusicOn(on);
    localStorage.setItem("musicOn", String(on));

    if (!on) {
      intentionalPauseRef.current = true;
      audioRef.current?.pause();
      return;
    }

    intentionalPauseRef.current = false;
    if (youtubePlaybackActiveRef.current) {
      intentionalPauseRef.current = true;
      audioRef.current?.pause();
      return;
    }

    if (document.visibilityState !== "hidden") {
      window.setTimeout(() => {
        void playBgm();
      }, 0);
    }
  };

  const handleBgmChange = (value: string | null) => {
    setSelectedBgm(value);

    if (!musicOn) {
      handleSetMusic(true);
      return;
    }

    if (youtubePlaybackActiveRef.current) {
      return;
    }

    const el = audioRef.current;
    const nextTrack = availableBgmTracks.find((track) => track.src === value);
    if (!el || !nextTrack) return;

    el.src = nextTrack.src;
    el.load();
    el.setAttribute("data-src", nextTrack.src);
    void el.play().catch(() => undefined);
  };

  const scheduleBgmResume = () => {
    if (resumeBgmTimeout.current) {
      window.clearTimeout(resumeBgmTimeout.current);
    }

    resumeBgmTimeout.current = window.setTimeout(() => {
      if (!musicOn || intentionalPauseRef.current || document.visibilityState === "hidden") return;
      void playBgm();
    }, 250);
  };

  const playBgm = async (attempt = 0) => {
    const el = audioRef.current;
    if (!el || !currentBgmTrack || !musicOn || document.visibilityState === "hidden") return;
    if (intentionalPauseRef.current || youtubePlaybackActiveRef.current) return;
    if (!el.paused && el.getAttribute("data-src") === currentBgmTrack.src) return;

    ensureBgmSource();

    try {
      el.volume = 1;
      el.muted = false;
      await el.play();
    } catch {
      if (attempt < 2) {
        window.setTimeout(() => {
          void playBgm(attempt + 1);
        }, 180);
        return;
      }
      scheduleBgmResume();
    }
  };

  useEffect(() => {
    const handlePlayRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string; element?: HTMLAudioElement | null }>).detail;
      const el = audioRef.current;
      if (!el) return;
      if (detail?.element === el) return;
      if (detail?.source === "audio" || detail?.source === "youtube") {
        intentionalPauseRef.current = true;
        youtubePlaybackActiveRef.current = detail?.source === "youtube";
        if (!el.paused) el.pause();

        if (resumeBgmTimeout.current) {
          window.clearTimeout(resumeBgmTimeout.current);
        }
      }
    };

    const handleYouTubePlayState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean }>).detail;
      if (typeof detail?.playing !== "boolean") return;

      youtubePlaybackActiveRef.current = detail.playing;
      if (detail.playing) {
        intentionalPauseRef.current = true;
        audioRef.current?.pause();
        if (resumeBgmTimeout.current) {
          window.clearTimeout(resumeBgmTimeout.current);
        }
      } else if (musicOn) {
        intentionalPauseRef.current = false;
        window.setTimeout(() => {
          void playBgm();
        }, 0);
      }
    };

    window.addEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
    window.addEventListener("youtube:play-state", handleYouTubePlayState as EventListener);
    return () => {
      window.removeEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
      window.removeEventListener("youtube:play-state", handleYouTubePlayState as EventListener);
    };
  }, [musicOn]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentBgmTrack) return;

    const handlePause = () => {
      if (!musicOn || intentionalPauseRef.current || document.visibilityState === "hidden") return;
      scheduleBgmResume();
    };

    el.loop = true;
    el.addEventListener("pause", handlePause);

    if (musicOn) {
      intentionalPauseRef.current = false;
      window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: el } }));
    } else {
      intentionalPauseRef.current = true;
      el.pause();
    }

    return () => {
      el.removeEventListener("pause", handlePause);
    };
  }, [currentBgmTrack?.src, musicOn]);

  useEffect(() => {
    if (!musicOn || !currentBgmTrack) return;

    const el = audioRef.current;
    if (!el) return;

    const unlockPlayback = () => {
      if (document.visibilityState === "hidden") return;
      intentionalPauseRef.current = false;
      void playBgm();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        intentionalPauseRef.current = false;
        void playBgm();
      }
    };

    const onFocus = () => {
      intentionalPauseRef.current = false;
      void playBgm();
    };

    window.addEventListener("pointerdown", unlockPlayback);
    window.addEventListener("keydown", unlockPlayback);
    window.addEventListener("touchstart", unlockPlayback);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);

    return () => {
      if (resumeBgmTimeout.current) {
        window.clearTimeout(resumeBgmTimeout.current);
      }
      window.removeEventListener("pointerdown", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
      window.removeEventListener("touchstart", unlockPlayback);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
    };
  }, [currentBgmTrack, musicOn]);

  useEffect(() => {
    const ids = ["hero", "about", "software", "music", "articles", "biography", "contact"];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground isolate">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {backgroundAsset?.type === "video" ? (
          <video
            src={backgroundAsset.src}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : backgroundAsset ? (
          <img
            src={backgroundAsset.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {backgroundAsset ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,8,15,0.78)_0%,rgba(8,8,15,0.6)_45%,rgba(8,8,15,0.85)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,168,83,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(95,134,160,0.16),transparent_35%)]" />
          </>
        ) : null}
      </div>

      <div className="relative z-10">
        <Navbar
          lang={lang}
          setLang={handleSetLang}
          musicOn={musicOn}
          setMusicOn={handleSetMusic}
          activeSection={activeSection}
          availableBackgrounds={availableBackgrounds}
          selectedBackground={selectedBackground}
          onBackgroundChange={setSelectedBackground}
          availableBgmTracks={availableBgmTracks}
          selectedBgm={selectedBgm}
          onBgmChange={handleBgmChange}
          currentBgmTitle={currentBgmTrack?.title ?? "BGM"}
        />

        <audio ref={audioRef} preload="none" className="hidden" />

        <main className="pt-16">
          <HeroSection lang={lang} />
          <AboutSection lang={lang} />
          <SoftwareSection lang={lang} />
          <MusicSection lang={lang} />
          <ArticlesSection lang={lang} />
          <BiographySection lang={lang} />
          <ContactSection lang={lang} />
        </main>
      </div>
    </div>
  );
}
