import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  balance: number;
  referral_code: string | null;
  referral_count: number;
  status: "active" | "banned";
  ban_reason: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isBanned: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    isLoading: true,
    isBanned: false,
  });

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch profile and admin status
          const [profileResult, roleResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single(),
            supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }),
          ]);

          const profile = profileResult.data as Profile | null;
          const isAdmin = roleResult.data === true;
          const isBanned = profile?.status === "banned";

          setAuthState({
            user: session.user,
            session,
            profile,
            isAdmin,
            isLoading: false,
            isBanned,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            profile: null,
            isAdmin: false,
            isLoading: false,
            isBanned: false,
          });
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          referral_code: referralCode,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshProfile = async () => {
    if (!authState.user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authState.user.id)
      .single();
    
    if (data) {
      setAuthState(prev => ({
        ...prev,
        profile: data as Profile,
        isBanned: data.status === "banned",
      }));
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };
};
