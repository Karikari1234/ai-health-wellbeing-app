"use client";

import { useEffect, useState } from "react";
import { WeightEntry, WeightFormData, SupabaseUser } from "./lib/types";
import { supabase } from "./lib/supabase";
import { getUser } from "./lib/auth";
import { format } from "date-fns";
import {
  getWeightEntries,
  getPaginatedWeightEntries,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
} from "./lib/db";

// Components
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import DashboardTabs from "./components/DashboardTabs";
import Stats from "./components/Stats";
import EmptyState from "./components/EmptyState";
import InstallPrompt from "./components/InstallPrompt";
import { WeightDrawer } from "./components/WeightDrawer";
import FloatingActionButton from "./components/FloatingActionButton";

// Component prop interfaces
interface LoadingScreenProps {
  onForceSignOut: () => Promise<void>;
}

interface DataScreenProps {
  user: SupabaseUser;
}

interface DataRetryScreenProps extends DataScreenProps {
  onRetryLoadData: () => Promise<void>;
}

interface DashboardProps extends DataScreenProps {
  entries: WeightEntry[];
  allEntries: WeightEntry[];
  totalEntryCount: number;
  isLoadingMore: boolean;
  onAddEntry: (data: WeightFormData) => Promise<void>;
  onUpdateEntry: (data: WeightFormData) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onEditEntry: (entry: WeightEntry) => void;
  onLoadMoreEntries: () => Promise<void>;
  showAddDrawer: boolean;
  setShowAddDrawer: (show: boolean) => void;
  showEditDrawer: boolean;
  setShowEditDrawer: (show: boolean) => void;
  entryToEdit: WeightEntry | null;
}

// Component for loading state
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onForceSignOut }) => (
  <div className="flex items-center justify-center min-h-screen bg-appBg">
    <div className="app-card p-8 w-full max-w-md flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-gray-600 font-karla mb-4">Loading your data...</p>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Taking too long? Try signing out completely.
        </p>
        <button 
          onClick={onForceSignOut}
          className="text-primary-500 text-sm hover:text-primary-600 font-medium"
        >
          Force Sign Out
        </button>
      </div>
    </div>
  </div>
);

// Component for login screen
const LoginScreen: React.FC = () => (
  <div className="bg-appBg min-h-screen flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-merriweather">
          Weight Tracker
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Sign in to track and monitor your weight over time
        </p>
      </div>

      <div className="app-card p-5 sm:p-6">
        <AuthForm />
      </div>
    </div>
  </div>
);

// Component for data loading screen
const DataLoadingScreen: React.FC<DataScreenProps> = ({ user }) => (
  <div className="min-h-screen flex flex-col">
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
      <Header userEmail={user.email || ""} />
      
      <main className="flex-grow">
        <div className="app-card p-6 mb-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-4 mx-auto"></div>
            <p className="text-gray-700">Loading your weight data...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Component for data retry screen
const DataRetryScreen: React.FC<DataRetryScreenProps> = ({ user, onRetryLoadData }) => (
  <div className="min-h-screen flex flex-col">
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
      <Header userEmail={user.email || ""} />
      
      <main className="flex-grow">
        <div className="app-card p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-700 mb-4">We couldn&apos;t load your data. Please try again.</p>
            <button 
              onClick={onRetryLoadData}
              className="app-button"
            >
              Retry Loading Data
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Main dashboard component
const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  entries,
  allEntries,
  totalEntryCount,
  isLoadingMore,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onEditEntry,
  onLoadMoreEntries,
  showAddDrawer,
  setShowAddDrawer,
  showEditDrawer,
  setShowEditDrawer,
  entryToEdit
}) => (
  <div className="min-h-screen flex flex-col">
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
      <Header userEmail={user.email || ""} />

      <main className="flex-grow">
        {(entries.length > 0 || allEntries.length > 0) ? (
          <>
            <Stats entries={allEntries} />
            <DashboardTabs
              entries={entries}
              allEntries={allEntries} 
              onDelete={onDeleteEntry}
              onEdit={onEditEntry}
              onLoadMore={onLoadMoreEntries}
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
        
        <FloatingActionButton 
          onClick={() => setShowAddDrawer(true)} 
          ariaLabel="Add weight entry" 
        />

        {showAddDrawer && (
          <WeightDrawer 
            onSubmit={onAddEntry}
            entries={allEntries}
            open={showAddDrawer}
            setOpen={setShowAddDrawer}
          />
        )}
        
        {entryToEdit && showEditDrawer && (
          <WeightDrawer
            onSubmit={onUpdateEntry}
            entries={allEntries.filter(entry => entry.id !== entryToEdit.id)}
            initialData={{
              weight: entryToEdit.weight,
              date: new Date(entryToEdit.date)
            }}
            isEdit={true}
            open={showEditDrawer}
            setOpen={setShowEditDrawer}
          />
        )}
      </main>
    </div>

    {user && <InstallPrompt />}
  </div>
);

export default function Home() {
  // Authentication state
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Weight entries state
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [allEntries, setAllEntries] = useState<WeightEntry[]>([]);
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  // UI state
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  
  // Pagination state
  const [totalEntryCount, setTotalEntryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ENTRIES_PER_PAGE = 10;

  // Function to load user data
  const loadUserData = async (userId: string) => {
    console.log("Loading user data for:", userId);
    setDataLoading(true);
    
    // Add safety timeout to prevent infinite loading state
    const dataLoadingTimeout = setTimeout(() => {
      console.log("Data loading safety timeout reached after 5 seconds");
      setDataLoading(false);
    }, 5000);
    
    try {
      // Load first page of entries with pagination for the list view
      const { entries: firstPageEntries, totalCount } =
        await getPaginatedWeightEntries(userId, 1, ENTRIES_PER_PAGE, "desc");

      setEntries(firstPageEntries);
      setTotalEntryCount(totalCount);
      setCurrentPage(1);

      // For charts and stats, we need all entries but keep them separate
      const completeEntries = await getWeightEntries(userId);
      setAllEntries(completeEntries);

      console.log(
        `Loaded ${firstPageEntries.length} paginated entries and ${completeEntries.length} total entries`
      );
      return { success: true, entriesCount: completeEntries.length };
    } catch (error) {
      console.error("Error fetching entries:", error);
      return { success: false, error };
    } finally {
      clearTimeout(dataLoadingTimeout);
      setDataLoading(false);
    }
  };

  // Function to handle "Retry Loading Data" button
  const handleRetryLoadData = async () => {
    if (!user) return;
    
    setDataLoading(true);
    
    // First, try to refresh the session/auth state
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error("Session refresh failed:", error);
        // Force sign out since the session is invalid
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
        return;
      }
      
      // If we have a valid session, update user state and load data
      const currentUser = data.session.user as SupabaseUser;
      setUser(currentUser);
      
      // Now load the data with the refreshed session
      await loadUserData(currentUser.id);
    } catch (e) {
      console.error("Error during retry:", e);
      setDataLoading(false);
    }
  };

  // Function to force sign out
  const handleForceSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (e) {
      console.error("Error during force sign out:", e);
      window.location.reload();
    }
  };
  
  // Set up auth listener
  useEffect(() => {
    console.log("Setting up auth listener");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        const currentUser = session?.user as SupabaseUser | undefined;
        
        // Only proceed if this is an actual state change
        if ((currentUser && !user) || (!currentUser && user) || 
            (currentUser && user && currentUser.id !== user.id)) {
          console.log("User state updated:", currentUser?.id);
          setUser(currentUser || null);
          
          if (currentUser) {
            // Mark that we're processing an auth state change
            setAuthInitialized(true);
            await loadUserData(currentUser.id);
          } else {
            setEntries([]);
            setAllEntries([]);
            setTotalEntryCount(0);
          }
          
          setLoading(false);
        }
      }
    );

    return () => {
      console.log("Cleaning up auth listener");
      authListener?.subscription.unsubscribe();
    };
  }, [user]);

  // Initial auth check and data loading
  useEffect(() => {
    // Clear any stuck state in localStorage on page reload
    if (typeof window !== 'undefined') {
      const wasReloaded = performance.navigation && 
                          performance.navigation.type === 1;
      if (wasReloaded) {
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
        localStorage.setItem('sb-checking', 'true');
        
        console.log("Checking for existing user session");
        const currentUser = await getUser() as SupabaseUser | null;
        
        // If user already set by auth listener, skip
        if (authInitialized) {
          console.log("Auth already initialized by listener, skipping");
          setLoading(false);
          return;
        }
        
        console.log("Initial auth check user:", currentUser ? currentUser.id : "no user");
        setUser(currentUser);

        if (currentUser) {
          const result = await loadUserData(currentUser.id);
          console.log("Initial data load result:", result);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        localStorage.removeItem('sb-checking');
        setLoading(false);
      }
    };

    // Safety timeout to ensure loading state clears
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout reached, forcing loading state to false");
      setLoading(false);
    }, 5000);

    checkAuth();

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [authInitialized]);

  // Function to load more entries (for infinite scrolling)
  const loadMoreEntries = async () => {
    if (!user || isLoadingMore) return;
    
    // Check if we've already loaded all entries
    if (entries.length >= totalEntryCount) {
      console.log('All entries loaded, nothing more to fetch');
      return;
    }
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      console.log(`Loading page ${nextPage}, current entries: ${entries.length}, total: ${totalEntryCount}`);
      
      const { entries: newEntries, totalCount } = await getPaginatedWeightEntries(
        user.id,
        nextPage,
        ENTRIES_PER_PAGE,
        'desc'
      );
      
      // Update total count in case it changed
      setTotalEntryCount(totalCount);
      
      // If no new entries returned, we're done
      if (newEntries.length === 0) {
        console.log('No new entries returned');
        return;
      }
      
      // Append new entries without duplicates
      const newEntryIds = new Set(newEntries.map(entry => entry.id));
      const existingEntries = entries.filter(entry => !newEntryIds.has(entry.id));
      
      const updatedEntries = [...existingEntries, ...newEntries];
      setEntries(updatedEntries);
      setCurrentPage(nextPage);
      
      console.log(`Updated entries count: ${updatedEntries.length}, still has more: ${updatedEntries.length < totalCount}`);
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
      const formattedDate = format(data.date, "yyyy-MM-dd");
      
      // Check if there's already an entry with this date
      const existingEntryIndex = entries.findIndex(
        entry => entry.date === formattedDate
      );
      
      const existingAllEntriesIndex = allEntries.findIndex(
        entry => entry.date === formattedDate
      );
      
      // Call the API which will handle creating or updating as needed
      const resultEntry = await addWeightEntry(data, user.id);
      
      // Update the UI based on whether it's a new entry or an update
      if (existingEntryIndex >= 0) {
        // This is an update to an existing entry in the paginated entries
        setEntries(prevEntries => 
          prevEntries.map((entry) => (
            entry.date === formattedDate ? resultEntry : entry
          ))
        );
      } else {
        // This is a new entry for the paginated entries
        setEntries(prevEntries => [resultEntry, ...prevEntries]);
        setTotalEntryCount(prevCount => prevCount + 1);
      }
      
      // Similarly update the allEntries state
      if (existingAllEntriesIndex >= 0) {
        setAllEntries(prevEntries => 
          prevEntries.map((entry) => (
            entry.date === formattedDate ? resultEntry : entry
          ))
        );
      } else {
        setAllEntries(prevEntries => [...prevEntries, resultEntry]);
      }
    } catch (error) {
      console.error("Error adding/updating entry:", error);
      alert("Failed to save entry. Please try again.");
    }
  };

  // Handle updating entry
  const handleUpdateEntry = async (data: WeightFormData) => {
    if (!entryToEdit || !user) return;
    
    try {
      const updatedEntry = await updateWeightEntry(entryToEdit.id, data);
      // Update both states
      setEntries(prevEntries => 
        prevEntries.map((entry) => (entry.id === entryToEdit.id ? updatedEntry : entry))
      );
      setAllEntries(prevEntries => 
        prevEntries.map((entry) => (entry.id === entryToEdit.id ? updatedEntry : entry))
      );
      
      // Clear the edit state
      setEntryToEdit(null);
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

  // Handle setting entry to edit and show edit drawer
  const handleEditEntry = (entry: WeightEntry) => {
    setEntryToEdit(entry);
    setShowEditDrawer(true);
  };

  // Determine which component to render based on application state
  if (loading) {
    return <LoadingScreen onForceSignOut={handleForceSignOut} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Data loading check - show a retry button if we have a user but no data
  const isDataEmpty = user && entries.length === 0 && allEntries.length === 0;
  
  if (isDataEmpty && dataLoading) {
    return <DataLoadingScreen user={user} />;
  }
  
  if (isDataEmpty && !dataLoading) {
    return <DataRetryScreen user={user} onRetryLoadData={handleRetryLoadData} />;
  }

  // Main dashboard view when data is loaded
  return (
    <Dashboard
      user={user}
      entries={entries}
      allEntries={allEntries}
      totalEntryCount={totalEntryCount}
      isLoadingMore={isLoadingMore}
      onAddEntry={handleAddEntry}
      onUpdateEntry={handleUpdateEntry}
      onDeleteEntry={handleDeleteEntry}
      onEditEntry={handleEditEntry}
      onLoadMoreEntries={loadMoreEntries}
      showAddDrawer={showAddDrawer}
      setShowAddDrawer={setShowAddDrawer}
      showEditDrawer={showEditDrawer}
      setShowEditDrawer={setShowEditDrawer}
      entryToEdit={entryToEdit}
    />
  );
}
