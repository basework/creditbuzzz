import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ children, className, loading, disabled, variant = "primary", ...props }, ref) => {
    const isPrimary = variant === "primary";
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative w-full h-[52px] rounded-xl font-semibold text-base",
          "transition-all duration-300 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          "flex items-center justify-center gap-2 overflow-hidden",
          "active:scale-[0.98]",
          isPrimary && "text-white",
          variant === "ghost" && "bg-transparent border border-border/50 text-foreground hover:border-rose hover:text-rose",
          className
        )}
        style={isPrimary ? {
          background: "linear-gradient(135deg, hsl(338, 78%, 58%), hsl(338, 80%, 48%))",
          boxShadow: "0 0 25px hsla(338, 78%, 58%, 0.35)",
        } : undefined}
        {...props}
      >
        {/* Breathing glow animation for primary */}
        {isPrimary && !loading && !disabled && (
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, hsl(338, 78%, 58%), hsl(338, 80%, 48%))",
              animation: "breathingGlow 2.5s ease-in-out infinite",
            }}
          />
        )}
        
        {/* Hover shimmer effect */}
        {isPrimary && (
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
              transform: "translateX(-100%)",
              animation: "buttonShimmer 3s ease-in-out infinite",
            }}
          />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            children
          )}
        </span>

        <style>{`
          @keyframes breathingGlow {
            0%, 100% { 
              box-shadow: 0 0 25px hsla(338, 78%, 58%, 0.35);
            }
            50% { 
              box-shadow: 0 0 40px hsla(338, 78%, 58%, 0.5), 0 0 60px hsla(345, 55%, 75%, 0.25);
            }
          }
          @keyframes buttonShimmer {
            0% { transform: translateX(-100%); }
            50%, 100% { transform: translateX(100%); }
          }
        `}</style>
      </button>
    );
  }
);

LuxuryButton.displayName = "LuxuryButton";
