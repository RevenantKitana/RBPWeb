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
        className="font-mono text-[11px] sm:text-xs tracking-[0.24em] text-primary/85 uppercase mb-3 leading-relaxed"
      >
        {sub}
      </p>
      <h2
        className="text-4xl md:text-5xl text-foreground leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      <div className={`mt-4 h-px w-16 bg-primary/40 ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
