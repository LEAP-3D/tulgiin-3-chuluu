import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type SupabaseAuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue>({
  session: null,
  user: null,
  isLoaded: false,
  isSignedIn: false,
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      supabase.realtime.setAuth(data.session?.access_token ?? "");
      setIsLoaded(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);
        supabase.realtime.setAuth(nextSession?.access_token ?? "");
        setIsLoaded(true);
      },
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoaded,
      isSignedIn: !!session,
    }),
    [isLoaded, session],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  return useContext(SupabaseAuthContext);
}
