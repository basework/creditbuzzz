import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ZenfiLogo } from "@/components/ui/ZenfiLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useRouteHistory } from "@/hooks/useRouteHistory";
import { 
  ArrowLeft, 
  Users, 
  Bell, 
  Shield, 
  Gift,
  MessageCircle,
  Star,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Coins,
  Trophy,
  Target,
  Heart,
  ThumbsUp,
  Award,
  Globe
} from "lucide-react";

const communityFeatures = [
  {
    icon: Bell,
    title: "Official Updates",
    description: "Get real-time notifications on new features and announcements",
  },
  {
    icon: Gift,
    title: "Rewards Alerts",
    description: "Never miss exclusive bonuses and claim opportunities",
  },
  {
    icon: Shield,
    title: "Security Notices",
    description: "Stay informed about security tips and account protection",
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description: "Connect with verified users and get help instantly",
  },
];

// 10 Community Tasks
const communityTasks = [
  {
    id: "task1",
    title: "Join Telegram Channel",
    description: "Join our official CreditBuzz Telegram community",
    reward: 5000,
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #10b981, #059669)",
    link: "https://t.me/creditbuzz",
    category: "Social"
  },
  {
    id: "task2",
    title: "Follow on Twitter",
    description: "Follow CreditBuzz on Twitter for latest updates",
    reward: 5000,
    icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    iconBg: "linear-gradient(135deg, #1DA1F2, #0d8bd9)",
    link: "https://twitter.com/creditbuzz",
    category: "Social"
  },
  {
    id: "task3",
    title: "Join WhatsApp Group",
    description: "Connect with verified users on WhatsApp",
    reward: 5000,
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #25D366, #128C7E)",
    link: "https://chat.whatsapp.com/creditbuzz",
    category: "Social"
  },
  {
    id: "task4",
    title: "Subscribe to Newsletter",
    description: "Get weekly updates and exclusive offers",
    reward: 5000,
    icon: <Bell className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #fbbf24, #d97706)",
    link: "https://creditbuzz.com/newsletter",
    category: "Updates"
  },
  {
    id: "task5",
    title: "Refer a Friend",
    description: "Invite friends to join CreditBuzz community",
    reward: 5000,
    icon: <Users className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    link: "/refer",
    category: "Referral"
  },
  {
    id: "task6",
    title: "Complete Profile",
    description: "Fill in your profile details for verification",
    reward: 5000,
    icon: <CheckCircle2 className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #ec4899, #db2777)",
    link: "/profile",
    category: "Verification"
  },
  {
    id: "task7",
    title: "Join Discord Server",
    description: "Connect with the community on Discord",
    reward: 5000,
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #5865F2, #404EED)",
    link: "https://discord.gg/creditbuzz",
    category: "Social"
  },
  {
    id: "task8",
    title: "Watch Tutorial",
    description: "Learn how to maximize your earnings",
    reward: 5000,
    icon: <Target className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #f43f5e, #e11d48)",
    link: "https://youtube.com/creditbuzz",
    category: "Learning"
  },
  {
    id: "task9",
    title: "Share on Instagram",
    description: "Share CreditBuzz on your Instagram story",
    reward: 5000,
    icon: <Heart className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #e1306c, #c13584)",
    link: "https://instagram.com/creditbuzz",
    category: "Social"
  },
  {
    id: "task10",
    title: "Review on Trustpilot",
    description: "Leave a review and help others trust us",
    reward: 5000,
    icon: <Star className="w-5 h-5 text-white" />,
    iconBg: "linear-gradient(135deg, #00b67a, #00a86b)",
    link: "https://trustpilot.com/creditbuzz",
    category: "Reviews"
  }
];

export const Community = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [verifyingTasks, setVerifyingTasks] = useState<Record<string, {progress: number, startTime: number}>>({});
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [showCoinRain, setShowCoinRain] = useState(false);
  const progressIntervals = useRef<Record<string, NodeJS.Timeout>>({});
  
  useRouteHistory();

  // Load saved tasks on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem("creditbuzz-community-tasks");
    if (savedCompleted) {
      setCompletedTasks(JSON.parse(savedCompleted));
    }
    
    const savedCooldowns = localStorage.getItem("creditbuzz-community-cooldowns");
    if (savedCooldowns) {
      setCooldowns(JSON.parse(savedCooldowns));
    }
  }, []);

  // Clean up intervals
  useEffect(() => {
    return () => {
      Object.values(progressIntervals.current).forEach(clearInterval);
    };
  }, []);

  // Countdown timer for cooldowns
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const updated = { ...cooldowns };
      let changed = false;

      Object.keys(updated).forEach((key) => {
        if (updated[key] <= now) {
          delete updated[key];
          changed = true;
        }
      });

      if (changed) {
        setCooldowns(updated);
        localStorage.setItem("creditbuzz-community-cooldowns", JSON.stringify(updated));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [cooldowns]);

  const startProgressAnimation = (taskId: string) => {
    if (progressIntervals.current[taskId]) {
      clearInterval(progressIntervals.current[taskId]);
    }
    
    const startTime = Date.now();
    
    setVerifyingTasks(prev => ({
      ...prev,
      [taskId]: { progress: 0, startTime }
    }));
    
    const interval = setInterval(() => {
      setVerifyingTasks(prev => {
        if (!prev[taskId]) return prev;
        
        const elapsed = (Date.now() - prev[taskId].startTime) / 1000;
        const newProgress = Math.min((elapsed / 10) * 100, 100);
        
        if (newProgress >= 100) {
          clearInterval(progressIntervals.current[taskId]);
          delete progressIntervals.current[taskId];
          completeTask(taskId);
        }
        
        return {
          ...prev,
          [taskId]: { ...prev[taskId], progress: newProgress }
        };
      });
    }, 100);
    
    progressIntervals.current[taskId] = interval;
  };

  const completeTask = (taskId: string) => {
    const task = communityTasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    localStorage.setItem("creditbuzz-community-tasks", JSON.stringify(newCompleted));

    // Set cooldown (24 hours from now)
    const cooldownTime = Date.now() + (24 * 60 * 60 * 1000);
    const newCooldowns = { ...cooldowns, [taskId]: cooldownTime };
    setCooldowns(newCooldowns);
    localStorage.setItem("creditbuzz-community-cooldowns", JSON.stringify(newCooldowns));

    // Remove from verifying
    setVerifyingTasks(prev => {
      const newState = { ...prev };
      delete newState[taskId];
      return newState;
    });

    if (progressIntervals.current[taskId]) {
      clearInterval(progressIntervals.current[taskId]);
      delete progressIntervals.current[taskId];
    }

    // Update user balance
    const storedUser = localStorage.getItem("tivexx-user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.balance = (user.balance || 0) + task.reward;
      localStorage.setItem("tivexx-user", JSON.stringify(user));
    }

    // Show coin rain
    setShowCoinRain(true);
    setTimeout(() => setShowCoinRain(false), 3000);
  };

  const handleTaskClick = (task: typeof communityTasks[0]) => {
    if (completedTasks.includes(task.id)) {
      return;
    }

    if (cooldowns[task.id] && cooldowns[task.id] > Date.now()) {
      return;
    }

    if (task.link.startsWith('http')) {
      window.open(task.link, '_blank');
      startProgressAnimation(task.id);
    } else {
      navigate(task.link);
      startProgressAnimation(task.id);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleJoinCommunity = () => {
    window.open("https://t.me/creditbuzz", "_blank");
  };

  return (
    <div className="hh-root min-h-screen pb-28 relative overflow-hidden">
      {/* Coin Rain Animation */}
      {showCoinRain && (
        <div className="coin-rain">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="coin"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated background bubbles */}
      <div className="hh-bubbles-container" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`hh-bubble hh-bubble-${i + 1}`}></div>
        ))}
      </div>

      {/* Mesh gradient overlay */}
      <div className="hh-mesh-overlay" aria-hidden="true"></div>
      
      {/* Header */}
      <header className="relative z-10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="hh-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <ZenfiLogo size="sm" />
      </header>

      <main className="relative z-10 px-4 space-y-5 max-w-md mx-auto pb-6">
        {/* Hero Section - Preserved exactly as is */}
        <div className="text-center animate-fade-in-up">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsla(262, 76%, 57%, 0.2), hsla(289, 100%, 65%, 0.15))",
              boxShadow: "0 8px 32px hsla(262, 76%, 57%, 0.2)",
            }}
          >
            <Users className="w-8 h-8 text-violet" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">
            Join the CreditBuzz Community
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Stay connected with verified CreditBuzz users, get official updates, rewards alerts, security notices, and community support.
          </p>
        </div>

        {/* Trust Badge - Preserved exactly as is */}
        <GlassCard 
          className="flex items-center justify-center gap-2 py-3 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Star className="w-4 h-4 text-gold" />
          <span className="text-xs font-medium">Be part of a growing trusted fintech network</span>
          <Star className="w-4 h-4 text-gold" />
        </GlassCard>

        {/* Features Grid - Preserved exactly as is */}
        <div 
          className="grid grid-cols-2 gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          {communityFeatures.map((feature, index) => (
            <GlassCard
              key={feature.title}
              className="p-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-fade-in-up"
              style={{ 
                animationDelay: `${0.2 + index * 0.05}s`,
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: "linear-gradient(135deg, hsla(262, 76%, 57%, 0.15), hsla(174, 88%, 56%, 0.1))",
                }}
              >
                <feature.icon className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Member Count - Preserved exactly as is */}
        <GlassCard 
          className="text-center py-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium"
                  style={{
                    background: `linear-gradient(135deg, hsla(${262 + i * 20}, 76%, 57%, 0.3), hsla(${289 + i * 15}, 100%, 65%, 0.2))`,
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">5,000+ Members</p>
              <p className="text-[10px] text-muted-foreground">Active & verified users</p>
            </div>
          </div>
        </GlassCard>

        {/* Community Tasks Section */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.42s" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-display font-semibold">Community Tasks</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {communityTasks.length - completedTasks.length} Available
              </span>
              <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                10s Timer
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {communityTasks.map((task, index) => {
              const isVerifying = verifyingTasks[task.id] !== undefined;
              const progress = isVerifying ? verifyingTasks[task.id].progress : 0;
              const isCompleted = completedTasks.includes(task.id);
              const cooldown = cooldowns[task.id];
              const timeLeft = cooldown ? cooldown - Date.now() : 0;

              return (
                <div
                  key={task.id}
                  className={`hh-task-card animate-fade-in-up`}
                  style={{ animationDelay: `${0.45 + index * 0.03}s` }}
                >
                  <div className="hh-task-header">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: task.iconBg }}
                      >
                        {task.icon}
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
                          ₦{task.reward.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">reward</span>
                      </div>
                      
                      {isCompleted && (
                        <span className="hh-status-badge hh-status-completed">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                      
                      {isVerifying && (
                        <span className="hh-status-badge hh-status-pending">
                          <Clock className="h-3 w-3" />
                          Verifying...
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleTaskClick(task)}
                      disabled={isCompleted || isVerifying || (cooldown && timeLeft > 0)}
                      className={`hh-task-btn ${
                        isCompleted
                          ? 'hh-task-btn-completed'
                          : isVerifying
                          ? 'hh-task-btn-pending'
                          : cooldown && timeLeft > 0
                          ? 'hh-task-btn-completed'
                          : 'hh-task-btn-available'
                      }`}
                    >
                      {isVerifying ? `Verifying ${Math.floor(progress)}%` : 
                       isCompleted ? 'Completed Today' : 
                       cooldown && timeLeft > 0 ? 'Wait 24h' : 
                       'Start Task'}
                    </button>

                    {isVerifying && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">10s timer</span>
                          <span className="text-emerald-400 font-bold">{Math.floor(progress)}%</span>
                        </div>
                        <div className="hh-progress-track">
                          <div 
                            className="hh-progress-fill hh-progress-verify" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {cooldown && timeLeft > 0 && !isVerifying && (
                      <div className="mt-3 hh-cooldown">
                        <Clock className="h-3 w-3" />
                        <span>Available in: {formatTime(timeLeft)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join Button - Preserved exactly as is */}
        <button
          onClick={handleJoinCommunity}
          className="w-full relative overflow-hidden glass-card py-4 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group animate-fade-in-up"
          style={{
            animationDelay: "0.65s",
            background: "linear-gradient(135deg, hsla(262, 76%, 57%, 0.25), hsla(289, 100%, 65%, 0.2))",
            boxShadow: "0 8px 32px hsla(262, 76%, 57%, 0.25)",
          }}
        >
          {/* Animated glow */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at center, hsla(262, 76%, 57%, 0.3) 0%, transparent 70%)",
            }}
          />
          
          <MessageCircle className="w-5 h-5 text-violet relative z-10" />
          <span className="font-display font-semibold text-base relative z-10">Join Our Community</span>
          <ExternalLink className="w-4 h-4 text-muted-foreground relative z-10" />
        </button>

        {/* Security Footer - Preserved exactly as is */}
        <div className="text-center pt-2 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <p className="text-[10px] text-muted-foreground/50">
            🔒 Official CreditBuzz channel • Verified & secure
          </p>
        </div>
      </main>

      <style jsx global>{`
        /* ─── IMPORT FONT ─── */
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap');

        /* ─── ROOT & BACKGROUND ─── */
        .hh-root {
          font-family: 'Syne', sans-serif;
          background: #050d14;
          color: white;
          min-height: 100vh;
        }

        /* ─── BUBBLES ─── */
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

        /* ─── MESH OVERLAY ─── */
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

        /* ─── BACK BUTTON ─── */
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

        /* ─── TASK CARDS ─── */
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

        .hh-status-pending {
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
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

        .hh-task-btn-pending {
          background: linear-gradient(135deg, #fbbf24, #d97706);
          box-shadow: 0 4px 15px rgba(245,158,11,0.3);
        }

        .hh-task-btn-completed {
          background: rgba(255,255,255,0.1);
          cursor: not-allowed;
          color: rgba(255,255,255,0.4);
        }

        .hh-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          overflow: hidden;
        }

        .hh-progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .hh-progress-verify {
          background: linear-gradient(90deg, #fbbf24, #d97706);
          box-shadow: 0 0 10px rgba(245,158,11,0.5);
        }

        .hh-cooldown {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 30px;
          padding: 8px 12px;
          font-size: 12px;
          color: #fbbf24;
        }

        /* ─── COIN RAIN ─── */
        .coin-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }

        .coin {
          position: absolute;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #fbbf24, #d97706);
          border-radius: 50%;
          animation: coin-fall 3s linear forwards;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          top: -30px;
        }

        @keyframes coin-fall {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
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
          .hh-bubble, .coin, [class*="animate-"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
