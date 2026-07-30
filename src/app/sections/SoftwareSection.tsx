import { ArrowRight, Camera, Github, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { ForumPostCard } from "@/app/components/shared/ForumPostCard";
import { AIAgentCard } from "@/app/components/shared/AIAgentCard";
import { T, SKILLS, PROJECTS, unsplash } from "@/app/data/content";

export function SoftwareSection({ lang }: { lang: Lang }) {
  const t = T[lang].software;
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SKILLS.map((group, i) => (
              <FadeIn key={group.category} delay={i * 0.07}>
                <GlassCard className="p-5 h-full">
                  <div className={`inline-flex p-2 rounded-lg ${group.bg} mb-3`}>
                    <group.icon size={15} className={group.color} />
                  </div>
                  <p className="font-medium text-sm text-foreground mb-3">{group.category}</p>
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
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <FadeIn>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-6">
              {t.projectsTitle}
            </p>
          </FadeIn>
          <div className="grid lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => {
              const isExpanded = expandedProject === i;
              return (
                <FadeIn key={project.title} delay={i * 0.09}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className={isExpanded ? "lg:col-span-2" : "lg:col-span-1"}
                  >
                    <GlassCard className="overflow-hidden flex flex-col h-full" hover>
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
                        <h4
                          className="text-lg text-foreground mb-1"
                          style={{ fontFamily: '"Gilda Display", serif' }}
                        >
                          {project.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">
                          {project.summary}
                        </p>
                        <div className="mb-3 text-xs">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">{t.roleLabel}: </span>
                          <span className="text-foreground/70">{project.role}</span>
                        </div>
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={() => toggleProject(i)}
                            className="font-mono text-[10px] text-primary uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-1"
                          >
                            <ArrowRight size={10} className={`transition-transform ${isExpanded ? "rotate-90" : "rotate-0"}`} />
                            {t.architectureLabel}
                          </button>
                          <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
                              {project.architecture}
                            </p>
                          </motion.div>
                        </div>
                        <div className="flex gap-2 mt-auto">
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
              <GlassCard className="p-6 flex flex-col h-full min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <Camera size={15} className="text-primary" />
                  <p className="font-medium text-foreground/90 text-sm">{t.emotionFeatureTitle}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.emotionFeatureSub}</p>
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.08] p-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-primary">{t.emotionFeatureStatus}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary/80">Live</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Webcam",
                    "Image input",
                    "7 emotion states",
                  ].map((item) => (
                    <span key={item} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-muted-foreground border border-white/[0.08]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4 text-xs text-foreground/60">
                  {t.emotionFeatureFooter}
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
