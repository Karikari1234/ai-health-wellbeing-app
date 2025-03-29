"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ChartDataset,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO, subMonths, isAfter } from "date-fns";
import { WeightEntry } from "../lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define a proper type for our dataset
type WeightDataset = ChartDataset<'line', number[]> & {
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
};

// Define the chart data type
type WeightChartData = ChartData<'line', number[], string> & {
  datasets: WeightDataset[];
};

interface WeightChartProps {
  entries: WeightEntry[];
}

export default function WeightChart({ entries }: WeightChartProps) {
  // State for chart data
  const [chartData, setChartData] = useState<WeightChartData>({
    labels: [],
    datasets: [
      {
        type: 'line',
        label: "Weight (kg)",
        data: [],
        borderColor: "rgb(255, 107, 107)",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(255, 107, 107)",
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  });
  
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState<'1m' | '3m' | '6m' | 'all'>('3m');

  useEffect(() => {
    if (!entries.length) return;

    // Sort entries by date (oldest to newest)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter entries based on selected time period
    let filteredEntries = sortedEntries;
    const now = new Date();
    
    if (timePeriod === '1m') {
      const oneMonthAgo = subMonths(now, 1);
      filteredEntries = sortedEntries.filter(entry => 
        isAfter(new Date(entry.date), oneMonthAgo)
      );
    } else if (timePeriod === '3m') {
      const threeMonthsAgo = subMonths(now, 3);
      filteredEntries = sortedEntries.filter(entry => 
        isAfter(new Date(entry.date), threeMonthsAgo)
      );
    } else if (timePeriod === '6m') {
      const sixMonthsAgo = subMonths(now, 6);
      filteredEntries = sortedEntries.filter(entry => 
        isAfter(new Date(entry.date), sixMonthsAgo)
      );
    }

    // Ensure we have at least 2 entries for the chart to look good
    if (filteredEntries.length < 2 && sortedEntries.length >= 2) {
      filteredEntries = sortedEntries.slice(-Math.min(sortedEntries.length, 10));
    }

    // Handle data point density to avoid overcrowding
    let displayEntries = filteredEntries;
    if (filteredEntries.length > 30) {
      // For large datasets, sample the data to reduce density
      const sampleInterval = Math.ceil(filteredEntries.length / 30);
      displayEntries = filteredEntries.filter((_, index) => 
        index % sampleInterval === 0 || index === filteredEntries.length - 1
      );
    }

    const labels = displayEntries.map((entry) =>
      format(parseISO(entry.date), "MMM d")
    );

    const weights = displayEntries.map((entry) => entry.weight);

    setChartData({
      labels,
      datasets: [
        {
          type: 'line',
          label: "Weight (kg)",
          data: weights,
          borderColor: "rgb(255, 107, 107)",
          backgroundColor: "rgba(255, 107, 107, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: displayEntries.length > 20 ? 2 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointBorderColor: "rgb(255, 107, 107)",
          pointBorderWidth: 2,
          fill: true,
        },
      ],
    });
  }, [entries, timePeriod]);

  // Calculate dynamic Y axis range for better visualization
  const getYAxisRange = () => {
    if (!entries.length) return { min: 0, max: 100 };
    
    const weights = entries.map(e => e.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min;
    
    // Set padding based on range to avoid extreme scaling
    const padding = Math.max(range * 0.1, 1);
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    };
  };

  const yAxisRange = getYAxisRange();

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgb(255, 107, 107)",
        titleFont: {
          size: 14,
          family: "'Karla', sans-serif",
        },
        bodyFont: {
          size: 14,
          family: "'Karla', sans-serif",
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toFixed(1)} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          precision: 1,
          font: {
            family: "'Karla', sans-serif"
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          font: {
            family: "'Karla', sans-serif"
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      }
    },
  };

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-gray-200 rounded-xl bg-gray-50">
        <p className="text-gray-500">No data to display</p>
        <p className="text-sm text-gray-400">
          Add weight entries to see your progress
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button 
            type="button" 
            onClick={() => setTimePeriod('1m')}
            className={`px-3 py-1 text-xs font-medium ${
              timePeriod === '1m'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            } rounded-l-lg border border-gray-200`}
          >
            1M
          </button>
          <button 
            type="button" 
            onClick={() => setTimePeriod('3m')}
            className={`px-3 py-1 text-xs font-medium ${
              timePeriod === '3m'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
          >
            3M
          </button>
          <button 
            type="button" 
            onClick={() => setTimePeriod('6m')}
            className={`px-3 py-1 text-xs font-medium ${
              timePeriod === '6m'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
          >
            6M
          </button>
          <button 
            type="button" 
            onClick={() => setTimePeriod('all')}
            className={`px-3 py-1 text-xs font-medium ${
              timePeriod === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            } rounded-r-lg border border-gray-200`}
          >
            All
          </button>
        </div>
      </div>
      <div className="h-64 md:h-80 chart-container">
        <Line options={options} data={chartData as ChartData<'line', number[]>} />
      </div>
      {entries.length > 30 && timePeriod === 'all' && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Showing {chartData.labels?.length || 0} of {entries.length} data points
        </p>
      )}
    </div>
  );
}
