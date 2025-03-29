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
      <div className="text-center">
        <div className="bg-primary-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-primary-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 font-merriweather">Check your email</h2>
        <p className="mb-5 text-gray-600 font-karla text-sm">
          We&apos;ve sent password reset instructions to {email}
        </p>
        <button
          onClick={() => {
            setIsForgotPassword(false);
            setResetEmailSent(false);
          }}
          className="text-primary-500 hover:text-primary-600 font-medium text-sm"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  // Forgot password view
  if (isForgotPassword) {
    return (
      <div>
        <h2 className="text-xl font-bold text-center mb-4 font-merriweather">Reset Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-primary-500 rounded-lg text-sm font-karla">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1.5 font-karla text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="app-button w-full py-2.5"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsForgotPassword(false)}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // Sign in / Sign up view
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-4 font-merriweather">
        {isSignUp ? "Create Account" : "Sign In"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-primary-500 rounded-lg text-sm font-karla">
          {error}
          {error.includes("configuration") && (
            <div className="mt-1.5">
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
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 font-karla text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium mb-1.5 font-karla text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
          {isSignUp && <PasswordRequirements password={password} />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="app-button w-full py-2.5"
        >
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary-500 hover:text-primary-600 text-sm block w-full font-medium"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
        
        {!isSignUp && (
          <button
            onClick={() => setIsForgotPassword(true)}
            className="text-primary-500 hover:text-primary-600 text-sm block w-full font-medium"
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}
