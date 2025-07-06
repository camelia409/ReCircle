import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, MapPin } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  location: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partners`);
      if (!response.ok) throw new Error('Failed to fetch partners');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Partner Leaderboard
        </h2>
        <div className="text-sm text-gray-500">
          Ranked by points earned
        </div>
      </div>

      <div className="space-y-3">
        {partners.map((partner, index) => {
          const rank = index + 1;
          return (
            <div
              key={partner.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {partner.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{partner.points}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No partners found in the leaderboard.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;