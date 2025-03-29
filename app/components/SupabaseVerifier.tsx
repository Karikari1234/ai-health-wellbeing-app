"use client";

import { useState, useEffect } from "react";
import { supabase, verifySupabaseConnection } from "../lib/supabase";

export default function SupabaseVerifier() {
  // Add a function to manually refresh the connection status
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<{
    checked: boolean;
    success?: boolean;
    error?: string;
    warning?: string;
    configError?: boolean;
    apiKey?: string;
    url?: string;
  }>({
    checked: false,
  });

  const checkConnection = async () => {
    setIsRefreshing(true);
      // Mask API key for security (show first 6 chars and last 4)
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      const maskedKey = apiKey.length > 10 
        ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` 
        : "Not found";

      try {
        const result = await verifySupabaseConnection();
        
        setStatus({
          checked: true,
          success: result.success,
          error: result.error,
          apiKey: maskedKey,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not found",
        });
      } catch (err) {
        setStatus({
          checked: true,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error occurred",
          apiKey: maskedKey,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not found",
        });
      }
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Supabase Connection Status</h2>
        <button
          onClick={checkConnection}
          disabled={!status.checked || isRefreshing}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 flex items-center"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-primary-600 mr-1"></div>
              Checking...
            </>
          ) : (
            'Re-check Connection'
          )}
        </button>
      </div>
      
      {!status.checked ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></div>
          <p>Checking connection...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${status.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="font-medium">
              {status.success ? 
                status.warning ? "Connection successful with warnings" : "Connection successful" 
                : "Connection failed"}
            </p>
          </div>
          
          {status.error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded space-y-2">
              <p><strong>Error:</strong> {status.error}</p>
              
              {status.configError && (
                <div className="pt-2 border-t border-red-200 dark:border-red-800 mt-2">
                  <p className="font-medium mb-1">Possible solutions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly</li>
                    <li>Verify the API key in your Supabase dashboard (Project Settings → API)</li>
                    <li>The key may have been revoked or expired, try generating a new one</li>
                    <li>Restart your development server after updating environment variables</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {status.warning && (
            <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 p-3 rounded mt-3">
              <p><strong>Warning:</strong> {status.warning}</p>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Configuration</h3>
            <div className="text-xs space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Supabase URL:</span>
                <span className="font-mono">{status.url}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">API Key (masked):</span>
                <span className="font-mono">{status.apiKey}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Client initialized:</span>
                <span>{supabase ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
