import { AlertTriangle, Shield } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface BannedOverlayProps {
  reason?: string | null;
}

export const BannedOverlay = ({ reason }: BannedOverlayProps) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-destructive/10" />
      
      <GlassCard className="max-w-md w-full text-center animate-scale-in border-destructive/30">
        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold text-destructive">
              ⚠️ Account Suspended
            </h1>
            <p className="text-muted-foreground">
              This account has been suspended by an administrator.
            </p>
          </div>

          {/* Reason */}
          {reason && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-foreground/80">
                <span className="font-semibold text-destructive">Reason:</span> {reason}
              </p>
            </div>
          )}

          {/* Support Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Contact support if you believe this is an error</span>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/60 pt-4 border-t border-border/30">
            🔒 ZenFi Security System
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
