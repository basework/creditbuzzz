import { useMemo } from "react";

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  color: string;
  opacity: number;
}

interface LuxuryBackgroundProps {
  intensity?: "low" | "medium" | "high";
}

export const LuxuryBackground = ({ intensity = "medium" }: LuxuryBackgroundProps) => {
  const particleCount = intensity === "low" ? 8 : intensity === "medium" ? 14 : 20;
  
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      "hsla(338, 78%, 58%, 0.4)",   // Rose pink
      "hsla(345, 55%, 75%, 0.35)",  // Metallic rose
      "hsla(338, 78%, 48%, 0.35)",  // Dark rose
    ];
    
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 8 + 6}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary gradient layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsla(338, 78%, 58%, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsla(345, 55%, 75%, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 50% 100%, hsla(338, 78%, 48%, 0.05) 0%, transparent 70%)
          `,
          animation: "nebulaMove 20s ease-in-out infinite alternate",
        }}
      />

      {/* Secondary glow layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, hsla(338, 78%, 58%, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, hsla(345, 55%, 75%, 0.04) 0%, transparent 40%)
          `,
          animation: "nebulaMove2 25s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Shimmer effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(125deg, transparent 40%, hsla(345, 55%, 75%, 0.02) 50%, transparent 60%)",
          animation: "diagonalShimmer 12s linear infinite",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `floatParticle ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}

      {/* Subtle orbs */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{
          top: "10%",
          left: "5%",
          background: "hsla(338, 78%, 58%, 0.04)",
          animation: "orbFloat 18s ease-in-out infinite",
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl"
        style={{
          bottom: "15%",
          right: "10%",
          background: "hsla(345, 55%, 75%, 0.03)",
          animation: "orbFloat 22s ease-in-out infinite reverse",
        }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full blur-2xl"
        style={{
          top: "50%",
          right: "30%",
          background: "hsla(338, 78%, 48%, 0.03)",
          animation: "orbPulse 10s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes nebulaMove {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, 15px) scale(1.03); }
        }
        @keyframes nebulaMove2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-15px, 20px) scale(1.02); }
        }
        @keyframes diagonalShimmer {
          0% { background-position: -100% -100%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          25% { transform: translate(12px, -18px); opacity: 0.25; }
          50% { transform: translate(-8px, -10px); opacity: 0.2; }
          75% { transform: translate(6px, -24px); opacity: 0.18; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, 20px); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
