'use client';

import { useState, useEffect } from 'react';
import { WeightEntry } from '../lib/types';
import WeightChart from './WeightChart';
import WeightList from './WeightList';

interface DashboardTabsProps {
  entries: WeightEntry[];
  allEntries?: WeightEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (entry: WeightEntry) => void;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  activeTab?: "chart" | "list";
}

export default function DashboardTabs({ 
  entries, 
  allEntries = [],
  onDelete, 
  onEdit,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  activeTab: initialTab = "chart"
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "list">(initialTab);

  // Load more data when switching to the list tab
  useEffect(() => {
    if (activeTab === "list" && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [activeTab, hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="app-card p-6">
      <div className="flex border-b border-gray-100 mb-6">
        <button
          className={`py-3 px-6 text-base font-medium border-b-2 font-karla ${
            activeTab === "chart"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={`py-3 px-6 text-base font-medium border-b-2 font-karla ${
            activeTab === "list"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab("list")}
        >
          History
        </button>
      </div>

      <div>
        {activeTab === "chart" ? (
          <WeightChart entries={allEntries.length > 0 ? allEntries : entries} />
        ) : (
          <WeightList 
            entries={entries} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
    </div>
  );
}