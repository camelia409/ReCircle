import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Recycle } from 'lucide-react';

interface ImpactData {
  partner_id: number;
  partner_name: string;
  items_claimed: number;
  waste_diverted_kg: number;
  people_helped: number;
  points: number;
}

interface ImpactChartProps {
  partnerId?: number;
}

const ImpactChart: React.FC<ImpactChartProps> = ({ partnerId }) => {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      fetchImpactData();
    } else {
      setLoading(false);
    }
  }, [partnerId]);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      // Mock data for MVP since backend endpoints may not exist yet
      const mockData = {
        partner_id: partnerId,
        partner_name: partnerId === 1 ? 'Community Aid' : 'Green Cycle',
        items_claimed: partnerId === 1 ? 3 : 2,
        waste_diverted_kg: partnerId === 1 ? 75.5 : 35.0,
        people_helped: partnerId === 1 ? 30 : 20,
        points: partnerId === 1 ? 150 : 100,
      };
      setImpactData(mockData);
    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading impact data...</span>
        </div>
      </div>
    );
  }

  if (!partnerId || !impactData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8 text-gray-500">
          <BarChart3 className="h-8 w-8 mr-2" />
          <span>Login to view your impact metrics</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Your Impact
        </h2>
        <div className="text-sm text-gray-500">
          {impactData.partner_name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Items Claimed</p>
              <p className="text-2xl font-bold text-blue-900">{impactData.items_claimed}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Waste Diverted</p>
              <p className="text-2xl font-bold text-green-900">{impactData.waste_diverted_kg.toFixed(1)} kg</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">People Helped</p>
              <p className="text-2xl font-bold text-purple-900">{impactData.people_helped}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Points Earned</p>
              <p className="text-2xl font-bold text-yellow-900">{impactData.points}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Impact Summary</h3>
        <p className="text-sm text-gray-600">
          You've successfully claimed {impactData.items_claimed} items, helping divert {impactData.waste_diverted_kg.toFixed(1)} kg of waste from landfills 
          and supporting {impactData.people_helped} people in your community. Keep up the great work!
        </p>
      </div>
    </div>
  );
};

export default ImpactChart;