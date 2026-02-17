import { cn } from "@/lib/utils";

interface ZenfiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeConfig = {
  sm: { container: "gap-1.5", icon: "w-7 h-7", text: "text-lg" },
  md: { container: "gap-2", icon: "w-10 h-10", text: "text-2xl" },
  lg: { container: "gap-3", icon: "w-14 h-14", text: "text-4xl" },
  xl: { container: "gap-4", icon: "w-20 h-20", text: "text-6xl" },
};

export const ZenfiLogo = ({ className, size = "md", animated = false }: ZenfiLogoProps) => {
  const config = sizeConfig[size];
  
  return (
    <div className={cn("relative flex items-center justify-center", config.container, className)}>
      {/* Background glow */}
      {animated && (
        <div 
          className="absolute inset-0 blur-3xl opacity-40 scale-150 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(46, 242, 226, 0.4), rgba(123, 63, 228, 0.3), transparent 70%)",
            animation: "logoGlowPulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* CB Icon - crystalline hexagonal badge */}
      <div className={cn("relative flex-shrink-0", config.icon)}>
        {/* Icon glow layer */}
        <div 
          className="absolute inset-0 rounded-xl blur-lg opacity-60"
          style={{
            background: "linear-gradient(135deg, #2EF2E2, #7B3FE4, #D84EFF)",
            animation: animated ? "iconGlow 2.5s ease-in-out infinite alternate" : undefined,
          }}
        />
        
        {/* SVG Icon */}
        <svg viewBox="0 0 100 100" className="relative w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="cbMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2EF2E2" />
              <stop offset="40%" stopColor="#7B3FE4" />
              <stop offset="100%" stopColor="#D84EFF" />
            </linearGradient>
            <linearGradient id="cbShine" x1="0%" y1="0%" x2="60%" y2="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="cbShimmer" x1="-100%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              {animated && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="-1 0; 2 0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
            <filter id="cbGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Rounded square background */}
          <rect x="8" y="8" width="84" height="84" rx="20" ry="20" fill="url(#cbMainGrad)" filter="url(#cbGlow)" />
          
          {/* Shine facet top-left */}
          <rect x="8" y="8" width="84" height="84" rx="20" ry="20" fill="url(#cbShine)" opacity="0.25" />
          
          {/* Letter C */}
          <path
            d="M32 35 C32 28, 40 23, 50 23 C57 23, 62 26, 65 30 L59 35 C57 32, 54 30, 50 30 C43 30, 39 34, 39 42 L39 58 C39 66, 43 70, 50 70 C54 70, 57 68, 59 65 L65 70 C62 74, 57 77, 50 77 C40 77, 32 72, 32 65 Z"
            fill="white"
            opacity="0.95"
          />
          
          {/* Letter B */}
          <path
            d="M68 24 L68 76 L55 76 C47 76, 42 72, 42 65 C42 60, 45 57, 50 56 C46 54, 43 51, 43 46 C43 39, 48 35, 56 35 L68 35 Z M60 35 L56 35 C52 35, 50 37, 50 40 C50 43, 52 45, 56 45 L60 45 Z M60 52 L56 52 C51 52, 49 54, 49 58 C49 62, 51 64, 56 64 L60 64 Z"
            fill="white"
            opacity="0"
          />

          {/* Simpler overlapping CB letters */}
          <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="42" fontWeight="900" fill="white" opacity="0.96">CB</text>
          
          {/* Shimmer overlay */}
          {animated && (
            <rect x="8" y="8" width="84" height="84" rx="20" ry="20" fill="url(#cbShimmer)" opacity="0.4" />
          )}
        </svg>
      </div>

      {/* REDITBUZZ Text */}
      <div className={cn("relative font-display font-black tracking-tight leading-none", config.text)}>
        {/* Glow layer */}
        {animated && (
          <span 
            className="absolute inset-0 blur-md opacity-50"
            style={{
              background: "linear-gradient(90deg, #2EF2E2, #7B3FE4, #D84EFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "textGlow 2s ease-in-out infinite alternate",
            }}
            aria-hidden="true"
          >
            CreditBuzz
          </span>
        )}
        
        {/* Main gradient text */}
        <span 
          className="relative"
          style={{
            background: animated
              ? "linear-gradient(90deg, #2EF2E2 0%, #7B3FE4 40%, #D84EFF 70%, #F5B44C 100%)"
              : "linear-gradient(90deg, #2EF2E2 0%, #7B3FE4 50%, #D84EFF 100%)",
            backgroundSize: animated ? "200% 100%" : "100% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: animated ? "gradientFlow 3s ease-in-out infinite" : undefined,
          }}
        >
          CreditBuzz
        </span>
      </div>

      <style>{`
        @keyframes logoGlowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1.4); }
          50% { opacity: 0.55; transform: scale(1.65); }
        }
        @keyframes iconGlow {
          0% { opacity: 0.4; filter: blur(10px); }
          100% { opacity: 0.75; filter: blur(16px); }
        }
        @keyframes textGlow {
          0% { opacity: 0.35; filter: blur(6px); }
          100% { opacity: 0.6; filter: blur(10px); }
        }
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};
