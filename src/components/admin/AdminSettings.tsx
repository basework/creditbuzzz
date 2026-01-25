import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  User, 
  Shield, 
  Activity,
  Clock,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActivityLog {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export const AdminSettings = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLog = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("admin_activity_log")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (data) {
        setActivityLog(data as ActivityLog[]);
      }
      setIsLoading(false);
    };

    fetchActivityLog();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      ban_user: "Banned user",
      unban_user: "Unbanned user",
      approve_payment: "Approved payment",
      reject_payment: "Rejected payment",
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Admin Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your admin profile</p>
      </div>

      {/* Admin Profile */}
      <GlassCard className="animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-2xl font-bold text-white">
            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{profile?.full_name || "Admin"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-violet/20 text-violet text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Administrator
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Security Notice */}
      <GlassCard className="animate-fade-in-up border-gold/30" style={{ animationDelay: "100ms" }}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gold/20">
            <AlertTriangle className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h4 className="font-semibold text-gold">Security Notice</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This is a privileged admin session. All actions are logged and monitored. 
              Never share your credentials or leave your session unattended.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Activity Log */}
      <GlassCard className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-teal/20">
            <Activity className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h4 className="font-semibold">Recent Activity</h4>
            <p className="text-xs text-muted-foreground">Your admin actions</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/20 rounded animate-pulse" />
            ))}
          </div>
        ) : activityLog.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet" />
                  <span className="text-sm">{getActionLabel(log.action)}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.created_at), "MMM d, h:mm a")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No activity recorded yet</p>
        )}
      </GlassCard>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout Admin Session
      </Button>
    </div>
  );
};
