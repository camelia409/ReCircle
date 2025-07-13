import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TrendData {
  date: string;
  categories: {
    Clothing: number;
    Electronics: number;
    Food: number;
    Furniture: number;
  };
}

const TrendAnalysis: React.FC = () => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation-trends`);
        if (!response.ok) throw new Error('Failed to fetch trend data');
        const data: TrendData[] = await response.json();
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching trend data:', error);
        // Mock data for demo
        const mockData: TrendData[] = [
          { date: '2024-01-01', categories: { Clothing: 25, Electronics: 15, Food: 30, Furniture: 10 } },
          { date: '2024-01-02', categories: { Clothing: 30, Electronics: 20, Food: 35, Furniture: 12 } },
          { date: '2024-01-03', categories: { Clothing: 28, Electronics: 18, Food: 32, Furniture: 15 } },
          { date: '2024-01-04', categories: { Clothing: 35, Electronics: 22, Food: 40, Furniture: 18 } },
          { date: '2024-01-05', categories: { Clothing: 32, Electronics: 25, Food: 38, Furniture: 20 } },
        ];
        setTrendData(mockData);
      }
    };

    fetchTrends();
    const interval = setInterval(fetchTrends, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: trendData.map(item => item.date),
    datasets: [
      {
        label: 'Clothing',
        data: trendData.map(item => item.categories.Clothing),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Electronics',
        data: trendData.map(item => item.categories.Electronics),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Food',
        data: trendData.map(item => item.categories.Food),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Furniture',
        data: trendData.map(item => item.categories.Furniture),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Donation Trends</h2>
      </div>
      {trendData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-64 text-blue-600">
          Loading trend data...
        </div>
      )}
      <div className="mt-4 text-sm text-blue-600">
        <p>Data updates every 15 seconds. Shows donation trends across categories.</p>
      </div>
    </div>
  );
};

export default TrendAnalysis; 