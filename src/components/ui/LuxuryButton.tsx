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
          variant === "ghost" && "bg-transparent border border-border/50 text-foreground hover:border-teal hover:text-teal",
          className
        )}
        style={isPrimary ? {
          background: "linear-gradient(135deg, #7B3FE4, #D84EFF, #F5B44C)",
          boxShadow: "0 0 30px rgba(123, 63, 228, 0.4), 0 0 60px rgba(216, 78, 255, 0.2)",
        } : undefined}
        {...props}
      >
        {/* Breathing glow animation for primary */}
        {isPrimary && !loading && !disabled && (
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #7B3FE4, #D84EFF, #F5B44C)",
              animation: "breathingGlow 2.5s ease-in-out infinite",
            }}
          />
        )}
        
        {/* Hover shimmer effect */}
        {isPrimary && (
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
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
              box-shadow: 0 0 30px rgba(123, 63, 228, 0.4), 0 0 60px rgba(216, 78, 255, 0.2);
            }
            50% { 
              box-shadow: 0 0 50px rgba(123, 63, 228, 0.6), 0 0 80px rgba(216, 78, 255, 0.4), 0 0 100px rgba(245, 180, 76, 0.2);
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
