import { useEffect, useRef, useState } from "react";
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
import { BGM_TRACKS } from "@/app/data/content";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [musicOn, setMusicOn] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgmTrack = BGM_TRACKS[0];
  const resumeBgmTimeout = useRef<number | null>(null);

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
  };

  useEffect(() => {
    const handlePlayRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string; element?: HTMLAudioElement | null }>).detail;
      const el = audioRef.current;
      if (!el) return;
      if (detail?.element === el) return;
      if (detail?.source === "audio" || detail?.source === "youtube") {
        if (!el.paused) el.pause();

        if (resumeBgmTimeout.current) {
          window.clearTimeout(resumeBgmTimeout.current);
        }
      }
    };

    window.addEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
    return () => window.removeEventListener(AUDIO_PLAY_REQUEST, handlePlayRequest as EventListener);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !bgmTrack) return;

    el.src = bgmTrack.src;
    el.loop = true;
    el.load();

    if (musicOn) {
      window.dispatchEvent(new CustomEvent(AUDIO_PLAY_REQUEST, { detail: { source: "audio", element: el } }));

      const startPlayback = async () => {
        try {
          el.muted = true;
          await el.play();
          el.muted = false;
        } catch {
          try {
            el.muted = true;
            await el.play();
          } catch {
            // autoplay may still be blocked by the browser; the user gesture fallback below will handle it
          }
        }
      };

      void startPlayback();
    } else {
      el.pause();
    }
  }, [bgmTrack, musicOn]);

  useEffect(() => {
    if (!musicOn || !bgmTrack) return;

    const el = audioRef.current;
    if (!el) return;

    const unlockPlayback = () => {
      if (el.paused) {
        el.muted = false;
        void el.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", unlockPlayback);
    window.addEventListener("keydown", unlockPlayback);

    if (resumeBgmTimeout.current) {
      window.clearTimeout(resumeBgmTimeout.current);
    }

    resumeBgmTimeout.current = window.setTimeout(() => {
      if (!el.paused) return;
      el.muted = false;
      void el.play().catch(() => {});
    }, 3000);

    return () => {
      if (resumeBgmTimeout.current) {
        window.clearTimeout(resumeBgmTimeout.current);
      }
      window.removeEventListener("pointerdown", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
    };
  }, [bgmTrack, musicOn]);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1588312744377-2adfb7b8578a?w=1920&h=1080&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080f]/88 via-[#08080f]/72 to-[#08080f]" />
      </div>

      <Navbar
        lang={lang}
        setLang={handleSetLang}
        musicOn={musicOn}
        setMusicOn={handleSetMusic}
        activeSection={activeSection}
      />

      <audio ref={audioRef} preload="auto" className="hidden" />

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
  );
}
