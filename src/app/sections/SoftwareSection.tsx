import { ArrowRight, Camera, Github, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { ForumPostCard } from "@/app/components/shared/ForumPostCard";
import { AIAgentCard } from "@/app/components/shared/AIAgentCard";
import { EmotionLiveCard } from "@/app/components/shared/EmotionLiveCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { T, SKILLS, PROJECTS, unsplash } from "@/app/data/content";

export function SoftwareSection({ lang }: { lang: Lang }) {
  const t = T[lang].software;
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [skillIndex, setSkillIndex] = useState(0);
  const [isSkillPaused, setIsSkillPaused] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  useEffect(() => {
    if (isSkillPaused) return;

    const timer = window.setInterval(() => {
      setSkillIndex((current) => (current + 1) % SKILLS.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [isSkillPaused]);

  const visibleSkills = Array.from({ length: 4 }, (_, offset) => SKILLS[(skillIndex + offset) % SKILLS.length]);

  const toggleProject = (index: number) => {
    setExpandedProject((current) => (current === index ? null : index));
  };

  return (
    <section id="software" className="py-24 px-6 bg-[#08080f]/55">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="left" />
        </FadeIn>

        <div className="mb-20">
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.skillsTitle}
            </p>
          </FadeIn>
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            onClick={() => setIsSkillPaused(true)}
            onMouseLeave={() => setIsSkillPaused(false)}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {visibleSkills.map((group, i) => (
                <motion.div
                  key={`${group.category}-${skillIndex}-${i}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <GlassCard className="p-5 h-full">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`inline-flex p-2 rounded-lg ${group.bg}`}>
                        <group.icon size={15} className={group.color} />
                      </div>
                      <p className="font-medium text-sm text-foreground">{group.category}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-muted-foreground border border-white/[0.07]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.projectsTitle}
            </p>
          </FadeIn>
          <div className="space-y-6">
            {expandedProject !== null && (() => {
              const project = PROJECTS[expandedProject];
              const title = lang === "vi" ? project.titleVi || project.title : project.titleEn || project.title;
              const summary = lang === "vi" ? project.summaryVi || project.summary : project.summaryEn || project.summary;
              const role = lang === "vi" ? project.roleVi || project.role : project.roleEn || project.role;
              const details = lang === "vi" ? project.detailsVi || project.details || [] : project.detailsEn || project.details || [];
              const highlights = lang === "vi" ? project.highlightsVi || project.highlights || [] : project.highlightsEn || project.highlights || [];
              const architecture =
                lang === "vi" ? project.architectureVi || project.architecture : project.architectureEn || project.architecture;

              return (
                <FadeIn key={`${project.title}-expanded`} delay={0.04}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="w-full"
                  >
                    <GlassCard className="overflow-hidden transition-all duration-300 ring-1 ring-primary/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_50px_rgba(0,0,0,0.28)] flex flex-col w-full" hover>
                      <div className="relative h-64 lg:h-[320px] w-full bg-muted overflow-hidden">
                        <img
                          src={unsplash(project.imgId, 900, 520)}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080f]/90 via-[#08080f]/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                          {project.tech.map((techTag) => (
                            <span
                              key={techTag}
                              className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/65 text-white/70 border border-white/10"
                            >
                              {techTag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 md:p-7 w-full flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4
                            className="text-xl md:text-2xl text-foreground"
                            style={{ fontFamily: '"Gilda Display", serif' }}
                          >
                            {title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => toggleProject(expandedProject)}
                            className="font-mono text-[10px] uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-1 text-primary"
                          >
                            <ArrowRight size={10} className="rotate-90" />
                            {lang === "vi" ? "Thu gọn" : "Collapse"}
                          </button>
                        </div>

                        <p className="text-sm text-foreground/75 mt-4 leading-relaxed whitespace-pre-line">
                          {summary}
                        </p>

                        <div className="mt-4 text-sm">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">{t.roleLabel}: </span>
                          <span className="text-foreground/80">{role}</span>
                        </div>

                        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                            {lang === "vi" ? "README mini" : "Mini README"}
                          </p>
                          <div className="space-y-3 text-sm text-foreground/75 leading-7">
                            <div>
                              <p className="font-medium text-foreground/90 mb-2">{lang === "vi" ? "Mục tiêu" : "Goal"}</p>
                              <p className="whitespace-pre-line">{summary}</p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground/90 mb-2">{lang === "vi" ? "Điểm chính" : "Key points"}</p>
                              <ul className="space-y-1.5">
                                {details.map((item) => (
                                  <li key={item} className="pl-3 border-l border-primary/30 leading-6">{item}</li>
                                ))}
                              </ul>
                            </div>
                            {highlights.length > 0 && (
                              <div>
                                <p className="font-medium text-foreground/90 mb-2">{lang === "vi" ? "Điểm nổi bật" : "Highlights"}</p>
                                <ul className="space-y-1.5">
                                  {highlights.map((item) => (
                                    <li key={item} className="pl-3 border-l border-emerald-400/30 text-foreground/70 leading-6">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                            {t.architectureLabel}
                          </p>
                          <div className="space-y-3 text-sm text-foreground/70 leading-7">
                            <p className="whitespace-pre-line">{architecture}</p>
                            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                              <p className="font-medium text-foreground/90 mb-2">{lang === "vi" ? "Cấu trúc nhìn thấy" : "Visible structure"}</p>
                              <p className="text-foreground/70">
                                {lang === "vi"
                                  ? "Một hệ thống gồm frontend, backend service, data layer và lớp xử lý độ tin cậy, tạo nên một kiến trúc dễ hiểu và có thể mở rộng theo quy mô thực tế."
                                  : "The system consists of a frontend layer, backend services, a data layer, and a reliability layer, forming an architecture that is easy to understand and scalable for real-world usage."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-auto pt-5">
                          <a
                            href={project.github}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-white/20 px-3 py-1.5 rounded-lg"
                          >
                            <Github size={11} /> GitHub
                          </a>
                          {project.demo && (
                            <a
                              href={project.demo}
                              className="flex items-center gap-1.5 text-xs text-primary border border-primary/25 hover:border-primary/45 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Globe size={11} /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </FadeIn>
              );
            })()}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              {PROJECTS.map((project, i) => {
                if (i === expandedProject) return null;
                const title = lang === "vi" ? project.titleVi || project.title : project.titleEn || project.title;
                const summary = lang === "vi" ? project.summaryVi || project.summary : project.summaryEn || project.summary;
                const role = lang === "vi" ? project.roleVi || project.role : project.roleEn || project.role;
                const architecture =
                  lang === "vi" ? project.architectureVi || project.architecture : project.architectureEn || project.architecture;
                const detailLabel = lang === "vi" ? "Xem chi tiết" : "View details";

                return (
                  <FadeIn key={project.title} delay={i * 0.09}>
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                      <GlassCard className="overflow-hidden flex flex-col h-full transition-all duration-300" hover>
                        <div className="relative h-44 bg-muted overflow-hidden">
                          <img
                            src={unsplash(project.imgId, 600, 350)}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-65 hover:opacity-85 transition-opacity duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f]/85 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                            {project.tech.map((techTag) => (
                              <span
                                key={techTag}
                                className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/65 text-white/65 border border-white/10"
                              >
                                {techTag}
                              </span>
                            ))}
                          </div>
                        </div>
                                <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-lg text-foreground mb-1" style={{ fontFamily: '"Gilda Display", serif' }}>
                            {title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">
                            {summary.length > 140 ? `${summary.slice(0, 140)}...` : summary}
                          </p>
                          <div className="mb-3 text-xs">
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">{t.roleLabel}: </span>
                            <span className="text-foreground/70">{role}</span>
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() => toggleProject(i)}
                              className="font-mono text-[10px] uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-1 text-primary"
                            >
                              <ArrowRight size={10} className="rotate-0" />
                              {detailLabel}
                            </button>
                          </div>
                          <div className="flex gap-2 mt-auto pt-4">
                            <a
                              href={project.github}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-white/20 px-3 py-1.5 rounded-lg"
                            >
                              <Github size={11} /> GitHub
                            </a>
                            {project.demo && (
                              <a
                                href={project.demo}
                                className="flex items-center gap-1.5 text-xs text-primary border border-primary/25 hover:border-primary/45 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Globe size={11} /> Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.liveTitle}
            </p>
          </FadeIn>
          <div className="flex flex-col gap-6">
            <FadeIn delay={0.08}>
              <ForumPostCard lang={lang} />
            </FadeIn>
            <FadeIn delay={0.16}>
              <AIAgentCard lang={lang} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div id="emotion-demo">
                <Dialog open={isEmotionModalOpen} onOpenChange={(open) => {
                  setIsEmotionModalOpen(open);
                }}>
                <DialogTrigger asChild>
                  <GlassCard className="cursor-pointer p-6 flex flex-col h-full min-h-0 hover:border-white/20 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2 mb-3">
                      <Camera size={15} className="text-primary" />
                      <p className="font-medium text-foreground/90 text-sm">{t.emotionFeatureTitle}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.emotionFeatureSub}</p>
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.08] p-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-primary">{t.emotionFeatureStatus}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-primary/80">{t.emotionModalOpenLabel}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Webcam", "Image input", "7 emotion states"].map((item) => (
                        <span key={item} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-muted-foreground border border-white/[0.08]">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 text-xs text-foreground/60">
                      {t.emotionFeatureFooter}
                    </div>
                  </GlassCard>
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-0 sm:p-0">
                  <DialogHeader className="border-b border-white/10 px-6 py-4">
                    <DialogTitle>{t.emotionFeatureTitle}</DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-muted-foreground">
                      {t.emotionFeatureSub}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-6">
                    <EmotionLiveCard lang={lang} open={isEmotionModalOpen} />
                  </div>
                </DialogContent>
              </Dialog>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
