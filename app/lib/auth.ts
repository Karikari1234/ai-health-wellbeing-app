import { supabase } from "./supabase";

export async function getUser() {
  try {
    // First, check if there's already a session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      return sessionData.session.user;
    }
    
    // If no session found, try to get the user with a reasonable timeout
    const { data: { user } } = await supabase.auth.getUser();
    return user;
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
