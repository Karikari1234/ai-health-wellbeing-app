"use client";

import { useState } from "react";
import { signIn, signUp } from "../lib/auth";
import PasswordRequirements from "./PasswordRequirements";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if Supabase connection is working first
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.getSession();
      
      if (error && error.message.includes("Invalid API key")) {
        setError(
          "Cannot connect to authentication service. This may be a configuration issue. " +
          "Please visit /diagnostic to troubleshoot."
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error checking Supabase connection:", err);
    }

    try {
      // For sign up, validate password complexity
      if (isSignUp) {
        const validLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!validLength || !hasUppercase || !hasLowercase || !hasNumber) {
          setError("Please ensure your password meets all requirements");
          setLoading(false);
          return;
        }
      }
      
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const goToDiagnostic = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/diagnostic';
  };

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, "", true);
      if (error) {
        setError(error.message);
      } else {
        setResetEmailSent(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Password reset success view
  if (resetEmailSent) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto text-primary-600 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2 font-merriweather">Check your email</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            We&apos;ve sent password reset instructions to {email}
          </p>
          <button
            onClick={() => {
              setIsForgotPassword(false);
              setResetEmailSent(false);
            }}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // Forgot password view
  if (isForgotPassword) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 font-merriweather">Reset Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 font-karla">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 font-karla"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsForgotPassword(false)}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // Sign in / Sign up view
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 font-merriweather">
        {isSignUp ? "Create Account" : "Sign In"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
          {error.includes("configuration") && (
            <div className="mt-2">
              <button 
                onClick={goToDiagnostic}
                className="underline font-medium"
              >
                Run diagnostic
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 font-karla">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1 font-karla">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {isSignUp && <PasswordRequirements password={password} />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 font-karla"
        >
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary-600 hover:text-primary-700 text-sm block w-full"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
        
        {!isSignUp && (
          <button
            onClick={() => setIsForgotPassword(true)}
            className="text-primary-600 hover:text-primary-700 text-sm block w-full"
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}
