import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Ban, 
  CheckCircle2, 
  Mail, 
  Calendar,
  Wallet,
  MoreVertical,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const AdminUsers = () => {
  const { users, isLoading, banUser, unbanUser } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBan = async () => {
    if (!selectedUser || !banReason.trim()) return;
    
    setProcessing(true);
    const { error } = await banUser(selectedUser, banReason);
    setProcessing(false);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    } else {
      toast({
        title: "User Banned",
        description: "The user has been suspended successfully",
      });
      setBanDialogOpen(false);
      setBanReason("");
      setSelectedUser(null);
    }
  };

  const handleUnban = async (userId: string) => {
    const { error } = await unbanUser(userId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive",
      });
    } else {
      toast({
        title: "User Unbanned",
        description: "The user account has been reactivated",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="h-20 bg-muted/20 rounded" />
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Users Management</h2>
          <p className="text-muted-foreground text-sm">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-64 bg-secondary/50"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.map((user, index) => (
          <GlassCard 
            key={user.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                  ${user.status === "banned" 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-gradient-to-br from-violet/30 to-magenta/30 text-foreground"
                  }
                `}>
                  {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{user.full_name || "No Name"}</p>
                    {user.status === "banned" ? (
                      <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Banned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-teal/20 text-teal text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {format(new Date(user.created_at), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> {user.balance.toLocaleString()} ZFC
                    </span>
                  </div>
                  {user.ban_reason && (
                    <p className="text-xs text-destructive/80 mt-1">
                      Reason: {user.ban_reason}
                    </p>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user.status === "banned" ? (
                    <DropdownMenuItem
                      onClick={() => handleUnban(user.user_id)}
                      className="text-teal focus:text-teal"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Unban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user.user_id);
                        setBanDialogOpen(true);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Ban User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </GlassCard>
        ))}

        {filteredUsers.length === 0 && (
          <GlassCard className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </GlassCard>
        )}
      </div>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Ban className="w-5 h-5" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              This action will immediately suspend the user's account. They will see a warning message when trying to access the app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for ban</label>
              <Textarea
                placeholder="Enter the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={!banReason.trim() || processing}
            >
              {processing ? "Banning..." : "Confirm Ban"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
