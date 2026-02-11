import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ children }) {
  const { user, profile } = useAuth();

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setSession(null);
      return;
    }

    // ⭐ Only fetch when matched
    if (profile?.onboarding_step !== "matched") {
      setSession(null);
      return;
    }
    if (profile?.onboarding_step !== "matched") {
  setSession(null);
  setLoadingSession(false);
  return;
}


    let mounted = true;

    const fetchSession = async () => {
      setLoadingSession(true);

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .maybeSingle();
      console.log(data)
      if (!mounted) return;

      if (error) {
        console.error("Session fetch error:", error);
        setLoadingSession(false);
        return;
      }

      setSession(data);
      setLoadingSession(false);
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, [user?.id, profile?.onboarding_step]);

  return (
    <SessionContext.Provider value={{ session, loadingSession }}>
      {children}
    </SessionContext.Provider>
  );
}
