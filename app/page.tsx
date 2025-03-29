"use client";

import { useEffect, useState } from "react";
import { getUser } from "./lib/auth";
import {
  getWeightEntries,
  getPaginatedWeightEntries,
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
import InstallPrompt from "./components/InstallPrompt";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [allEntries, setAllEntries] = useState<WeightEntry[]>([]);
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Pagination state
  const [totalEntryCount, setTotalEntryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ENTRIES_PER_PAGE = 10;

  // Check auth status and load data
  useEffect(() => {
    // Immediately clear any stuck state in localStorage
    if (typeof window !== 'undefined') {
      // This checks if the page was reloaded and the loading state might be stuck
      const wasReloaded = performance.navigation && 
                          performance.navigation.type === 1;
      if (wasReloaded) {
        // Clear any potentially problematic storage items
        try {
          console.log("Page was reloaded, cleaning potential stuck state");
          localStorage.removeItem('sb-stuck');
        } catch (e) {
          console.warn("Error clearing localStorage:", e);
        }
      }
    }

    const checkAuth = async () => {
      try {
        // Set a flag that we're checking auth (helps with debugging)
        localStorage.setItem('sb-checking', 'true');
        
        const currentUser = await getUser();
        setUser(currentUser);

        if (currentUser) {
          try {
            // Load first page of entries with pagination for the list view
            const { entries: firstPageEntries, totalCount } = await getPaginatedWeightEntries(
              currentUser.id,
              1,
              ENTRIES_PER_PAGE,
              'desc'
            );
            
            setEntries(firstPageEntries);
            setTotalEntryCount(totalCount);
            setCurrentPage(1);
            
            // For charts and stats, we need all entries but keep them separate
            // This happens asynchronously in the background
            const completeEntries = await getWeightEntries(currentUser.id);
            setAllEntries(completeEntries);
            
          } catch (error) {
            console.error("Error fetching entries:", error);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        // Clean up our debugging flag
        localStorage.removeItem('sb-checking');
        setLoading(false);
      }
    };

    // This is critical: we need to guarantee the loading state clears
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    checkAuth();

    // Set up Supabase auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        const currentUser = session?.user;
        setUser(currentUser || null);

        if (currentUser) {
          try {
            // Load first page of entries with pagination
            const { entries: firstPageEntries, totalCount } = await getPaginatedWeightEntries(
              currentUser.id,
              1,
              ENTRIES_PER_PAGE,
              'desc'
            );
            
            setEntries(firstPageEntries);
            setTotalEntryCount(totalCount);
            setCurrentPage(1);
            
            // For charts and stats, we need all entries separately
            const completeEntries = await getWeightEntries(currentUser.id);
            setAllEntries(completeEntries);
          } catch (error) {
            console.error("Error fetching entries:", error);
          }
        } else {
          setEntries([]);
          setAllEntries([]);
          setTotalEntryCount(0);
        }
        
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to load more entries (for infinite scrolling)
  const loadMoreEntries = async () => {
    if (!user || isLoadingMore || entries.length >= totalEntryCount) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const { entries: newEntries } = await getPaginatedWeightEntries(
        user.id,
        nextPage,
        ENTRIES_PER_PAGE,
        'desc'
      );
      
      // Append new entries without duplicates
      const newEntryIds = new Set(newEntries.map(entry => entry.id));
      const existingEntries = entries.filter(entry => !newEntryIds.has(entry.id));
      
      setEntries([...existingEntries, ...newEntries]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more entries:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle adding new entry
  const handleAddEntry = async (data: WeightFormData) => {
    if (!user) return;

    try {
      const newEntry = await addWeightEntry(data, user.id);
      // Update both states
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      setAllEntries(prevEntries => [...prevEntries, newEntry]);
      setTotalEntryCount(prevCount => prevCount + 1);
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
      // Update both states
      setEntries(prevEntries => 
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
      setAllEntries(prevEntries => 
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
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
      // Update both states
      setEntries(prevEntries => 
        prevEntries.filter((entry) => entry.id !== id)
      );
      setAllEntries(prevEntries => 
        prevEntries.filter((entry) => entry.id !== id)
      );
      setTotalEntryCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  if (loading) {
    // Force sign out function
    const handleForceSignOut = async () => {
      // Clear everything
      try {
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        // Force reload the page
        window.location.href = "/";
      } catch (e) {
        console.error("Error during force sign out:", e);
        // If even that fails, just reload
        window.location.reload();
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-appBg">
        <div className="app-card p-8 w-full max-w-md flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 font-karla mb-4">Loading your data...</p>
          
          {/* Only show this after 5 seconds of loading */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Taking too long? Try signing out completely.
            </p>
            <button 
              onClick={handleForceSignOut}
              className="text-primary-500 text-sm hover:text-primary-600 font-medium"
            >
              Force Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-appBg min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full app-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-merriweather">
              Weight Tracker
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to track and monitor your weight over time
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        <Header userEmail={user.email} />

        <main className="flex-grow">
          {(entries.length > 0 || allEntries.length > 0) ? (
            <>
              {/* Always use all entries for stats to show accurate data */}
              <Stats entries={allEntries} />
              <DashboardTabs
                entries={entries}
                allEntries={allEntries} 
                onDelete={handleDeleteEntry}
                onEdit={setEntryToEdit}
                onLoadMore={loadMoreEntries}
                hasMore={entries.length < totalEntryCount}
                isLoadingMore={isLoadingMore}
                activeTab="chart" 
              />
            </>
          ) : (
            <div className="app-card p-6 mb-6">
              <EmptyState />
            </div>
          )}

          {showAddForm ? (
            <div className="app-card p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium font-karla">Add Weight Entry</h2>
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
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="app-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
              </button>
            </div>
          )}
        </main>
      </div>

      {entryToEdit && (
        <EditEntryModal
          entry={entryToEdit}
          onClose={() => setEntryToEdit(null)}
          onSubmit={handleUpdateEntry}
        />
      )}

      {user && <InstallPrompt />}
    </div>
  );
}
