import { cn } from "@/lib/utils";

interface ZenfiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeConfig = {
  sm: { container: "gap-1", z: "w-10 h-10", text: "text-2xl" },
  md: { container: "gap-2", z: "w-14 h-14", text: "text-4xl" },
  lg: { container: "gap-3", z: "w-20 h-20", text: "text-5xl" },
  xl: { container: "gap-4", z: "w-28 h-28", text: "text-7xl" },
};

export const ZenfiLogo = ({ className, size = "md", animated = false }: ZenfiLogoProps) => {
  const config = sizeConfig[size];
  
  return (
    <div className={cn("relative flex items-center justify-center", config.container, className)}>
      {/* Background glow */}
      {animated && (
        <div 
          className="absolute inset-0 blur-3xl opacity-50 scale-150 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(216, 78, 255, 0.5), rgba(123, 63, 228, 0.4), transparent 70%)",
            animation: "logoGlowPulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Crystalline Z Icon */}
      <div className={cn("relative", config.z)}>
        {/* Z glow layer */}
        <div 
          className="absolute inset-0 blur-xl opacity-70"
          style={{
            background: "linear-gradient(135deg, #2EF2E2, #7B3FE4, #D84EFF, #F5B44C)",
            animation: animated ? "zGlow 2.5s ease-in-out infinite alternate" : undefined,
          }}
        />
        
        {/* SVG Z with crystalline effect */}
        <svg viewBox="0 0 100 100" className="relative w-full h-full">
          <defs>
            {/* Main multi-color gradient */}
            <linearGradient id="zMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2EF2E2" />
              <stop offset="30%" stopColor="#7B3FE4" />
              <stop offset="60%" stopColor="#D84EFF" />
              <stop offset="100%" stopColor="#F5B44C" />
            </linearGradient>
            
            {/* Highlight for 3D crystalline effect */}
            <linearGradient id="zHighlight" x1="0%" y1="0%" x2="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            {/* Secondary facet gradient */}
            <linearGradient id="zFacet" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5B44C" />
              <stop offset="50%" stopColor="#D84EFF" />
              <stop offset="100%" stopColor="#7B3FE4" />
            </linearGradient>

            {/* Shimmer effect */}
            <linearGradient id="zShimmer" x1="-100%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
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
          </defs>
          
          {/* Main Z shape - outer */}
          <path 
            d="M12 15 L88 15 L88 28 L38 72 L88 72 L88 85 L12 85 L12 72 L62 28 L12 28 Z"
            fill="url(#zMainGradient)"
            filter={animated ? "url(#glow)" : undefined}
          />
          
          {/* Inner facet - top */}
          <path 
            d="M18 20 L82 20 L82 25 L55 25 L18 25 Z"
            fill="url(#zHighlight)"
            opacity="0.7"
          />
          
          {/* Inner facet - diagonal highlight */}
          <path 
            d="M60 28 L85 28 L40 68 L32 68 Z"
            fill="url(#zHighlight)"
            opacity="0.3"
          />
          
          {/* Bottom accent */}
          <path 
            d="M15 75 L58 75 L88 75 L88 82 L15 82 Z"
            fill="url(#zFacet)"
            opacity="0.5"
          />
          
          {/* Shimmer overlay */}
          {animated && (
            <path 
              d="M12 15 L88 15 L88 28 L38 72 L88 72 L88 85 L12 85 L12 72 L62 28 L12 28 Z"
              fill="url(#zShimmer)"
              opacity="0.6"
            />
          )}
          
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* ENFI Text (completing ZENFI) */}
      <div className={cn("relative font-display font-black tracking-tight", config.text)}>
        {/* Text glow layer */}
        {animated && (
          <span 
            className="absolute inset-0 blur-md opacity-60"
            style={{
              background: "linear-gradient(90deg, #7B3FE4, #D84EFF, #F5B44C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "textGlow 2s ease-in-out infinite alternate",
            }}
            aria-hidden="true"
          >
            ENFI
          </span>
        )}
        
        {/* Main gradient text */}
        <span 
          className="relative"
          style={{
            background: "linear-gradient(90deg, #7B3FE4 0%, #D84EFF 40%, #F5B44C 100%)",
            backgroundSize: animated ? "200% 100%" : "100% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: animated ? "gradientFlow 3s ease-in-out infinite" : undefined,
            textShadow: "0 0 40px rgba(216, 78, 255, 0.5)",
          }}
        >
          ENFI
        </span>
      </div>

      <style>{`
        @keyframes logoGlowPulse {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1.4);
          }
          50% { 
            opacity: 0.65;
            transform: scale(1.6);
          }
        }
        
        @keyframes zGlow {
          0% {
            opacity: 0.5;
            filter: blur(12px);
          }
          100% {
            opacity: 0.8;
            filter: blur(18px);
          }
        }
        
        @keyframes textGlow {
          0% {
            opacity: 0.4;
            filter: blur(8px);
          }
          100% {
            opacity: 0.7;
            filter: blur(12px);
          }
        }
        
        @keyframes gradientFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};
