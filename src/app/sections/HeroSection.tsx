import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { unsplash, T } from "@/app/data/content";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";

export function HeroSection({ lang }: { lang: Lang }) {
  const t = T[lang].hero;
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
    >
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-[#08080f]">
            <img
              src={unsplash("photo-1562070299-9932d68ca9c6", 200, 200)}
              alt="Nguyen Quoc Khanh - Revek"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary/95 uppercase mb-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
            {t.greeting}
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <h1
            className="text-5xl md:text-7xl text-foreground/95 mb-4 leading-none tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: '"Cormorant Garamond", "Palatino Linotype", "Times New Roman", serif' }}
          >
            {t.name}
          </h1>
        </FadeIn>

        <FadeIn delay={0.26}>
          <p className="text-muted-foreground/95 text-base md:text-lg mb-5 font-light">
            {t.role}
          </p>
        </FadeIn>

        <FadeIn delay={0.34}>
          <p className="text-foreground/90 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 [text-shadow:0_1px_2px_rgba(0,0,0,0.28)]">
            {t.intro}
          </p>
        </FadeIn>

        <FadeIn delay={0.42}>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => scrollTo("software")}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
            >
              {t.btnProjects}
            </button>
            <a
              href="https://drive.google.com/drive/folders/1ib3nmsbPNqaFF4pI3NY7iWDVRXbjGnYw?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-white/[0.08] border border-white/[0.16] text-foreground/95 rounded-xl text-sm font-medium hover:bg-white/[0.12] transition-colors shadow-[0_8px_24px_rgba(0,0,0,0.18)] inline-flex items-center justify-center"
            >
              {t.btnCV}
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 py-2.5 border border-border text-foreground/90 rounded-xl text-sm font-medium hover:border-primary/40 hover:text-foreground/95 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
            >
              {t.btnContact}
            </button>
          </div>
        </FadeIn>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={16} className="text-muted-foreground/50" />
      </motion.div>
    </section>
  );
}
