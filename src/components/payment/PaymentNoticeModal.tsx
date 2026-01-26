import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

interface PaymentNoticeModalProps {
  onProceed: () => void;
}

export const PaymentNoticeModal = ({ onProceed }: PaymentNoticeModalProps) => {
  const notices = [
    { icon: CheckCircle, text: "Transfer the exact amount shown on the next page.", color: "text-teal" },
    { icon: CheckCircle, text: "Upload a clear payment screenshot immediately after transfer.", color: "text-teal" },
    { icon: XCircle, text: "Avoid using Opay bank — payments may not confirm.", color: "text-red-400" },
    { icon: CheckCircle, text: "Use any other Nigerian bank for instant confirmation.", color: "text-teal" },
    { icon: Info, text: "Payments from other banks are confirmed within minutes.", color: "text-violet" },
    { icon: AlertTriangle, text: "Do not dispute your payment under any circumstances — disputes delay confirmation.", color: "text-gold" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md bg-secondary/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertTriangle className="w-8 h-8 text-gold" />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">Important Payment Notice</h2>
        </div>

        {/* Warning badge */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30 rounded-full">
            Read Carefully
          </span>
        </div>

        {/* Notice items */}
        <div className="space-y-4 mb-8">
          {notices.map((notice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <notice.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${notice.color}`} />
              <p className="text-sm text-foreground/90 leading-relaxed">{notice.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Proceed button */}
        <motion.button
          onClick={onProceed}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet to-magenta text-white font-semibold rounded-xl shadow-lg shadow-violet/25 hover:shadow-xl hover:shadow-violet/30 transition-all"
        >
          I Understand, Proceed
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
