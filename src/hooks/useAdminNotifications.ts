import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  priority: "info" | "warning" | "important";
  is_broadcast: boolean;
  is_read: boolean;
  created_by: string | null;
  created_at: string;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setNotifications(data as Notification[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const sendBroadcast = async (title: string, message: string, priority: "info" | "warning" | "important") => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("notifications").insert({
      title,
      message,
      priority,
      is_broadcast: true,
      created_by: user?.id,
    });
    
    return { error };
  };

  const sendToUser = async (userId: string, title: string, message: string, priority: "info" | "warning" | "important") => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      priority,
      is_broadcast: false,
      created_by: user?.id,
    });
    
    return { error };
  };

  return {
    notifications,
    isLoading,
    sendBroadcast,
    sendToUser,
    refreshNotifications: fetchNotifications,
  };
};
