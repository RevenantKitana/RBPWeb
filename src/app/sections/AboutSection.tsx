import { BookOpen, CalendarDays, GraduationCap, MapPin, Ruler, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { T } from "@/app/data/content";

export function AboutSection({ lang }: { lang: Lang }) {
  const t = T[lang].about;
  const quoteEntries = useMemo(
    () =>
      (t.quotes?.length ? t.quotes : [{ label: t.quoteLabel, quote: t.quote, quoteAuthor: t.quoteAuthor }]).map(
        (item) => ({
          label: item.label,
          quote: item.quote,
          quoteAuthor: item.quoteAuthor,
        })
      ),
    [t]
  );
  const bioEntries = useMemo(
    () =>
      (t.bios?.length ? t.bios : [{ label: t.bioLabel, bio: t.bio }]).map((item) => ({
        label: item.label,
        bio: item.bio,
      })),
    [t]
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bioIndex, setBioIndex] = useState(0);

  const getNextIndex = (length: number, current: number) => {
    if (length <= 1) return current;
    const next = Math.floor(Math.random() * length);
    return next === current ? (current + 1) % length : next;
  };

  const handleQuoteSwitch = useCallback(() => {
    if (quoteEntries.length <= 1) return;
    setQuoteIndex((prev) => getNextIndex(quoteEntries.length, prev));
  }, [quoteEntries.length]);

  const handleBioSwitch = useCallback(() => {
    if (bioEntries.length <= 1) return;
    setBioIndex((prev) => getNextIndex(bioEntries.length, prev));
  }, [bioEntries.length]);

  const activeQuote = quoteEntries[quoteIndex] ?? quoteEntries[0];
  const activeBio = bioEntries[bioIndex] ?? bioEntries[0];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="left" />
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <FadeIn delay={0.08}>
              <GlassCard className="p-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {(
                    [
                      { label: t.educationLabel, value: t.education, icon: GraduationCap },
                      { label: t.majorLabel, value: t.major, icon: BookOpen },
                      { label: t.birthdayLabel, value: t.birthday, icon: CalendarDays },
                      { label: t.heightLabel, value: t.height, icon: Ruler },
                      { label: t.iqLabel, value: t.iq, icon: Star },
                      { label: t.locationLabel, value: t.location, icon: MapPin },
                    ] as const
                  ).map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={11} className="text-primary" />
                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                          {label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/85">{value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>

            <FadeIn delay={0.14}>
              <GlassCard className="p-5">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
                  {t.interestsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.interests.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>

            <FadeIn delay={0.2}>
              <GlassCard className="p-5">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
                  {t.focusLabel}
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{t.focus}</p>
              </GlassCard>
            </FadeIn>
          </div>

          <div className="space-y-4">
            <FadeIn delay={0.24}>
              <GlassCard className="p-8 relative overflow-hidden cursor-pointer" onClick={handleQuoteSwitch}>
                <div className="absolute top-5 left-5 text-primary/15 leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)', fontSize: 80 }}>
                  "
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuote.quote}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="relative pt-4"
                  >
                    <blockquote className="text-foreground/80 text-base leading-relaxed italic font-light">
                      {activeQuote.quote}
                    </blockquote>
                    <p className="mt-4 font-mono text-xs text-muted-foreground">— {activeQuote.quoteAuthor}</p>
                  </motion.div>
                </AnimatePresence>
                {quoteEntries.length > 1 ? (
                  <p className="mt-4 text-[11px] text-muted-foreground/80">More</p>
                ) : null}
              </GlassCard>
            </FadeIn>

            <FadeIn delay={0.3}>
              <GlassCard className="p-6 cursor-pointer" onClick={handleBioSwitch}>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
                  {activeBio.label}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBio.bio}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <p className="text-sm text-foreground/70 leading-relaxed">{activeBio.bio}</p>
                  </motion.div>
                </AnimatePresence>
                {bioEntries.length > 1 ? (
                  <p className="mt-4 text-[11px] text-muted-foreground/80">More</p>
                ) : null}
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
