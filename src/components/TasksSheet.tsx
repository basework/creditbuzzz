import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Star, Users, TrendingUp, Sparkles, Coins, Gift, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const surveyTasks = [
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

interface TasksSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasksSheet = ({ isOpen, onClose }: TasksSheetProps) => {
  const [completedTasks, setCompletedTasks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("creditbuzz_completed_tasks");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // timer state used when a task has been started
  // the countdown only runs while the sheet is visible;
  // if the user leaves the tab/app the timer pauses,
  // ensuring 10 full seconds of active viewing are required
  const [remainingTime, setRemainingTime] = useState("00:00:10");
  const [timerProgress, setTimerProgress] = useState(100);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const secondsRef = useRef(10);
  const intervalRef = useRef<number | null>(null);

  // helper to update UI from secondsRef
  const updateTime = () => {
    const secs = secondsRef.current;
    setRemainingTime(`00:00:${String(secs).padStart(2, '0')}`);
    setTimerProgress((secs / 10) * 100);
  };

  const resetTimer = () => {
    secondsRef.current = 10;
    updateTime();
  };

  const completeActive = () => {
    if (activeTaskId !== null && !completedTasks.includes(activeTaskId)) {
      const updated = [...completedTasks, activeTaskId];
      setCompletedTasks(updated);
      localStorage.setItem("creditbuzz_completed_tasks", JSON.stringify(updated));
      toast({
        title: "✅ Task Completed!",
        description: "Task has been marked as done.",
      });
    }
    setActiveTaskId(null);
    resetTimer();
  };

  // manage countdown and visibility
  useEffect(() => {
    const tick = () => {
      secondsRef.current -= 1;
      if (secondsRef.current <= 0) {
        clearInterval(intervalRef.current!);
        completeActive();
      } else {
        updateTime();
      }
    };

    const startInterval = () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 1000);
    };

    const stopInterval = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        stopInterval();
      } else if (activeTaskId !== null && isOpen) {
        startInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    if (activeTaskId !== null && isOpen && document.visibilityState === "visible") {
      startInterval();
    }

    // if sheet closes while a task is running, cancel it
    if (!isOpen && activeTaskId !== null) {
      stopInterval();
      setActiveTaskId(null);
      resetTimer();
    }

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [activeTaskId, isOpen]);

  const handleTaskStart = (task: typeof surveyTasks[0]) => {
    // open external link immediately
    window.open(task.link, "_blank", "noopener,noreferrer");
    // if already completed nothing to do
    if (completedTasks.includes(task.id)) return;
    // begin timing for this task
    setActiveTaskId(task.id);
    resetTimer();
  };

  if (!isOpen) return null;

  return (
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
          onClick={onClose}
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
          {activeTaskId !== null && (
            <div className="relative flex items-center gap-1">
              <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                {remainingTime}
              </span>
              <div className="w-8 h-1.5 bg-amber-900/30 rounded-full overflow-hidden border border-amber-500/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-100"
                  style={{ width: `${timerProgress}%` }}
                ></div>
              </div>
            </div>
          )}
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
                onClick={() => handleTaskStart(task)}
                disabled={
                  isCompleted || activeTaskId === task.id
                }
                className={`hh-task-btn ${
                  isCompleted
                    ? 'hh-task-btn-completed'
                    : activeTaskId === task.id
                      ? 'hh-task-btn-completed'
                      : 'hh-task-btn-available'
                }`}
              >
                {isCompleted
                  ? 'Completed Today'
                  : activeTaskId === task.id
                    ? 'In Progress'
                    : 'Start Task'}
              </button>
            </div>
          </div>
          );
        })}
      
      </div>

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

        .hh-task-btn-available {
          background: linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.1));
          border: 1.5px solid rgba(16,185,129,0.4);
        }

        .hh-task-btn-available:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(16,185,129,0.6);
          box-shadow: 0 8px 20px rgba(16,185,129,0.2);
        }

        .hh-task-btn-available:active:not(:disabled) {
          transform: translateY(0);
        }

        .hh-task-btn-completed {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          cursor: not-allowed;
          opacity: 0.7;
        }

        @keyframes hh-card-appear {
          from {
            opacity: 0;
            transform: translateY(8px);
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
