import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { T, unsplash } from "@/app/data/content";

export function BiographySection({ lang }: { lang: Lang }) {
  const t = T[lang].biography;

  return (
    <section id="biography" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="left" />
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <FadeIn delay={0.08}>
            <div className="relative rounded-3xl overflow-hidden bg-muted" style={{ aspectRatio: "3/4" }}>
              <img
                src={unsplash("photo-1562070299-9932d68ca9c6", 700, 920)}
                alt="Nguyen Minh Khoa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080f]/60 to-transparent" />
            </div>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="space-y-8 pt-2">
              {(
                [
                  {
                    year: t.era1Year,
                    title: t.era1Title,
                    text: t.era1Text,
                  },
                  {
                    year: t.era2Year,
                    title: t.era2Title,
                    text: t.era2Text,
                  },
                  {
                    year: t.era3Year,
                    title: t.era3Title,
                    text: t.era3Text,
                  },
                ] as const
              ).map((era) => (
                <div key={era.year} className="relative pl-6 border-l border-primary/25">
                  <p className="font-mono text-[10px] tracking-widest text-primary uppercase mb-1.5">
                    {era.year}
                  </p>
                  <h4
                    className="text-xl text-foreground mb-2"
                    style={{ fontFamily: '"Gilda Display", serif' }}
                  >
                    {era.title}
                  </h4>
                  <p className="text-sm text-foreground/65 leading-relaxed">{era.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
