import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, style }: GlassCardProps) => {
  return (
    <div className={cn("glass-card p-7 md:p-8", className)} style={style}>
      {children}
    </div>
  );
};
