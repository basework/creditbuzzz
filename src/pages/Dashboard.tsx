import { useState, useEffect } from "react";
import { ZenfiLogo } from "@/components/ui/ZenfiLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { VirtualBankCard } from "@/components/ui/VirtualBankCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { OnboardingModal } from "@/components/ui/OnboardingModal";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { 
  Bell,
  Settings,
  Wallet,
  Gift,
  Users,
  MessageCircle,
  Clock,
  Headphones,
  Coins,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const actionButtons = [
  { icon: Coins, label: "Buy ZFC", color: "from-violet to-magenta" },
  { icon: Gift, label: "Refer & Earn", color: "from-magenta to-gold" },
  { icon: Users, label: "Community", color: "from-teal to-violet" },
  { icon: Clock, label: "History", color: "from-gold to-magenta" },
  { icon: Headphones, label: "Support", color: "from-violet to-teal" },
];

export const Dashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [balance, setBalance] = useState(180000);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    // Check if onboarding was completed
    const onboardingComplete = localStorage.getItem("zenfi_onboarding_complete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
    
    // Check if already claimed today
    const lastClaim = localStorage.getItem("zenfi_last_claim");
    if (lastClaim) {
      const lastClaimDate = new Date(lastClaim);
      const today = new Date();
      if (lastClaimDate.toDateString() === today.toDateString()) {
        setHasClaimed(true);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("zenfi_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const handleClaim = () => {
    if (hasClaimed || isClaiming) return;
    
    setIsClaiming(true);
    
    // Simulate claim process
    setTimeout(() => {
      setBalance(prev => prev + 10000);
      setHasClaimed(true);
      localStorage.setItem("zenfi_last_claim", new Date().toISOString());
      setIsClaiming(false);
      
      toast({
        title: "Claim Successful!",
        description: "₦10,000 has been added to your balance.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <FloatingParticles />
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      
      {/* Header */}
      <header className="relative z-10 px-4 py-4 flex items-center justify-between">
        <ZenfiLogo size="sm" />
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-magenta rounded-full" />
          </button>
          <button className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="relative z-10 px-4 space-y-6">
        {/* Virtual Bank Card */}
        <div className="animate-fade-in-up">
          <VirtualBankCard balance={balance} cardNumber="4829" />
        </div>

        {/* Primary Action Buttons */}
        <div 
          className="grid grid-cols-2 gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={hasClaimed || isClaiming}
            className={`relative overflow-hidden glass-card p-4 flex items-center justify-center gap-3 transition-all duration-300 ${
              hasClaimed 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:scale-[1.02] active:scale-[0.98]"
            }`}
            style={{
              background: hasClaimed 
                ? "hsla(240, 7%, 12%, 0.9)"
                : "linear-gradient(135deg, hsla(262, 76%, 57%, 0.2), hsla(289, 100%, 65%, 0.15))",
            }}
          >
            {/* Glow effect */}
            {!hasClaimed && (
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, hsla(262, 76%, 57%, 0.3) 0%, transparent 70%)",
                }}
              />
            )}
            
            <div className={`p-2 rounded-xl ${hasClaimed ? "bg-muted" : "bg-violet/20"}`}>
              {isClaiming ? (
                <div className="w-5 h-5 border-2 border-violet border-t-transparent rounded-full animate-spin" />
              ) : hasClaimed ? (
                <CheckCircle className="w-5 h-5 text-teal" />
              ) : (
                <Gift className="w-5 h-5 text-violet" />
              )}
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground block text-sm">
                {hasClaimed ? "Claimed!" : isClaiming ? "Claiming..." : "Claim ₦10,000"}
              </span>
              {!hasClaimed && !isClaiming && (
                <span className="text-xs text-muted-foreground">Daily reward</span>
              )}
            </div>
          </button>

          {/* Withdraw Button */}
          <button
            className="relative overflow-hidden glass-card p-4 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsla(174, 88%, 56%, 0.15), hsla(262, 76%, 57%, 0.1))",
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "radial-gradient(circle at center, hsla(174, 88%, 56%, 0.2) 0%, transparent 70%)",
              }}
            />
            <div className="p-2 rounded-xl bg-teal/20">
              <Wallet className="w-5 h-5 text-teal" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground block text-sm">Withdraw</span>
              <span className="text-xs text-muted-foreground">To bank</span>
            </div>
          </button>
        </div>

        {/* Action Grid */}
        <div 
          className="space-y-3 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Quick Actions</h2>
            <span className="text-xs text-muted-foreground">Fast & reliable</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {actionButtons.map((action, index) => (
              <button
                key={action.label}
                className="glass-card p-4 flex flex-col items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 group animate-fade-in-up"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div 
                  className={`p-3 rounded-xl bg-gradient-to-br ${action.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  style={{
                    boxShadow: "0 4px 15px hsla(262, 76%, 57%, 0.2)",
                  }}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <GlassCard 
          className="text-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <h3 className="font-display font-semibold mb-2">Powered by Smart Infrastructure</h3>
          <p className="text-sm text-muted-foreground mb-1">
            Secured & encrypted transactions
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for speed, security, and reliability
          </p>
        </GlassCard>

        {/* Bottom Carousel Placeholder */}
        <div 
          className="animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-semibold">Featured</h2>
            <button className="flex items-center gap-1 text-xs text-teal hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index} className="pl-2 basis-[85%]">
                  <div 
                    className="glass-card h-36 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsla(${262 + index * 30}, 76%, 57%, 0.15), 
                        hsla(${289 + index * 20}, 100%, 65%, 0.1)
                      )`,
                    }}
                  >
                    {/* Placeholder pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, hsla(262, 76%, 57%, 0.3) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      />
                    </div>
                    
                    <div className="text-center z-10">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-secondary/50 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Banner {index + 1}</p>
                      <p className="text-xs text-muted-foreground/60">Image placeholder</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-3">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === 0 
                    ? "bg-violet w-4" 
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secure Access Footer */}
        <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-xs text-muted-foreground/50">
            🔒 Secure access • Powered by ZenFi
          </p>
        </div>
      </main>
    </div>
  );
};
