import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

interface Partner {
  id: number;
  name: string;
  location: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partners`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPartners(data);
      
      if (data.length === 0) {
        setError('No partners found in the leaderboard');
        // Fallback to demo data
        setPartners([
          { id: 1, name: "Community Aid", location: "New York, NY", points: 1250 },
          { id: 2, name: "Green Cycle", location: "Los Angeles, CA", points: 980 },
          { id: 3, name: "Eco Warriors", location: "Chicago, IL", points: 750 },
          { id: 4, name: "Sustainable Future", location: "Houston, TX", points: 620 },
          { id: 5, name: "Recycle Heroes", location: "Phoenix, AZ", points: 450 }
        ]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch partners';
      console.error('Error fetching partners:', error);
      setError(errorMessage);
      
      // Fallback to demo data
      setPartners([
        { id: 1, name: "Community Aid", location: "New York, NY", points: 1250 },
        { id: 2, name: "Green Cycle", location: "Los Angeles, CA", points: 980 },
        { id: 3, name: "Eco Warriors", location: "Chicago, IL", points: 750 },
        { id: 4, name: "Sustainable Future", location: "Houston, TX", points: 620 },
        { id: 5, name: "Recycle Heroes", location: "Phoenix, AZ", points: 450 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPartners();
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
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 2:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      case 3:
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      default:
        return 'bg-white border-gray-200 hover:bg-gray-50';
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
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Ranked by points earned
          </div>
          <button
            onClick={handleRefresh}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Refresh leaderboard"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
          <strong>Warning:</strong> {error} (showing demo data)
        </div>
      )}

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
                  <div className="text-2xl font-bold text-blue-600">{partner.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {partners.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No partners found in the leaderboard.</p>
          <p className="text-sm">Partners will appear here once they start earning points.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;