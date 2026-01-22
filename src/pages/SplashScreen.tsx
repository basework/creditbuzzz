import { useEffect, useState } from "react";
import { ZenfiLogo } from "@/components/ui/ZenfiLogo";
import { LuxuryBackground } from "@/components/ui/LuxuryBackground";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2700);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-background flex items-center justify-center z-50 transition-all duration-500 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <LuxuryBackground intensity="medium" />
      
      <div 
        className="relative z-10 flex flex-col items-center"
        style={{
          animation: "splashEnter 1s ease-out forwards",
        }}
      >
        {/* Logo with enhanced glow */}
        <div className="relative">
          <div 
            className="absolute inset-0 blur-3xl opacity-50"
            style={{
              background: "linear-gradient(135deg, #7B3FE4, #D84EFF, #F5B44C)",
              animation: "logoGlowExpand 2.5s ease-in-out infinite",
            }}
          />
          <ZenfiLogo size="xl" animated />
        </div>
        
        {/* Progress bar */}
        <div className="mt-10 w-40 h-1 rounded-full overflow-hidden bg-muted/30">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7B3FE4, #D84EFF, #F5B44C)",
              boxShadow: "0 0 20px rgba(216, 78, 255, 0.5)",
            }}
          />
        </div>
        
        {/* Loading text */}
        <p 
          className="mt-4 text-sm text-muted-foreground/50"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.3s forwards",
            opacity: 0,
          }}
        >
          Securing your wallet...
        </p>
      </div>

      <style>{`
        @keyframes splashEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes logoGlowExpand {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
