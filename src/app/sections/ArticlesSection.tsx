import { Clock } from "lucide-react";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { T, ARTICLES, CATEGORY_COLORS, unsplash } from "@/app/data/content";

export function ArticlesSection({ lang }: { lang: Lang }) {
  const t = T[lang].articles;

  return (
    <section id="articles" className="py-24 px-6 bg-[#08080f]/55">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="left" />
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ARTICLES.map((article, i) => (
            <FadeIn key={article.title} delay={i * 0.07}>
              <GlassCard className="overflow-hidden flex flex-col" hover>
                <div className="h-36 bg-muted relative overflow-hidden">
                  <img
                    src={unsplash(article.imgId, 500, 290)}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-55"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080f]/80 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      CATEGORY_COLORS[article.category] ?? "bg-white/10 text-white/60"
                    }`}
                  >
                    {article.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="text-sm font-medium text-foreground/90 leading-snug mb-2 flex-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <Clock size={9} />
                      <span>
                        {article.readTime} {t.minRead}
                      </span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <button className="mt-3 text-xs text-primary hover:underline text-left">
                    {t.readMore}
                  </button>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
