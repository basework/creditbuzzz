import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CRASH_KEY = "creditbuzz_crash_mode";

export const CrashOverlay = () => {
  const { user } = useAuth();
  const [crashed, setCrashed] = useState(() => {
    try {
      return localStorage.getItem(CRASH_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!user) return;

    // Check latest broadcast on mount
    const checkLatest = async () => {
      const { data } = await supabase
        .from("messages")
        .select("content")
        .eq("is_broadcast", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const lower = data.content.toLowerCase();
        if (lower.includes("crash")) {
          setCrashed(true);
          localStorage.setItem(CRASH_KEY, "true");
        } else if (lower.includes("restore")) {
          setCrashed(false);
          localStorage.removeItem(CRASH_KEY);
        }
      }
    };
    checkLatest();

    // Listen for new broadcasts in real-time
    const channel = supabase
      .channel("crash-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as { is_broadcast: boolean; content: string };
          if (!msg.is_broadcast) return;
          const lower = msg.content.toLowerCase();
          if (lower.includes("crash")) {
            setCrashed(true);
            localStorage.setItem(CRASH_KEY, "true");
          } else if (lower.includes("restore")) {
            setCrashed(false);
            localStorage.removeItem(CRASH_KEY);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (!crashed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p style={{ color: "#333", fontSize: "14px", fontFamily: "monospace" }}>
        System unavailable
      </p>
    </div>
  );
};
