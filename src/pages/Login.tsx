import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ZenfiLogo } from "@/components/ui/ZenfiLogo";
import { LuxuryInput } from "@/components/ui/LuxuryInput";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { LuxuryBackground } from "@/components/ui/LuxuryBackground";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    toast({
      title: "Welcome Back!",
      description: "Login successful",
    });
    navigate("/dashboard");
    setLoading(false);
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <WarningBanner />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <LuxuryBackground intensity="high" />

        {/* Animated orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full opacity-20 animate-pulse"
            style={{ background: "radial-gradient(circle, #7B3FE4, transparent 70%)", animationDuration: "4s" }} />
          <div className="absolute bottom-1/4 -right-20 w-56 h-56 rounded-full opacity-15 animate-pulse"
            style={{ background: "radial-gradient(circle, #2EF2E2, transparent 70%)", animationDuration: "5s", animationDelay: "1s" }} />
          <div className="absolute top-3/4 left-1/3 w-40 h-40 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #D84EFF, transparent 70%)", animationDuration: "6s", animationDelay: "2s" }} />
        </div>
        
        <div 
          className="w-full max-w-[400px] relative z-10"
          style={{ animation: "pageEnter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8" style={{ animation: "floatIn 0.6s ease-out 0.1s both" }}>
            <ZenfiLogo size="lg" animated />
            <p className="mt-2 text-xs text-muted-foreground/50 tracking-widest uppercase">
              Secure Financial Platform
            </p>
          </div>

          {/* Glass Card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, hsla(240,7%,9%,0.95), hsla(240,7%,5%,0.98))",
              border: "1px solid hsla(262,76%,57%,0.18)",
              boxShadow: "0 30px 80px -20px hsla(0,0%,0%,0.7), 0 0 0 1px hsla(262,76%,57%,0.08), inset 0 1px 0 hsla(255,255%,255%,0.05)",
              animation: "floatIn 0.65s ease-out 0.15s both",
            }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, hsla(262,76%,57%,0.6), hsla(174,88%,56%,0.6), transparent)" }} />
            
            {/* Corner sparkles */}
            <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-teal/60 animate-pulse" />
            <div className="absolute top-5 right-6 w-0.5 h-0.5 rounded-full bg-violet/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-magenta/40 animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="p-7">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                  style={{ background: "hsla(174,88%,56%,0.08)", border: "1px solid hsla(174,88%,56%,0.15)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="text-[10px] text-teal/80 font-medium tracking-widest uppercase">Secure Login</span>
                </div>
                <h1 className="text-2xl font-display font-bold mb-1.5"
                  style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.08)" }}>
                  Welcome Back
                </h1>
                <p className="text-muted-foreground/60 text-sm">
                  Sign in to your <span className="text-teal/80">CreditBuzz</span> wallet
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div style={{ animation: "slideUp 0.4s ease-out 0.3s both" }}>
                  <LuxuryInput
                    type="email"
                    placeholder="Email address"
                    icon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div style={{ animation: "slideUp 0.4s ease-out 0.4s both" }}>
                  <LuxuryInput
                    type="password"
                    placeholder="Password"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end" style={{ animation: "slideUp 0.4s ease-out 0.45s both" }}>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(46,242,226,0.5)]"
                    style={{ color: "#2EF2E2" }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="pt-1" style={{ animation: "slideUp 0.4s ease-out 0.5s both" }}>
                  <LuxuryButton type="submit" loading={loading}>
                    Sign In
                  </LuxuryButton>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5" style={{ animation: "slideUp 0.4s ease-out 0.55s both" }}>
                <div className="flex-1 h-px" style={{ background: "hsla(0,0%,100%,0.06)" }} />
                <span className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">or</span>
                <div className="flex-1 h-px" style={{ background: "hsla(0,0%,100%,0.06)" }} />
              </div>

              {/* Switch to Sign Up */}
              <div className="text-center" style={{ animation: "slideUp 0.4s ease-out 0.6s both" }}>
                <p className="text-muted-foreground/50 text-sm">
                  New to CreditBuzz?{" "}
                  <Link 
                    to="/signup" 
                    className="font-semibold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(46,242,226,0.5)]"
                    style={{ color: "#2EF2E2" }}
                  >
                    Create account →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground/30 text-xs mt-6" style={{ animation: "floatIn 0.5s ease-out 0.7s both" }}>
            By signing in, you agree to our{" "}
            <span className="text-muted-foreground/50 hover:text-teal transition-colors cursor-pointer">Terms</span>
            {" & "}
            <span className="text-muted-foreground/50 hover:text-teal transition-colors cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
