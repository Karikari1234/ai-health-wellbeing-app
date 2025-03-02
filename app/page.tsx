"use client";

import { useEffect, useState } from "react";
import { getUser } from "./lib/auth";
import {
  getWeightEntries,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
} from "./lib/db";
import { WeightEntry, WeightFormData } from "./lib/types";
import { supabase } from "./lib/supabase";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import WeightForm from "./components/WeightForm";
import DashboardTabs from "./components/DashboardTabs";
import Stats from "./components/Stats";
import EmptyState from "./components/EmptyState";
import EditEntryModal from "./components/EditEntryModal";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check auth status and load data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);

        if (currentUser) {
          const userEntries = await getWeightEntries(currentUser.id);
          setEntries(userEntries);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up Supabase auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser || null);

        if (currentUser) {
          const userEntries = await getWeightEntries(currentUser.id);
          setEntries(userEntries);
        } else {
          setEntries([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Handle adding new entry
  const handleAddEntry = async (data: WeightFormData) => {
    if (!user) return;

    try {
      const newEntry = await addWeightEntry(data, user.id);
      setEntries([...entries, newEntry]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry. Please try again.");
    }
  };

  // Handle updating entry
  const handleUpdateEntry = async (id: string, data: WeightFormData) => {
    try {
      const updatedEntry = await updateWeightEntry(id, data);
      setEntries(
        entries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry. Please try again.");
    }
  };

  // Handle deleting entry
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteWeightEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Weight Tracker
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to track and monitor your weight over time
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col">
      <Header userEmail={user.email} />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {entries.length > 0 ? (
          <>
            <div className="mb-6">
              <Stats entries={entries} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6">
              <DashboardTabs
                entries={entries}
                onDelete={handleDeleteEntry}
                onEdit={setEntryToEdit}
              />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6">
            <EmptyState />
          </div>
        )}

        {showAddForm ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add Weight Entry</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <WeightForm onSubmit={handleAddEntry} />
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-200"
          >
            <span className="flex items-center justify-center text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Weight Entry
            </span>
          </button>
        )}
      </main>

      {entryToEdit && (
        <EditEntryModal
          entry={entryToEdit}
          onClose={() => setEntryToEdit(null)}
          onSubmit={handleUpdateEntry}
        />
      )}
    </div>
  );
}
