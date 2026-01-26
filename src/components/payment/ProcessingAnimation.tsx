import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Shield, Zap } from "lucide-react";

interface ProcessingAnimationProps {
  onComplete: () => void;
}

export const ProcessingAnimation = ({ onComplete }: ProcessingAnimationProps) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stageTimers = [
      setTimeout(() => setStage(1), 1500),
      setTimeout(() => setStage(2), 3000),
      setTimeout(() => setStage(3), 4500),
      setTimeout(() => {
        onComplete();
      }, 5000),
    ];

    return () => {
      clearInterval(progressInterval);
      stageTimers.forEach(clearTimeout);
    };
  }, [onComplete]);

  const stages = [
    { icon: Loader2, text: "Initiating secure connection...", color: "text-violet" },
    { icon: Shield, text: "Verifying transaction details...", color: "text-teal" },
    { icon: Zap, text: "Processing your request...", color: "text-gold" },
    { icon: Check, text: "Verification complete!", color: "text-teal" },
  ];

  const currentStage = stages[stage];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-magenta/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Main animation circle */}
        <div className="relative">
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-violet/30"
            style={{
              background: `conic-gradient(hsl(var(--violet)) ${progress * 3.6}deg, transparent 0deg)`,
            }}
          />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <currentStage.icon
                  className={`w-12 h-12 ${currentStage.color} ${stage < 3 ? "animate-spin" : ""}`}
                  style={{ animationDuration: stage === 0 ? "1s" : "0s" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stage text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {currentStage.text}
            </h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your request
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet to-magenta rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Progress percentage */}
        <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
      </div>
    </motion.div>
  );
};
