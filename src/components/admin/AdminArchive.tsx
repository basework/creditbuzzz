import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CheckCircle2, 
  XCircle,
  Calendar,
  User,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminArchive = () => {
  const { payments, isLoading } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "rejected">("all");

  const archivedPayments = payments.filter(p => p.status !== "pending");

  const filteredPayments = archivedPayments.filter(payment => {
    const matchesSearch = 
      payment.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="h-24 bg-muted/20 rounded" />
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Archive</h2>
          <p className="text-muted-foreground text-sm">{archivedPayments.length} processed payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-48 bg-secondary/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "approved" | "rejected")}>
            <SelectTrigger className="w-full sm:w-40 bg-secondary/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPayments.map((payment, index) => (
          <GlassCard 
            key={payment.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`
                  p-2 rounded-xl
                  ${payment.status === "approved" ? "bg-teal/20" : "bg-destructive/20"}
                `}>
                  {payment.status === "approved" ? (
                    <CheckCircle2 className="w-5 h-5 text-teal" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">₦{payment.amount.toLocaleString()}</p>
                    <span className="text-sm text-muted-foreground">→</span>
                    <p className="text-sm text-teal">{payment.zfc_amount.toLocaleString()} ZFC</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {payment.account_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 
                      {format(new Date(payment.processed_at || payment.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  {payment.rejection_reason && (
                    <p className="text-xs text-destructive/80 mt-1">
                      Reason: {payment.rejection_reason}
                    </p>
                  )}
                </div>
              </div>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${payment.status === "approved" 
                  ? "bg-teal/20 text-teal" 
                  : "bg-destructive/20 text-destructive"
                }
              `}>
                {payment.status === "approved" ? "Approved" : "Rejected"}
              </span>
            </div>
          </GlassCard>
        ))}

        {filteredPayments.length === 0 && (
          <GlassCard className="text-center py-12">
            <p className="text-muted-foreground">No archived payments found</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
