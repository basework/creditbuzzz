import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, XCircle, Receipt, RefreshCw } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  status: string;
  receipt_url: string | null;
  created_at: string;
}

export const PaymentsPending = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchPayments();
      
      // Set up realtime subscription
      const channel = supabase
        .channel("payments-updates")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "payments",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setPayments((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? { ...p, ...payload.new } : p
              )
            );
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, authLoading, navigate]);

  const fetchPayments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("payments")
      .select("id, amount, status, receipt_url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data || []);
    }
    setIsLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-teal",
          bg: "bg-teal/10",
          border: "border-teal/20",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-400",
          bg: "bg-red-400/10",
          border: "border-red-400/20",
          label: "Rejected",
        };
      default:
        return {
          icon: Clock,
          color: "text-gold",
          bg: "bg-gold/10",
          border: "border-gold/20",
          label: "Pending",
        };
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingParticles />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-violet" />
            <span className="text-base font-semibold text-foreground">My Payments</span>
          </div>
          <button
            onClick={fetchPayments}
            className="p-2 -mr-2 rounded-xl hover:bg-secondary/50 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="relative z-10 px-5 py-5 pb-8 w-full max-w-md mx-auto">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Payments Yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your payment history will appear here
            </p>
            <button
              onClick={() => navigate("/buy-zfc")}
              className="px-6 py-2.5 bg-gradient-to-r from-violet to-magenta text-white font-semibold rounded-xl"
            >
              Buy ZFC
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => {
              const statusConfig = getStatusConfig(payment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/40"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.created_at)}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}
                    >
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                      <span className={`text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {payment.receipt_url && (
                    <div className="mt-3">
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-border/30"
                      >
                        <img
                          src={payment.receipt_url}
                          alt="Receipt"
                          className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
