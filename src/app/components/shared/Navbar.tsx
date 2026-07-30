import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Volume2 } from "lucide-react";
import type { Lang } from "@/app/types";
import { T, BGM_TRACKS } from "@/app/data/content";

export function Navbar({
  lang,
  setLang,
  musicOn,
  setMusicOn,
  activeSection,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  musicOn: boolean;
  setMusicOn: (v: boolean) => void;
  activeSection: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = T[lang];
  const bgmTrack = BGM_TRACKS[0];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            MK<span className="text-primary">.</span>
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
              title={bgmTrack ? `${musicOn ? "Đang phát" : "BGM"}: ${bgmTrack.title}` : "BGM"}
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
