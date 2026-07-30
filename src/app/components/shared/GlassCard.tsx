import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  hover = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl ${
        hover
          ? "hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
