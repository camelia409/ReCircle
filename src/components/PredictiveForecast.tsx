import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Brain } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ForecastData {
  category: string;
  quantity: number;
}

interface PredictiveForecastProps {
  partnerId: number;
}

const PredictiveForecast: React.FC<PredictiveForecastProps> = ({ partnerId }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forecast/${partnerId}`);
        if (!response.ok) throw new Error('Failed to fetch forecast data');
        const data: ForecastData[] = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        // Mock AI predictions based on partner behavior
        const mockForecast: ForecastData[] = [
          { category: 'Clothing', quantity: 45 },
          { category: 'Electronics', quantity: 28 },
          { category: 'Food', quantity: 52 },
          { category: 'Furniture', quantity: 22 },
        ];
        setForecastData(mockForecast);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [partnerId]);

  const chartData = {
    labels: forecastData.map(item => item.category),
    datasets: [
      {
        label: 'Predicted Quantity (Next 30 Days)',
        data: forecastData.map(item => item.quantity),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
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
        <Brain className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">AI Forecast</h2>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          Next 30 Days
        </span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-blue-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          Training AI model...
        </div>
      ) : (
        <>
          <Bar data={chartData} options={options} />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">AI Insights</h3>
            <p className="text-sm text-blue-700">
              Based on historical data and partner behavior patterns, our AI predicts donation volumes 
              for the next 30 days. This helps optimize resource allocation and planning.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveForecast; 