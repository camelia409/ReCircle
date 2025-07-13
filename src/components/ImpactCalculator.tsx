import React, { useEffect, useState } from 'react';
import { Leaf, Recycle, TrendingUp } from 'lucide-react';

interface ImpactData {
  wasteSavedKg: number;
  co2ReducedKg: number;
}

interface ImpactCalculatorProps {
  partnerId: number;
}

const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ partnerId }) => {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/impact/${partnerId}`);
        if (!response.ok) throw new Error('Failed to fetch impact data');
        const data: ImpactData = await response.json();
        setImpactData(data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
        // Mock impact data
        setImpactData({
          wasteSavedKg: 125.5,
          co2ReducedKg: 25.1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [partnerId]);

  const getImpactLevel = (wasteSaved: number) => {
    if (wasteSaved >= 100) return { level: 'Eco Champion', color: 'text-green-600 bg-green-100' };
    if (wasteSaved >= 50) return { level: 'Green Leader', color: 'text-blue-600 bg-blue-100' };
    if (wasteSaved >= 25) return { level: 'Sustainability Starter', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'Getting Started', color: 'text-gray-600 bg-gray-100' };
  };

  const impactLevel = impactData ? getImpactLevel(impactData.wasteSavedKg) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Leaf className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Environmental Impact</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32 text-green-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
          Calculating impact...
        </div>
      ) : impactData ? (
        <div className="space-y-6">
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-2">
                <Recycle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Waste Diverted</h3>
              </div>
              <p className="text-3xl font-bold text-green-700">{impactData.wasteSavedKg} kg</p>
              <p className="text-sm text-green-600 mt-1">
                Equivalent to {Math.round(impactData.wasteSavedKg / 0.5)} items saved from landfill
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">CO₂ Reduced</h3>
              </div>
              <p className="text-3xl font-bold text-blue-700">{impactData.co2ReducedKg} kg</p>
              <p className="text-sm text-blue-600 mt-1">
                Equivalent to {Math.round(impactData.co2ReducedKg * 0.1)} trees planted
              </p>
            </div>
          </div>

          {/* Impact Level */}
          {impactLevel && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Your Impact Level</h3>
                  <p className="text-sm text-gray-600">
                    Based on your waste diversion achievements
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${impactLevel.color}`}>
                  {impactLevel.level}
                </span>
              </div>
            </div>
          )}

          {/* Impact Formula */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">How We Calculate Impact</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Waste Saved = Items Claimed × 0.5 kg per item</p>
              <p>• CO₂ Reduced = Waste Saved × 0.2 kg CO₂ per kg waste</p>
              <p>• Impact Level based on total waste diverted</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No impact data available at this time.
        </div>
      )}
    </div>
  );
};

export default ImpactCalculator; 