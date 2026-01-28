import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  status: string;
  receipt_url: string | null;
  created_at: string;
  rejection_reason?: string | null;
}

interface PaymentState {
  hasPendingPayment: boolean;
  latestPayment: Payment | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const usePaymentState = (userId: string | undefined): PaymentState => {
  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentState = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch the latest payment for this user
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching payment state:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setLatestPayment(data as Payment);
        setHasPendingPayment(data.status === "pending");
      } else {
        setLatestPayment(null);
        setHasPendingPayment(false);
      }
    } catch (error) {
      console.error("Error in fetchPaymentState:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchPaymentState();
  }, [fetchPaymentState]);

  // Real-time subscription for payment status changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`payment-state-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newPayment = payload.new as Payment;
            setLatestPayment(newPayment);
            setHasPendingPayment(newPayment.status === "pending");
          } else if (payload.eventType === "UPDATE") {
            setLatestPayment((prev) => {
              if (prev && prev.id === payload.new.id) {
                const updated = { ...prev, ...payload.new } as Payment;
                setHasPendingPayment(updated.status === "pending");
                return updated;
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    hasPendingPayment,
    latestPayment,
    isLoading,
    refetch: fetchPaymentState,
  };
};
