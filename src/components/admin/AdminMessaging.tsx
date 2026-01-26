import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, User, MessageSquare, X, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
}

export const AdminMessaging = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"broadcast" | "individual">("broadcast");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, email, full_name")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter both title and message",
        variant: "destructive",
      });
      return;
    }

    if (mode === "individual" && !selectedUser) {
      toast({
        title: "Select a user",
        description: "Please select a user to send the message to",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("messages").insert({
      sender_id: user?.id,
      receiver_id: mode === "individual" ? selectedUser?.id : null,
      title: title.trim(),
      content: content.trim(),
      is_broadcast: mode === "broadcast",
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Failed to send",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setTitle("");
        setContent("");
        setSelectedUser(null);
      }, 2000);
      
      toast({
        title: mode === "broadcast" ? "Broadcast sent!" : "Message sent!",
        description: mode === "broadcast" 
          ? "All users will receive this message" 
          : `Message sent to ${selectedUser?.full_name || selectedUser?.email}`,
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-xl bg-secondary/50 border border-border/40">
        <button
          onClick={() => setMode("broadcast")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
            mode === "broadcast"
              ? "bg-gradient-to-r from-violet to-magenta text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Broadcast All
        </button>
        <button
          onClick={() => setMode("individual")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
            mode === "individual"
              ? "bg-gradient-to-r from-violet to-magenta text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Individual
        </button>
      </div>

      {/* Individual User Selector */}
      <AnimatePresence>
        {mode === "individual" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Recipient
              </label>
              
              {selectedUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal/10 border border-teal/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedUser.full_name || "No name"}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowUserPicker(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-border/60 hover:border-violet/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    Click to select a user
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Picker Modal */}
      <AnimatePresence>
        {showUserPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowUserPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-bold text-foreground mb-3">Select User</h3>
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowUserPicker(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet/20 to-magenta/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-violet" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {u.full_name || "No name"}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No users found</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Title
          </label>
          <Input
            placeholder="Enter message title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary/30 border-border/50 focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Message
          </label>
          <Textarea
            placeholder="Type your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-secondary/30 border-border/50 focus:border-violet/50 resize-none"
          />
        </div>
      </div>

      {/* Send Button */}
      <motion.button
        onClick={handleSend}
        disabled={isLoading || isSent}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isSent
            ? "linear-gradient(135deg, hsl(var(--teal)), hsl(var(--teal)))"
            : "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--magenta)))",
          boxShadow: "0 12px 30px hsla(var(--violet), 0.35)",
        }}
        whileHover={{ boxShadow: "0 15px 40px hsla(var(--violet), 0.45)" }}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : isSent ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Sent Successfully!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {mode === "broadcast" ? "Send to All Users" : "Send Message"}
            </>
          )}
        </span>
      </motion.button>

      {/* Info Text */}
      <p className="text-xs text-center text-muted-foreground">
        {mode === "broadcast" ? (
          <>
            <MessageSquare className="w-3 h-3 inline mr-1" />
            This message will be sent to all registered users instantly
          </>
        ) : (
          <>
            <User className="w-3 h-3 inline mr-1" />
            This message will only be visible to the selected user
          </>
        )}
      </p>
    </div>
  );
};
