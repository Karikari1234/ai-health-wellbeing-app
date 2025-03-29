"use client";

import { useState } from "react";
import SupabaseVerifier from "../components/SupabaseVerifier";
import Link from "next/link";

export default function DiagnosticPage() {
  const [showRawEnv, setShowRawEnv] = useState(false);
  
  // This will only show env vars that start with NEXT_PUBLIC_
  // as those are the only ones accessible to client-side code
  const getPublicEnvVars = () => {
    const envVars: Record<string, string> = {};
    
    for (const key in process.env) {
      if (key.startsWith("NEXT_PUBLIC_")) {
        const value = process.env[key] || "";
        
        // Mask sensitive values like API keys
        if (key.includes("KEY") || key.includes("SECRET")) {
          const maskedValue = value.length > 10 
            ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}` 
            : value;
          
          envVars[key] = maskedValue;
        } else {
          envVars[key] = value;
        }
      }
    }
    
    return envVars;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Supabase Diagnostic
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Return to App
          </Link>
        </div>

        <div className="space-y-6">
          <SupabaseVerifier />

          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Environment Variables</h2>
              <button
                onClick={() => setShowRawEnv(!showRawEnv)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {showRawEnv ? "Hide" : "Show"}
              </button>
            </div>

            {showRawEnv && (
              <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-md overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(getPublicEnvVars(), null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Common issues with Supabase connection:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Missing or incorrect environment variables</li>
                <li>API key has been revoked or expired</li>
                <li>Your Supabase project is paused or has been deleted</li>
                <li>Rate limiting or network connectivity issues</li>
                <li>Billing issues with your Supabase account</li>
              </ul>
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-md">
              <p>
                <strong>Tip:</strong> If your environment variables are correct
                but you still can&apos;t connect, try to restart your
                development server with{" "}
                <code className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">
                  npm run dev
                </code>{" "}
                or create a new
                <code className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">
                  .env.local
                </code>{" "}
                file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
