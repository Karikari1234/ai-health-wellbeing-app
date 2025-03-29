import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if environment variables are defined
if (!supabaseUrl || supabaseUrl === "") {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey || supabaseAnonKey === "") {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a function to verify the Supabase connection
export async function verifySupabaseConnection() {
  try {
    // Check API key and URL
    let errors = [];

    if (!supabaseUrl || supabaseUrl.trim() === '') {
      errors.push('Supabase URL is missing or empty');
    } else if (!supabaseUrl.startsWith('https://')) {
      errors.push('Supabase URL must start with https://');
    }

    if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
      errors.push('Supabase API key is missing or empty');
    } else if (supabaseAnonKey.length < 20) { // Typically Supabase keys are longer
      errors.push('Supabase API key appears to be invalid (too short)');
    }

    if (errors.length > 0) {
      return { success: false, error: errors.join('. '), configError: true };
    }

    // Step 1: Check if we can get a session (basic auth check)
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error("Supabase auth verification failed:", authError.message);
      return { 
        success: false, 
        error: authError.message,
        // If we get an invalid API key error, flag it as a config error
        configError: authError.message.includes('Invalid API key') 
      };
    }

    // Step 2: Attempt to make a simple query to verify the database connection
    const { error: dbError } = await supabase.from('weight_entries').select('count', { count: 'exact', head: true });
    
    if (dbError) {
      // If we get a 404 on the table, the connection might be fine but the table doesn't exist
      const isTableMissing = dbError.message.includes('does not exist');
      
      if (isTableMissing) {
        console.log("Table doesn't exist but connection seems to be working");
        return { success: true, warning: "Table 'weight_entries' doesn't exist, but connection is working" };
      }
      
      console.error("Supabase database verification failed:", dbError.message);
      return { success: false, error: dbError.message };
    }
    
    console.log("Supabase connection verified successfully");
    return { success: true };
  } catch (err) {
    console.error("Supabase connection verification threw an exception:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// File: app/lib/types.ts
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  user_id: string;
  created_at: string;
}

export interface WeightFormData {
  weight: number;
  date: Date;
}
