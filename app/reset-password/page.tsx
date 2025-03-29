"use client";

import { useState, useEffect } from "react";
import { updatePassword } from "../lib/auth";
import { useRouter } from "next/navigation";
import PasswordRequirements from "../components/PasswordRequirements";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have the necessary hash fragment in the URL
    // This confirms the user came from a valid password reset link
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) {
      setError("Invalid or expired password reset link. Please request a new one.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    const validLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!validLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-card text-center">
          <div className="bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 font-merriweather">Password Updated!</h2>
          <p className="mb-3 text-gray-600 font-karla text-sm">
            Your password has been successfully reset.
          </p>
          <p className="text-xs text-gray-500 font-karla">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-merriweather">
            Weight Tracker
          </h1>
          <p className="mt-1 text-gray-600 font-karla text-sm sm:text-base">
            Set a new password for your account
          </p>
        </div>

        <div className="app-card p-5 sm:p-6">
          <h2 className="text-xl font-bold text-center mb-4 font-merriweather">Reset Password</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-primary-500 rounded-lg text-sm font-karla">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1.5 font-karla text-gray-700">
                New Password
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
              <PasswordRequirements password={password} />
            </div>

            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5 font-karla text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-button w-full py-2.5"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
