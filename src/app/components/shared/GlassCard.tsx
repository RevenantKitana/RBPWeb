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
      className={`bg-[rgba(10,12,22,0.78)] backdrop-blur-xl border border-white/[0.14] rounded-2xl shadow-[0_12px_38px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] ${
        hover
          ? "hover:bg-[rgba(14,16,28,0.86)] hover:border-white/[0.2] transition-all duration-300"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
