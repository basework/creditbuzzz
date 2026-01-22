import { cn } from "@/lib/utils";

interface ZenfiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

export const ZenfiLogo = ({ className, size = "md", animated = false }: ZenfiLogoProps) => {
  return (
    <div className={cn("relative font-display font-bold tracking-tight flex justify-center", sizeClasses[size], className)}>
      {/* Glow behind text */}
      {animated && (
        <div 
          className="absolute inset-0 blur-2xl opacity-60"
          style={{
            background: "linear-gradient(135deg, #7B3FE4, #D84EFF, #F5B44C)",
            animation: "logoGlowPulse 3s ease-in-out infinite",
          }}
        />
      )}
      
      <span 
        className="relative"
        style={{
          background: "linear-gradient(135deg, #7B3FE4, #D84EFF, #F5B44C)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: animated ? "drop-shadow(0 0 20px rgba(123, 63, 228, 0.5))" : undefined,
        }}
      >
        ZENFI
      </span>

      <style>{`
        @keyframes logoGlowPulse {
          0%, 100% { 
            opacity: 0.4;
            filter: blur(20px);
          }
          50% { 
            opacity: 0.7;
            filter: blur(30px);
          }
        }
      `}</style>
    </div>
  );
};
