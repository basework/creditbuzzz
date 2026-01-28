import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MessageSquare, Users, User, Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  title: string;
  content: string;
  is_broadcast: boolean;
  read_at: string | null;
  created_at: string;
}

export const NotificationPanel = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showExpandedMessage, setShowExpandedMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile?.id) return;

    fetchMessages();

    // Real-time subscription for INSTANT message delivery
    const channel = supabase
      .channel("user-messages-instant")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Check if this message is for the current user
          if (newMessage.is_broadcast || newMessage.receiver_id === profile.id) {
            setMessages((prev) => [newMessage, ...prev]);
            setCurrentMessage(newMessage);
            setShowNotification(true);
            setUnreadCount((prev) => prev + 1);
            
            // Auto-hide notification after 8 seconds
            setTimeout(() => {
              setShowNotification(false);
            }, 8000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const fetchMessages = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`is_broadcast.eq.true,receiver_id.eq.${profile.id}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setMessages(data as Message[]);
      setUnreadCount(data.filter((m) => !m.read_at).length);
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, read_at: new Date().toISOString() } : m
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Clear message from view (mark as read and hide)
  const clearMessage = async (messageId: string) => {
    await markAsRead(messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // Open expanded message view from panel
  const openMessageFromPanel = (message: Message) => {
    setCurrentMessage(message);
    setShowExpandedMessage(true);
    setShowPanel(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(true)}
        className="relative p-2 rounded-xl bg-secondary/50 border border-border/40 hover:bg-secondary/70 transition-all"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-violet to-magenta text-white text-[10px] font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Banner - Positioned lower for visibility */}
      <AnimatePresence>
        {showNotification && currentMessage && !showExpandedMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-28 left-4 right-4 z-[100] max-w-[380px] mx-auto"
          >
            <div
              onClick={() => setShowExpandedMessage(true)}
              className="relative overflow-hidden rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform p-3"
              style={{
                background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--secondary)))",
                borderColor: currentMessage.is_broadcast
                  ? "hsl(var(--violet))"
                  : "hsl(var(--teal))",
                boxShadow: currentMessage.is_broadcast
                  ? "0 8px 32px hsla(262, 76%, 57%, 0.4)"
                  : "0 8px 32px hsla(174, 88%, 56%, 0.4)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: currentMessage.is_broadcast
                      ? "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--magenta)))"
                      : "linear-gradient(135deg, hsl(var(--teal)), hsl(var(--violet)))",
                  }}
                >
                  {currentMessage.is_broadcast ? (
                    <Users className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-violet">
                    {currentMessage.is_broadcast ? "📢 New Broadcast" : "💬 New Message"}
                  </p>
                  <p className="text-sm font-bold text-foreground truncate">
                    {currentMessage.title}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(currentMessage.id);
                    setShowNotification(false);
                  }}
                  className="p-2 rounded-full bg-secondary/80 hover:bg-destructive/30 transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Tap to read full message</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Message Modal */}
      <AnimatePresence>
        {showExpandedMessage && currentMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowExpandedMessage(false);
              setShowNotification(false);
              markAsRead(currentMessage.id);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  background: currentMessage.is_broadcast
                    ? "linear-gradient(135deg, hsla(var(--violet), 0.2), hsla(var(--magenta), 0.2))"
                    : "linear-gradient(135deg, hsla(var(--teal), 0.2), hsla(var(--violet), 0.2))",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: currentMessage.is_broadcast
                        ? "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--magenta)))"
                        : "linear-gradient(135deg, hsl(var(--teal)), hsl(var(--violet)))",
                    }}
                  >
                    {currentMessage.is_broadcast ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {currentMessage.is_broadcast ? "📢 Broadcast" : "💬 Personal"}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatTime(currentMessage.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowExpandedMessage(false);
                    setShowNotification(false);
                    markAsRead(currentMessage.id);
                  }}
                  className="p-2 rounded-full bg-secondary/80 hover:bg-destructive/30 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {currentMessage.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentMessage.content}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30">
                <button
                  onClick={() => {
                    setShowExpandedMessage(false);
                    setShowNotification(false);
                    markAsRead(currentMessage.id);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet to-magenta text-white font-semibold text-sm"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Notifications Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-magenta/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-violet" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Notifications</h2>
                      <p className="text-xs text-muted-foreground">
                        {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="overflow-y-auto h-[calc(100vh-88px)] p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openMessageFromPanel(message)}
                      className={`relative p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                        message.read_at
                          ? "bg-secondary/20 border-border/30"
                          : "bg-secondary/50 border-violet/30"
                      }`}
                    >
                      {/* Unread indicator */}
                      {!message.read_at && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet animate-pulse" />
                      )}

                      {/* Type badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            message.is_broadcast
                              ? "bg-violet/20 text-violet"
                              : "bg-teal/20 text-teal"
                          }`}
                        >
                          {message.is_broadcast ? "Broadcast" : "Personal"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">
                          {formatTime(message.created_at)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-foreground mb-1">
                        {message.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {message.content}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-violet font-medium">Tap to read</span>
                        
                        {/* Clear/Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearMessage(message.id);
                          }}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
