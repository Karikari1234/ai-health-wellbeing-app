'use client';

import { useState } from 'react';
import { WeightEntry } from '../lib/types';
import WeightChart from './WeightChart';
import WeightList from './WeightList';

interface DashboardTabsProps {
  entries: WeightEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (entry: WeightEntry) => void;
}

export default function DashboardTabs({ entries, onDelete, onEdit }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "list">("chart");

  return (
    <div>
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-4 text-sm font-medium border-b-2 font-merriweather ${
            activeTab === "chart"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium border-b-2 font-merriweather ${
            activeTab === "list"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("list")}
        >
          History
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "chart" ? (
          <WeightChart entries={entries} />
        ) : (
          <WeightList entries={entries} onDelete={onDelete} onEdit={onEdit} />
        )}
      </div>
    </div>
  );
}