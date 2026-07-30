import type { ReactNode } from "react";

export function SectionHeader({
  title,
  sub,
  align = "left",
}: {
  title: string;
  sub: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""}`}>
      <p
        className="font-mono text-[11px] sm:text-xs tracking-[0.24em] text-primary/95 uppercase mb-3 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]"
      >
        {sub}
      </p>
      <h2
        className="text-4xl md:text-5xl text-foreground/95 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.48)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      <div className={`mt-4 h-px w-16 bg-primary/70 shadow-[0_0_12px_rgba(212,168,83,0.35)] ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
