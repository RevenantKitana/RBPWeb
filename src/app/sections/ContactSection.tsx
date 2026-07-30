import { Check, Copy, Globe, Github, Linkedin, Mail, Music, Youtube, Facebook } from "lucide-react";
import { useState } from "react";
import type { Lang } from "@/app/types";
import { FadeIn } from "@/app/components/shared/FadeIn";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { T } from "@/app/data/content";

export function ContactSection({ lang }: { lang: Lang }) {
  const t = T[lang].contact;
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(t.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#08080f]/55">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <SectionHeader title={t.title} sub={t.sub} align="center" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
              {t.emailLabel}
            </p>
            <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3">
              <Mail size={15} className="text-primary" />
              <span className="font-mono text-foreground/85 text-sm">{t.email}</span>
              <button
                onClick={copyEmail}
                className="p-1.5 rounded-lg hover:bg-white/[0.07] transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Copy email"
              >
                {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="flex justify-center gap-3 mb-10">
            {(
              [
                { icon: Github, label: "GitHub", href: "https://github.com/RevenantKitana" },
                { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@revekitana" },
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/JinguKitana" },
              ] as const
            ).map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-11 h-11 rounded-xl border border-border bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.22}>
          <div>
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
              {t.availableLabel}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {t.available.map((item) => (
                <span
                  key={item}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-primary/25 text-primary bg-primary/[0.07]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="mt-16 font-mono text-[10px] text-muted-foreground/40 tracking-wider">
            © 2025 Khanh V. Quoc Nguyen. All rights reserved. | Designed & Built by Revek
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
