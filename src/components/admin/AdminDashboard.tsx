import { useEffect, useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Ban,
  TrendingUp
} from "lucide-react";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  delay 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
  delay: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <GlassCard 
      className="animate-fade-in-up relative overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 font-display">{displayValue.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </GlassCard>
  );
};

export const AdminDashboard = () => {
  const { stats, isLoading } = useAdminData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <GlassCard key={i} className="animate-pulse">
              <div className="h-16 bg-muted/20 rounded" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time overview of ZenFi</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/20 text-teal text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-violet to-violet/70"
          delay={0}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={Clock}
          color="from-gold to-gold/70"
          delay={100}
        />
        <StatCard
          title="Approved Payments"
          value={stats.approvedPayments}
          icon={CheckCircle2}
          color="from-teal to-teal/70"
          delay={200}
        />
        <StatCard
          title="Rejected Payments"
          value={stats.rejectedPayments}
          icon={XCircle}
          color="from-magenta to-magenta/70"
          delay={300}
        />
        <StatCard
          title="Banned Accounts"
          value={stats.bannedAccounts}
          icon={Ban}
          color="from-destructive to-destructive/70"
          delay={400}
        />
      </div>

      {/* Quick Stats */}
      <GlassCard className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-violet/20">
            <TrendingUp className="w-5 h-5 text-violet" />
          </div>
          <h3 className="font-semibold">Quick Insights</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-teal">
              {stats.totalUsers > 0 
                ? Math.round((stats.approvedPayments / Math.max(stats.pendingPayments + stats.approvedPayments + stats.rejectedPayments, 1)) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Approval Rate</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-violet">{stats.pendingPayments}</p>
            <p className="text-xs text-muted-foreground">Awaiting Review</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-gold">
              {stats.totalUsers - stats.bannedAccounts}
            </p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-magenta">
              {stats.totalUsers > 0 
                ? Math.round((stats.bannedAccounts / stats.totalUsers) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Ban Rate</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
