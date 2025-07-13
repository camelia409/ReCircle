import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

interface PartnerInsight {
  mostClaimed: string;
  impactScore: number;
}

interface PartnerInsightsProps {
  partnerId: number;
}

const PartnerInsights: React.FC<PartnerInsightsProps> = ({ partnerId }) => {
  const [insights, setInsights] = useState<PartnerInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partner-insights/${partnerId}`);
        if (!response.ok) throw new Error('Failed to fetch partner insights');
        const data: PartnerInsight = await response.json();
        setInsights(data);
      } catch (error) {
        console.error('Error fetching partner insights:', error);
        // Mock insights
        setInsights({
          mostClaimed: 'Clothing',
          impactScore: 85,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [partnerId]);

  const getImpactColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getImpactLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Partner Insights</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32 text-blue-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Loading insights...
        </div>
      ) : insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Most Claimed Category</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">{insights.mostClaimed}</p>
            <p className="text-sm text-blue-600 mt-1">
              This category has the highest claim rate for your organization
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Impact Score</h3>
            </div>
            <div className="flex items-center">
              <span className={`text-2xl font-bold px-3 py-1 rounded ${getImpactColor(insights.impactScore)}`}>
                {insights.impactScore}/100
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {getImpactLevel(insights.impactScore)}
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Based on efficiency, speed, and community impact
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No insights available at this time.
        </div>
      )}
    </div>
  );
};

export default PartnerInsights; 