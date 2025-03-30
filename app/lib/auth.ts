import { supabase } from "./supabase";
import { SupabaseUser } from "./types";

export async function getUser() {
  try {
    // First, check if there's already a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn("Error getting session:", sessionError);
      return null;
    }
    
    if (sessionData?.session) {
      console.log("Found existing session for user:", sessionData.session.user.id);
      return sessionData.session.user as SupabaseUser;
    }
    
    // If no session found, try to get the user with a timeout promise
    console.log("No session found, attempting to get user directly");
    
    const userPromise = new Promise(async (resolve) => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn("Error in getUser direct call:", error);
          resolve(null);
        } else if (data.user) {
          console.log("Found user directly:", data.user.id);
          resolve(data.user as SupabaseUser);
        } else {
          console.log("No user found through direct call");
          resolve(null);
        }
      } catch (e) {
        console.warn("Exception in getUser direct call:", e);
        resolve(null);
      }
    });
    
    // Wait for either user data or timeout
    const timeoutPromise = new Promise(resolve => setTimeout(() => {
      console.log("getUser timeout reached");
      resolve(null);
    }, 3000));
    
    // Race the promises
    const user = await Promise.race([userPromise, timeoutPromise]);
    return user as SupabaseUser | null;
  } catch (error) {
    console.warn("Error in getUser:", error);
    // Just return null on any error - don't disrupt the app flow
    return null;
  }
}

export async function signIn(email: string, password: string, isPasswordReset = false) {
  if (isPasswordReset) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  try {
    // First, sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    // Clear any client-side storage that might be causing issues
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any potential cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
    
    return { error };
  } catch (err) {
    console.error("Error during sign out:", err);
    return { error: err as any };
  }
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
}
