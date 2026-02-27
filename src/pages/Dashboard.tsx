import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ZenfiLogo } from "@/components/ui/ZenfiLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { VirtualBankCard } from "@/components/ui/VirtualBankCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { OnboardingModal } from "@/components/ui/OnboardingModal";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { ProfilePanel } from "@/components/ui/ProfilePanel";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { BannedOverlay } from "@/components/ui/BannedOverlay";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useClaimTimer } from "@/hooks/useClaimTimer";
import { useRouteHistory } from "@/hooks/useRouteHistory";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentState } from "@/hooks/usePaymentState";
import {
  Settings,
  Wallet,
  Gift,
  Timer,
  ExternalLink,
  ArrowLeft,
  Star,
  Check,
  Coins,
  Users,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import creditbuzzLogo from "@/assets/creditbuzz-logo.jpg";
import carousel3 from "@/assets/carousel-3.jpeg";
import carousel4 from "@/assets/carousel-4.jpeg";
import zfcIcon from "@/assets/cbc-icon.png";
import referIcon from "@/assets/refer-icon.png";
import supportIcon from "@/assets/support-icon.png";
import historyIcon from "@/assets/history-icon.png";
import communityIcon from "@/assets/community-icon.png";

const carouselImages = [creditbuzzLogo, carousel3, carousel4];

const surveyTasks = [
  {
    id: 1, title: "Join Site Survey", description: "Complete a quick site survey & earn rewards",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "HOT", icon: Star,
    iconBg: "linear-gradient(135deg, hsl(45,100%,51%), hsl(25,100%,55%))",
    bgFrom: "hsla(45,100%,51%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(45,100%,51%,0.2)", badgeBg: "hsla(45,100%,51%,0.2)", badgeColor: "hsl(45,100%,51%)",
  },
  {
    id: 2, title: "Referral Bonus Survey", description: "Answer referral questions & get paid instantly",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "NEW", icon: Users,
    iconBg: "linear-gradient(135deg, hsl(289,100%,65%), hsl(262,76%,57%))",
    bgFrom: "hsla(289,100%,65%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(289,100%,65%,0.2)", badgeBg: "hsla(289,100%,65%,0.2)", badgeColor: "hsl(289,100%,65%)",
  },
  {
    id: 3, title: "Earnings Growth Task", description: "Help us improve & unlock extra earnings",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "EARN", icon: TrendingUp,
    iconBg: "linear-gradient(135deg, hsl(174,88%,56%), hsl(174,70%,40%))",
    bgFrom: "hsla(174,88%,56%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(174,88%,56%,0.2)", badgeBg: "hsla(174,88%,56%,0.2)", badgeColor: "hsl(174,88%,56%)",
  },
  {
    id: 4, title: "Community Feedback", description: "Share your experience and earn bonus credits",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "EASY", icon: Sparkles,
    iconBg: "linear-gradient(135deg, hsl(262,76%,57%), hsl(174,88%,56%))",
    bgFrom: "hsla(262,76%,57%,0.06)", bgTo: "hsla(174,88%,56%,0.04)",
    borderColor: "hsla(262,76%,57%,0.2)", badgeBg: "hsla(262,76%,57%,0.2)", badgeColor: "hsl(262,76%,57%)",
  },
  {
    id: 5, title: "Daily Reward Survey", description: "Daily task — complete & collect your coins",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "DAILY", icon: Coins,
    iconBg: "linear-gradient(135deg, hsl(35,100%,55%), hsl(45,100%,51%))",
    bgFrom: "hsla(35,100%,55%,0.06)", bgTo: "hsla(45,100%,51%,0.04)",
    borderColor: "hsla(35,100%,55%,0.2)", badgeBg: "hsla(35,100%,55%,0.2)", badgeColor: "hsl(35,100%,55%)",
  },
  {
    id: 6, title: "Quick Feedback Survey", description: "Share your opinion and earn extra rewards",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "HOT", icon: Star,
    iconBg: "linear-gradient(135deg, hsl(45,100%,51%), hsl(25,100%,55%))",
    bgFrom: "hsla(45,100%,51%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(45,100%,51%,0.2)", badgeBg: "hsla(45,100%,51%,0.2)", badgeColor: "hsl(45,100%,51%)",
  },
  {
    id: 7, title: "Product Research Task", description: "Help us improve our products and services",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "NEW", icon: Users,
    iconBg: "linear-gradient(135deg, hsl(289,100%,65%), hsl(262,76%,57%))",
    bgFrom: "hsla(289,100%,65%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(289,100%,65%,0.2)", badgeBg: "hsla(289,100%,65%,0.2)", badgeColor: "hsl(289,100%,65%)",
  },
  {
    id: 8, title: "Marketing Survey", description: "Rate our services and get rewarded instantly",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "EARN", icon: TrendingUp,
    iconBg: "linear-gradient(135deg, hsl(174,88%,56%), hsl(174,70%,40%))",
    bgFrom: "hsla(174,88%,56%,0.06)", bgTo: "hsla(262,76%,57%,0.04)",
    borderColor: "hsla(174,88%,56%,0.2)", badgeBg: "hsla(174,88%,56%,0.2)", badgeColor: "hsl(174,88%,56%)",
  },
  {
    id: 9, title: "User Experience Survey", description: "Tell us how we can serve you better",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "EASY", icon: Sparkles,
    iconBg: "linear-gradient(135deg, hsl(262,76%,57%), hsl(174,88%,56%))",
    bgFrom: "hsla(262,76%,57%,0.06)", bgTo: "hsla(174,88%,56%,0.04)",
    borderColor: "hsla(262,76%,57%,0.2)", badgeBg: "hsla(262,76%,57%,0.2)", badgeColor: "hsl(262,76%,57%)",
  },
  {
    id: 10, title: "Weekend Bonus Survey", description: "Complete during weekends for bonus rewards",
    link: "https://helpinghands.money", reward: "+₦5,000", badge: "DAILY", icon: Coins,
    iconBg: "linear-gradient(135deg, hsl(35,100%,55%), hsl(45,100%,51%))",
    bgFrom: "hsla(35,100%,55%,0.06)", bgTo: "hsla(45,100%,51%,0.04)",
    borderColor: "hsla(35,100%,55%,0.2)", badgeBg: "hsla(35,100%,55%,0.2)", badgeColor: "hsl(35,100%,55%)",
  },
];

const allActionButtons = [
  { icon: null, customIcon: supportIcon, label: "Support", color: "from-violet to-teal", route: "https://t.me/creditbuzzadmin", animation: "pulse" as const, external: true },
  { icon: null, customIcon: historyIcon, label: "Tasks", color: "from-gold to-magenta", route: "tasks", animation: "bounce" as const },
  { icon: null, customIcon: communityIcon, label: "Community", color: "from-teal to-violet", route: "/community", animation: "float" as const },
  { icon: null, customIcon: zfcIcon, label: "Buy CBC", color: "from-gold to-magenta", route: "/buy-zfc", animation: "glow" as const },
  { icon: null, customIcon: referIcon, label: "Tap & Earn", color: "from-magenta to-gold", route: "/referral", animation: "glow" as const },
  { icon: null, customIcon: referIcon, label: "Referral", color: "from-violet to-magenta", route: "/refer", animation: "pulse" as const },
];

// Helper: check if it's currently a weekend (Fri 00:00 - Sun 23:50)
const isWeekendNow = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
  if (day === 5 || day === 6) return true;
  if (day === 0) {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours < 23 || (hours === 23 && minutes <= 50);
  }
  return false;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isBanned, isLoading: authLoading, refreshProfile } = useAuth();
  const { 
    hasPendingPayment, 
    latestPayment, 
    isLoading: paymentLoading,
    statusChanged,
    clearStatusChange,
    needsStatusAcknowledgement 
  } = usePaymentState(user?.id);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const location = useLocation();
  const [showTasksSheet, setShowTasksSheet] = useState(() => !!(location.state as any)?.openTasks);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("creditbuzz_completed_tasks");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [recentTransactions, setRecentTransactions] = useState<{id: string; amount: number; date: string; status: string; type: string}[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  // Only used for optimistic claim updates - starts null, set after a claim
  const [claimBoost, setClaimBoost] = useState(0);
  
  // Balance: profile balance + any optimistic claim boost applied this session
  const profileBalance = profile?.balance ?? null;
  const displayBalance = profileBalance !== null ? Number(profileBalance) + claimBoost : 0;
  const isBalanceLoading = profileBalance === null;
  const { canClaim, remainingTime, startCooldown } = useClaimTimer();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  
  // Track route for persistence
  useRouteHistory();

  // Responsive columns for quick action grid (mobile -> desktop)
  const quickActionCols = isWeekendNow() ? "md:grid-cols-5 lg:grid-cols-5" : "md:grid-cols-4 lg:grid-cols-4";


  // Redirect to payment status when payment is approved/rejected in real-time
  useEffect(() => {
    if (statusChanged) {
      navigate("/payment-status");
    }
  }, [statusChanged, navigate]);

  // Check on mount if user needs to see their approved/rejected payment status
  useEffect(() => {
    if (!paymentLoading && needsStatusAcknowledgement) {
      navigate("/payment-status");
    }
  }, [paymentLoading, needsStatusAcknowledgement, navigate]);

  // Reset claimBoost when profile balance updates from server
  // Only reset if server balance already includes the boost (i.e., server caught up)
  const lastServerBalanceRef = useRef<number | null>(null);
  useEffect(() => {
    if (profile?.balance !== undefined && profile?.balance !== null) {
      const serverBalance = Number(profile.balance);
      const prevServer = lastServerBalanceRef.current;
      // If server balance went UP (meaning our update was persisted), safe to reset boost
      if (prevServer !== null && serverBalance >= prevServer + claimBoost) {
        setClaimBoost(0);
      } else if (prevServer === null) {
        // First load — no boost to worry about
        setClaimBoost(0);
      }
      lastServerBalanceRef.current = serverBalance;
    }
  }, [profile?.balance]);

  // Real-time CBC code notification only (no balance manipulation)
  useEffect(() => {
    if (!profile?.user_id) return;
    const currentZfcCode = (profile as typeof profile & { zfc_code?: string })?.zfc_code;

    const channel = supabase
      .channel("dashboard-cbc-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${profile.user_id}`,
        },
        (payload) => {
          const newData = payload.new as { zfc_code?: string };
          if (newData.zfc_code && newData.zfc_code !== currentZfcCode) {
            toast({
              title: "🎉 CBC Code Purchased!",
              description: "Your withdrawal activation code is ready. View it in your profile.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.user_id, profile]);


  useEffect(() => {
    const onboardingComplete = localStorage.getItem("creditbuzz_onboarding_complete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  // Fetch recent transactions for history sheet on mount
  useEffect(() => {
    if (user?.id) fetchRecentTransactions();
  }, [user?.id]);

  const addClaimToDatabase = async (amount: number) => {
    if (!user?.id) return;
    
    try {
      await supabase.from("claims").insert({
        user_id: user.id,
        amount,
        status: "success",
      });
    } catch (error) {
      console.error("Error saving claim to database:", error);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("creditbuzz_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const handleClaim = () => {
    // Guard: must have a real user session and not already claiming
    if (isClaiming || !canClaim) return;

    // Use user.id if available, otherwise fall back to cached profile's user_id
    const userId = user?.id || profile?.user_id;
    if (!userId) return;

    // Lock immediately — prevents double-tap
    setIsClaiming(true);

    // Start cooldown FIRST so canClaim flips to false instantly
    startCooldown()
      .then(() => setTimeout(() => setIsClaiming(false), 300))
      .catch((err) => {
        console.error(err);
        setTimeout(() => setIsClaiming(false), 300);
      });
    const currentBalance = Number(profile?.balance ?? 0) + claimBoost;
    const newBalance = currentBalance + 10000;

    // INSTANT UI update
    setClaimBoost(prev => prev + 10000);

    // Cache update
    try {
      const cached = localStorage.getItem("creditbuzz_profile_cache");
      if (cached) {
        const cachedProfile = JSON.parse(cached);
        cachedProfile.balance = newBalance;
        localStorage.setItem("creditbuzz_profile_cache", JSON.stringify(cachedProfile));
      }
    } catch (e) {
      // Ignore cache errors
    }

    toast({
      title: "₦10,000 Successfully Claimed!",
      description: "Your balance has been updated.",
    });

    // Fire-and-forget server sync
    const syncBalance = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        const { error } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('user_id', userId);
        if (!error) {
          try {
            await refreshProfile();
          } catch (e) {
            console.error('refreshProfile failed after update:', e);
          }
          return;
        }
        console.error(`Balance sync attempt ${i + 1} failed:`, error);
        if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }

      // If all retries failed, persist the optimistic value in local cache
      try {
        const cached = localStorage.getItem("creditbuzz_profile_cache");
        if (cached) {
          const cachedProfile = JSON.parse(cached);
          cachedProfile.balance = newBalance;
          localStorage.setItem("creditbuzz_profile_cache", JSON.stringify(cachedProfile));
        }
      } catch (e) {
        console.error('Failed to persist optimistic balance to cache:', e);
      }
    };

    syncBalance().catch(console.error);
    addClaimToDatabase(10000).catch(console.error);

  };

  const handleTaskComplete = async (task: typeof surveyTasks[0]) => {
    window.open(task.link, "_blank", "noopener,noreferrer");
    if (completedTasks.includes(task.id)) return;

    const updatedCompleted = [...completedTasks, task.id];
    setCompletedTasks(updatedCompleted);
    localStorage.setItem("creditbuzz_completed_tasks", JSON.stringify(updatedCompleted));

    toast({
      title: "✅ Task Completed!",
      description: "Task has been marked as done.",
    });
  };

  const fetchRecentTransactions = async () => {
    if (!user?.id) return;
    setClaimsLoading(true);
    try {
      const [{ data: claims }, { data: withdrawals }] = await Promise.all([
        supabase.from("claims").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
        supabase.from("withdrawals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
      ]);
      const all = [
        ...(claims || []).map(c => ({ id: c.id, amount: c.amount, date: c.created_at, status: c.status, type: "claim" })),
        ...(withdrawals || []).map(w => ({ id: w.id, amount: w.amount, date: w.created_at, status: w.status, type: "withdraw" })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12);
      setRecentTransactions(all);
    } catch (e) { console.error(e); }
    finally { setClaimsLoading(false); }
  };

  const handleActionClick = (route?: string, external?: boolean) => {
    if (route === "tasks") {
      setShowTasksSheet(true);
      return;
    }
    if (route) {
      if (external) {
        window.open(route, "_blank", "noopener,noreferrer");
        return;
      }
      // If user is trying to go to Buy ZFC and has pending payment, redirect to status
      if (route === "/buy-zfc" && hasPendingPayment) {
        navigate("/payment-status");
        return;
      }
      navigate(route);
    }
  };

  // Show banned overlay if user is banned
  if (isBanned) {
    return <BannedOverlay reason={profile?.ban_reason} />;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <FloatingParticles />
      
      {showOnboarding && (
        <OnboardingModal 
          onComplete={handleOnboardingComplete}
          isNewAccount={!!profile?.created_at && (Date.now() - new Date(profile.created_at).getTime()) < 30 * 60 * 1000}
        />
      )}
      
      <ProfilePanel isOpen={showProfilePanel} onClose={() => setShowProfilePanel(false)} />
      
      {/* Official CreditBuzz Warning Banner */}
      <WarningBanner />
      
      {/* Compact Header */}
      <header className="relative z-50 px-4 py-3 flex items-center justify-between">
        <ZenfiLogo size="sm" />
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <ProfileAvatar onClick={() => setShowProfilePanel(true)} size="sm" />
          <button 
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors group"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </header>

      <main className="relative z-0 px-4 space-y-4">
        {/* Balance Card with History button inside */}
        <div className="animate-fade-in-up">
          <VirtualBankCard 
            balance={isBalanceLoading ? 0 : displayBalance} 
            cardNumber="4829" 
            className="min-h-[110px]"
            isLoading={isBalanceLoading}
            onHistoryClick={() => { fetchRecentTransactions(); setShowHistorySheet(true); }}
          />
        </div>

        {/* Primary Action Buttons - More Compact */}
        <div 
          className="grid grid-cols-2 gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Claim Button with Timer */}
          <button
            onClick={handleClaim}
            disabled={!canClaim || isClaiming}
            className={`relative overflow-hidden glass-card p-3 flex items-center gap-3 transition-all duration-300 ${
              !canClaim 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:scale-[1.02] active:scale-[0.98]"
            }`}
            style={{
              background: !canClaim 
                ? "hsla(240, 7%, 12%, 0.9)"
                : "linear-gradient(135deg, hsla(262, 76%, 57%, 0.2), hsla(289, 100%, 65%, 0.15))",
            }}
          >
            {/* Pulse glow when active */}
            {canClaim && !isClaiming && (
              <div 
                className="absolute inset-0 animate-pulse opacity-30"
                style={{
                  background: "radial-gradient(circle at center, hsla(262, 76%, 57%, 0.4) 0%, transparent 70%)",
                }}
              />
            )}
            
            <div className={`p-2 rounded-xl ${!canClaim ? "bg-muted" : "bg-violet/20"}`}>
              {isClaiming ? (
                <div className="w-4 h-4 border-2 border-violet border-t-transparent rounded-full animate-spin" />
              ) : !canClaim ? (
                <Timer className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Gift className="w-4 h-4 text-violet" />
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              {!canClaim ? (
                <>
                  <span className="font-semibold text-foreground block text-sm">
                    Next Claim
                  </span>
                  <span className="text-xs text-teal font-mono">{remainingTime}</span>
                </>
              ) : isClaiming ? (
                <span className="font-semibold text-foreground block text-sm">
                  Claiming...
                </span>
              ) : (
                <>
                  <span className="font-semibold text-foreground block text-sm">
                    Claim ₦10,000
                  </span>
                  <span className="text-xs text-muted-foreground">Tap to claim</span>
                </>
              )}
            </div>
          </button>

          {/* Withdraw Button */}
          <button
            onClick={() => navigate("/withdrawal")}
            className="relative overflow-hidden glass-card p-3 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, hsla(174, 88%, 56%, 0.15), hsla(262, 76%, 57%, 0.1))",
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "radial-gradient(circle at center, hsla(174, 88%, 56%, 0.2) 0%, transparent 70%)",
              }}
            />
            <div className="p-2 rounded-xl bg-teal/20">
              <Wallet className="w-4 h-4 text-teal" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground block text-sm">Withdraw</span>
              <span className="text-xs text-muted-foreground">To bank</span>
            </div>
          </button>
        </div>

        {/* REDESIGNED QUICK ACTIONS - 2-2-2 Layout */}
        <div 
          className="space-y-3 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-display font-semibold">Quick Actions</h2>
            <span className="text-[10px] text-violet font-medium bg-violet/10 px-2 py-0.5 rounded-full">6 services</span>
          </div>
          
          {/* 2-2-2 Grid - 2 columns on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {allActionButtons.filter(action => !(action as any).weekendOnly || isWeekendNow()).map((action, index) => {
              const isHiddenWeekend = false;
              return (
              <div
                key={action.label}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${0.25 + index * 0.03}s` }}
              >
                {/* Animated gradient border on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet/0 via-violet/30 to-magenta/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500" />
                
                {/* Glass background with hover effect */}
                <div className="relative bg-secondary/30 backdrop-blur-sm rounded-xl p-3 border border-white/5 hover:border-violet/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet/20">
                  <button
                    onClick={() => {
                      if (isHiddenWeekend) {
                        toast({
                          title: "⏳ Available on Weekends",
                          description: "CBC purchase opens on Friday. Make sure to buy your CBC code by Friday 11:57 AM!",
                        });
                        return;
                      }
                      handleActionClick(action.route, (action as any).external);
                    }}
                    className="w-full flex flex-col items-center gap-2"
                  >
                    {/* Icon Container with animated gradient */}
                    <div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${action.color} relative overflow-hidden`}
                      style={{
                        boxShadow: "0 4px 12px hsla(262, 76%, 57%, 0.3), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)",
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                      
                      {action.customIcon ? (
                        <img src={action.customIcon} alt={action.label} className="w-8 h-8 rounded-lg object-cover" />
                      ) : action.icon && (
                        <AnimatedIcon 
                          icon={action.icon} 
                          className="w-6 h-6 text-white" 
                          animationType={action.animation}
                        />
                      )}
                    </div>
                    
                    {/* Label with glow on hover */}
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight">
                      {action.label}
                    </span>
                    
                    {/* Subtle indicator dot */}
                    <div className="w-1 h-1 rounded-full bg-violet/0 group-hover:bg-violet/50 transition-all duration-300" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
          
          {/* Decorative gradient line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent mt-1" />
        </div>

        {/* Bottom Carousel - Auto-sliding */}
        <div 
          className="animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-display font-semibold">Featured</h2>
          </div>
          
          <div 
            className="overflow-hidden rounded-2xl shadow-lg"
            style={{
              border: "1px solid hsla(262, 76%, 57%, 0.25)",
              boxShadow: "0 8px 32px hsla(262, 76%, 57%, 0.18)",
            }}
            ref={emblaRef}
          >
            <div className="flex">
              {carouselImages.map((image, index) => (
                <div 
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative"
                  style={{ height: "160px" }}
                >
                  <img 
                    src={image} 
                    alt={`CreditBuzz featured ad ${index + 1}`}
                    className="w-full h-full"
                    style={{ objectFit: "fill", display: "block" }}
                  />
                  {/* Ad label */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                    <span className="text-[9px] text-white/80 font-medium tracking-wide">Official Ad</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secure Footer */}
        <div className="text-center pt-2 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-[10px] text-muted-foreground/50">
            🔒 Secure environment • Encrypted system • Powered by CreditBuzz
          </p>
        </div>
      </main>

      {/* ── UPDATED TASKS PAGE WITH TASK PAGE DESIGN ── */}
      {showTasksSheet && (
        <div className="hh-task-root fixed inset-0 z-50 flex flex-col overflow-hidden">
          {/* Animated background bubbles */}
          <div className="hh-bubbles-container" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`hh-bubble hh-bubble-${i + 1}`}></div>
            ))}
          </div>

          {/* Mesh gradient overlay */}
          <div className="hh-mesh-overlay" aria-hidden="true"></div>

          {/* Header */}
          <header className="relative z-10 hh-task-header-nav px-4 py-4 flex items-center gap-3 border-b border-white/5">
            <button
              onClick={() => setShowTasksSheet(false)}
              className="hh-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="hh-title">Earn More</h1>
              <p className="hh-subtitle">Complete tasks & earn rewards</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                {surveyTasks.length - completedTasks.length} Available
              </span>
              <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20 animate-pulse">
                10s Timer
              </span>
            </div>
          </header>

          {/* Tasks list */}
          <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <div className="hh-card hh-card-hero mb-4">
              <div className="hh-orb hh-orb-1" aria-hidden="true"></div>
              <div className="hh-orb hh-orb-2" aria-hidden="true"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="hh-icon-ring">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">💰 Earn Rewards</p>
                  <p className="text-sm text-white/80">Complete simple survey tasks to earn ₦5,000 each</p>
                </div>
              </div>
            </div>

            {surveyTasks.map((task, index) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
              <div
                key={task.id}
                className="hh-task-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="hh-task-header">
                  <div className="flex items-center gap-3">
                    <div className="hh-task-icon" style={{ background: task.iconBg }}>
                      <task.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="hh-task-title">{task.title}</h3>
                      <p className="hh-task-desc">{task.description}</p>
                    </div>
                  </div>
                </div>

                <div className="hh-task-body">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="hh-reward-badge">
                        <Gift className="h-3 w-3" />
                        {task.reward}
                      </span>
                      <span className="text-xs text-gray-500">reward</span>
                    </div>
                    
                    {isCompleted && (
                      <span className="hh-status-badge hh-status-completed">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleTaskComplete(task)}
                    disabled={isCompleted}
                    className={`hh-task-btn ${
                      isCompleted
                        ? 'hh-task-btn-completed'
                        : 'hh-task-btn-available'
                    }`}
                  >
                    {isCompleted ? 'Completed Today' : 'Start Task'}
                  </button>
                </div>
              </div>
              );
            })}
          
          </div>
        </div>
      )}

      {/* ── HISTORY SHEET ── */}
      {showHistorySheet && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistorySheet(false)} />
          <div
            className="relative mt-auto w-full rounded-t-2xl overflow-hidden flex flex-col animate-fade-in-up"
            style={{ maxHeight: "88vh", background: "hsl(var(--background))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div>
                <h2 className="text-base font-display font-bold">Transaction History</h2>
                <p className="text-[10px] text-muted-foreground">{recentTransactions.length} recent transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setShowHistorySheet(false); navigate("/history"); }} className="text-[11px] text-violet font-semibold px-2 py-1 rounded-lg bg-violet/10 hover:bg-violet/20 transition-colors">
                  View All
                </button>
                <button onClick={() => setShowHistorySheet(false)} className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors">
                  <span className="text-muted-foreground text-sm font-bold">✕</span>
                </button>
              </div>
            </div>
            {/* Transactions list */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
              {claimsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-violet border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Claim your first reward on the dashboard</p>
                </div>
              ) : (
                recentTransactions.map((txn, i) => (
                  <div key={txn.id} className="glass-card p-3 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className={`p-2 rounded-xl flex-shrink-0 ${txn.type === "claim" ? "bg-teal/20" : "bg-magenta/20"}`}>
                      {txn.type === "claim" ? (
                        <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs">{txn.type === "claim" ? "Daily Claim" : "Withdrawal"}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(txn.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-display font-bold text-sm ${txn.type === "claim" ? "text-teal" : "text-foreground"}`}>
                        {txn.type === "claim" ? "+" : "-"}₦{Number(txn.amount).toLocaleString()}
                      </p>
                      <span className={`text-[9px] font-medium ${txn.status === "success" ? "text-teal" : txn.status === "pending" ? "text-gold" : "text-magenta"}`}>
                        {txn.status === "success" ? "Completed" : txn.status === "pending" ? "Pending" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hh-task-root {
          background: #050d14;
          color: white;
        }

        .hh-bubbles-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .hh-bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: hh-bubble-rise linear infinite;
        }

        .hh-bubble-1  { width: 8px; height: 8px; left: 10%; background: radial-gradient(circle, rgba(16,185,129,0.6), transparent); animation-duration: 8s; animation-delay: 0s; }
        .hh-bubble-2  { width: 14px; height: 14px; left: 25%; background: radial-gradient(circle, rgba(59,130,246,0.5), transparent); animation-duration: 11s; animation-delay: 1.5s; }
        .hh-bubble-3  { width: 6px; height: 6px; left: 40%; background: radial-gradient(circle, rgba(16,185,129,0.7), transparent); animation-duration: 9s; animation-delay: 3s; }
        .hh-bubble-4  { width: 18px; height: 18px; left: 55%; background: radial-gradient(circle, rgba(139,92,246,0.4), transparent); animation-duration: 13s; animation-delay: 0.5s; }
        .hh-bubble-5  { width: 10px; height: 10px; left: 70%; background: radial-gradient(circle, rgba(16,185,129,0.5), transparent); animation-duration: 10s; animation-delay: 2s; }
        .hh-bubble-6  { width: 5px; height: 5px; left: 82%; background: radial-gradient(circle, rgba(52,211,153,0.8), transparent); animation-duration: 7s; animation-delay: 4s; }
        .hh-bubble-7  { width: 12px; height: 12px; left: 15%; background: radial-gradient(circle, rgba(59,130,246,0.4), transparent); animation-duration: 12s; animation-delay: 5s; }
        .hh-bubble-8  { width: 7px; height: 7px; left: 35%; background: radial-gradient(circle, rgba(16,185,129,0.6), transparent); animation-duration: 9.5s; animation-delay: 2.5s; }
        .hh-bubble-9  { width: 20px; height: 20px; left: 60%; background: radial-gradient(circle, rgba(16,185,129,0.2), transparent); animation-duration: 15s; animation-delay: 1s; }
        .hh-bubble-10 { width: 9px; height: 9px; left: 88%; background: radial-gradient(circle, rgba(139,92,246,0.5), transparent); animation-duration: 10.5s; animation-delay: 6s; }
        .hh-bubble-11 { width: 4px; height: 4px; left: 5%; background: radial-gradient(circle, rgba(52,211,153,0.9), transparent); animation-duration: 6.5s; animation-delay: 3.5s; }
        .hh-bubble-12 { width: 16px; height: 16px; left: 48%; background: radial-gradient(circle, rgba(59,130,246,0.3), transparent); animation-duration: 14s; animation-delay: 7s; }

        @keyframes hh-bubble-rise {
          0%   { transform: translateY(100vh) scale(0.5); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }

        .hh-mesh-overlay {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(16,185,129,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .hh-task-header-nav {
          background: linear-gradient(180deg, rgba(5,13,20,0.95) 0%, rgba(5,13,20,0.8) 100%);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(16,185,129,0.15);
          position: relative;
          z-index: 10;
        }

        .hh-back-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .hh-back-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }

        .hh-title {
          font-size: 20px;
          font-weight: 800;
          color: white;
          line-height: 1.2;
        }

        .hh-subtitle {
          font-size: 12px;
          color: rgba(16,185,129,0.8);
        }

        .hh-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .hh-card-hero {
          background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,13,20,0.9) 50%, rgba(245,158,11,0.1) 100%);
          border-color: rgba(16,185,129,0.2);
        }

        .hh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .hh-orb-1 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(16,185,129,0.2), transparent);
          top: -40px; right: -40px;
          animation: hh-orb-float 6s ease-in-out infinite;
        }

        .hh-orb-2 {
          width: 100px; height: 100px;
          background: radial-gradient(circle, rgba(245,158,11,0.15), transparent);
          bottom: 20px; left: -20px;
          animation: hh-orb-float 8s ease-in-out infinite reverse;
        }

        @keyframes hh-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(8px, -8px) scale(1.05); }
          66%       { transform: translate(-4px, 6px) scale(0.97); }
        }

        .hh-icon-ring {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(245,158,11,0.2));
          border: 1px solid rgba(245,158,11,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hh-task-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: hh-card-appear 0.4s ease-out both;
        }

        .hh-task-card:hover {
          transform: translateY(-2px);
          border-color: rgba(16,185,129,0.3);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .hh-task-header {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .hh-task-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hh-task-title {
          font-weight: 700;
          color: white;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .hh-task-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .hh-task-body {
          padding: 16px;
        }

        .hh-reward-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1));
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
        }

        .hh-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .hh-status-completed {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
        }

        .hh-task-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .hh-task-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .hh-task-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .hh-task-btn-available {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 15px rgba(16,185,129,0.3);
        }

        .hh-task-btn-completed {
          background: rgba(255,255,255,0.1);
          cursor: not-allowed;
          color: rgba(255,255,255,0.4);
        }

        @keyframes hh-card-appear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hh-bubble, .hh-orb-1, .hh-orb-2 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
