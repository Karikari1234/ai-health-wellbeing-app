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
  ChartDataset,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { WeightEntry } from "../lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
  // Initialize chart data with proper typing
  const [chartData, setChartData] = useState<WeightChartData>({
    labels: [],
    datasets: [
      {
        type: 'line',
        label: "Weight (kg)",
        data: [],
        borderColor: "rgb(255, 107, 107)",
        backgroundColor: "rgba(255, 107, 107, 0.5)",
        tension: 0.5,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(255, 107, 107)",
        pointBorderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    if (!entries.length) return;

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedEntries.map((entry) =>
      format(parseISO(entry.date), "MMM d")
    );

    const weights = sortedEntries.map((entry) => entry.weight);

    setChartData({
      labels,
      datasets: [
        {
          type: 'line',
          label: "Weight (kg)",
          data: weights,
          borderColor: "rgb(255, 107, 107)",
          backgroundColor: "rgba(255, 107, 107, 0.5)",
          tension: 0.5,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointBorderColor: "rgb(255, 107, 107)",
          pointBorderWidth: 2,
        },
      ],
    });
  }, [entries]);

  // Create properly typed options
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
        min: Math.floor(Math.min(...entries.map((e) => e.weight)) - 1),
        max: Math.ceil(Math.max(...entries.map((e) => e.weight)) + 1),
        ticks: {
          precision: 0,
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
        hoverRadius: 8,
      },
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
    <div className="h-64 md:h-80 chart-container">
      <Line options={options} data={chartData as ChartData<'line', number[]>} />
    </div>
  );
}
