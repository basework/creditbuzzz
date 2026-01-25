import { useState } from "react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { useAdminData } from "@/hooks/useAdminData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Send, 
  Users, 
  User,
  AlertTriangle,
  Info,
  AlertCircle,
  Check
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminNotifications = () => {
  const { sendBroadcast, sendToUser, isLoading } = useAdminNotifications();
  const { users } = useAdminData();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    priority: "info" as "info" | "warning" | "important",
  });
  
  const [individualForm, setIndividualForm] = useState({
    userId: "",
    title: "",
    message: "",
    priority: "info" as "info" | "warning" | "important",
  });

  const handleBroadcast = async () => {
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    const { error } = await sendBroadcast(
      broadcastForm.title,
      broadcastForm.message,
      broadcastForm.priority
    );
    setSending(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      toast({
        title: "Broadcast Sent",
        description: "All users have been notified",
      });
      setBroadcastForm({ title: "", message: "", priority: "info" });
    }
  };

  const handleIndividual = async () => {
    if (!individualForm.userId || !individualForm.title.trim() || !individualForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    const { error } = await sendToUser(
      individualForm.userId,
      individualForm.title,
      individualForm.message,
      individualForm.priority
    );
    setSending(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      toast({
        title: "Notification Sent",
        description: "The user has been notified",
      });
      setIndividualForm({ userId: "", title: "", message: "", priority: "info" });
    }
  };

  const priorityOptions = [
    { value: "info", label: "Info", icon: Info, color: "text-blue-400" },
    { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-gold" },
    { value: "important", label: "Important", icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Notifications</h2>
        <p className="text-muted-foreground text-sm">Send alerts to users</p>
      </div>

      <Tabs defaultValue="broadcast" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger value="broadcast" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Individual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast" className="mt-4">
          <GlassCard className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-violet/20">
                <Bell className="w-5 h-5 text-violet" />
              </div>
              <div>
                <h3 className="font-semibold">Broadcast Notification</h3>
                <p className="text-xs text-muted-foreground">Send to all users</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Write your message..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="bg-secondary/50 border-border/50 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={broadcastForm.priority}
                  onValueChange={(value) => setBroadcastForm({ ...broadcastForm, priority: value as "info" | "warning" | "important" })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleBroadcast}
                disabled={sending}
                className={`w-full transition-all duration-300 ${
                  success 
                    ? "bg-teal hover:bg-teal" 
                    : "bg-gradient-to-r from-violet to-magenta hover:opacity-90"
                }`}
              >
                {success ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Sent!
                  </>
                ) : sending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="individual" className="mt-4">
          <GlassCard className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-teal/20">
                <User className="w-5 h-5 text-teal" />
              </div>
              <div>
                <h3 className="font-semibold">Individual Notification</h3>
                <p className="text-xs text-muted-foreground">Send to specific user</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User</label>
                <Select
                  value={individualForm.userId}
                  onValueChange={(value) => setIndividualForm({ ...individualForm, userId: value })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.full_name || "No Name"}</span>
                          <span className="text-muted-foreground text-xs">({user.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={individualForm.title}
                  onChange={(e) => setIndividualForm({ ...individualForm, title: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Write your message..."
                  value={individualForm.message}
                  onChange={(e) => setIndividualForm({ ...individualForm, message: e.target.value })}
                  className="bg-secondary/50 border-border/50 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={individualForm.priority}
                  onValueChange={(value) => setIndividualForm({ ...individualForm, priority: value as "info" | "warning" | "important" })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleIndividual}
                disabled={sending}
                className={`w-full transition-all duration-300 ${
                  success 
                    ? "bg-teal hover:bg-teal" 
                    : "bg-gradient-to-r from-teal to-violet hover:opacity-90"
                }`}
              >
                {success ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Sent!
                  </>
                ) : sending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
