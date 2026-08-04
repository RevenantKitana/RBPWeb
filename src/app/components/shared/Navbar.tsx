import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImageIcon, Menu, Music4, X, Volume2 } from "lucide-react";
import type { Lang } from "@/app/types";
import { T } from "@/app/data/content";

export function Navbar({
  lang,
  setLang,
  musicOn,
  setMusicOn,
  activeSection,
  availableBackgrounds,
  selectedBackground,
  onBackgroundChange,
  availableBgmTracks,
  selectedBgm,
  onBgmChange,
  currentBgmTitle,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  musicOn: boolean;
  setMusicOn: (v: boolean) => void;
  activeSection: string;
  availableBackgrounds: Array<{ type: "image" | "video"; src: string; name: string }>;
  selectedBackground: string | null;
  onBackgroundChange: (value: string | null) => void;
  availableBgmTracks: Array<{ src: string; name: string }>;
  selectedBgm: string | null;
  onBgmChange: (value: string | null) => void;
  currentBgmTitle: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgMenuOpen, setBgMenuOpen] = useState(false);
  const [bgmMenuOpen, setBgmMenuOpen] = useState(false);
  const bgMenuRef = useRef<HTMLDivElement | null>(null);
  const bgmMenuRef = useRef<HTMLDivElement | null>(null);
  const t = T[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (bgMenuRef.current && !bgMenuRef.current.contains(target)) {
        setBgMenuOpen(false);
      }
      if (bgmMenuRef.current && !bgmMenuRef.current.contains(target)) {
        setBgmMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const top = window.scrollY + rect.top - (viewportHeight / 2) + (rect.height / 2);

      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, menuOpen ? 200 : 0);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="h-full mx-auto px-5 max-w-7xl flex items-center justify-between bg-[#08080f]/82 backdrop-blur-xl border-b border-white/[0.06]">
          <button
            onClick={() => scrollTo("hero")}
            className="text-foreground hover:text-primary transition-colors text-lg tracking-wide"
            style={{ fontFamily: '"Gilda Display", serif' }}
          >
            Q.K<span className="text-primary">.</span>
          </button>

          <nav className="hidden md:flex items-center gap-5">
            {t.navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm transition-colors ${
                  activeSection === link.id
                    ? "text-primary font-medium"
                    : "text-foreground/50 hover:text-foreground/85"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative" ref={bgMenuRef}>
              <button
                onClick={() => setBgMenuOpen((prev) => !prev)}
                className="h-9 min-w-[72px] px-3 flex items-center justify-center gap-2 border border-border hover:border-primary/40 rounded-lg transition-all"
                aria-label="Select background"
                title="Background"
              >
                <ImageIcon size={14} className="text-muted-foreground" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  BG
                </span>
              </button>

              <AnimatePresence>
                {bgMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 z-[60] min-w-[220px] max-h-[280px] overflow-y-auto rounded-xl border border-white/10 bg-[#08080f]/95 p-2 shadow-xl backdrop-blur"
                  >
                    {availableBackgrounds.map((asset) => (
                      <button
                        key={asset.src}
                        onClick={() => {
                          onBackgroundChange(asset.src);
                          setBgMenuOpen(false);
                        }}
                        className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedBackground === asset.src ? "bg-primary/15 text-primary" : "text-foreground/80 hover:bg-white/5"}`}
                      >
                        {asset.name}
                      </button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative" ref={bgmMenuRef}>
              <button
                onClick={() => setBgmMenuOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center border border-border hover:border-primary/40 rounded-lg transition-all"
                aria-label="Select background music"
                title={currentBgmTitle || "Background music"}
              >
                <Music4 size={15} className="text-muted-foreground" />
              </button>

              <AnimatePresence>
                {bgmMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 z-[60] min-w-[220px] max-h-[280px] overflow-y-auto rounded-xl border border-white/10 bg-[#08080f]/95 p-2 shadow-xl backdrop-blur"
                  >
                    {availableBgmTracks.map((track) => (
                      <button
                        key={track.src}
                        onClick={() => {
                          onBgmChange(track.src);
                          setBgmMenuOpen(false);
                        }}
                        className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedBgm === track.src ? "bg-primary/15 text-primary" : "text-foreground/80 hover:bg-white/5"}`}
                      >
                        {track.name}
                      </button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
              className="font-mono text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 px-2.5 py-1.5 rounded-lg transition-all"
            >
              {lang === "en" ? "VI" : "EN"}
            </button>

            <button
              onClick={() => setMusicOn(!musicOn)}
              className="w-9 h-9 flex items-center justify-center border border-border hover:border-primary/40 rounded-lg transition-all"
              aria-label="Toggle ambient music"
              title={currentBgmTitle ? `${musicOn ? "Đang phát" : "BGM"}: ${currentBgmTitle}` : "BGM"}
            >
              {musicOn ? (
                <div className="flex items-end gap-[2px] h-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-primary rounded-full"
                      animate={{ scaleY: [0.35, 1, 0.35] }}
                      transition={{ duration: 0.65 + i * 0.1, repeat: Infinity, delay: i * 0.14 }}
                      style={{ height: 14, transformOrigin: "bottom" }}
                    />
                  ))}
                </div>
              ) : (
                <Volume2 size={14} className="text-muted-foreground" />
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center border border-border rounded-lg"
            >
              {menuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-16 bg-[#08080f]/97 backdrop-blur-xl flex flex-col items-center justify-center gap-7"
          >
            {t.navLinks.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(link.id)}
                className="text-3xl text-foreground/75 hover:text-primary transition-colors"
                style={{ fontFamily: '"Gilda Display", serif' }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
