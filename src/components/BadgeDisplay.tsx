import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { toast } from 'react-toastify';

interface Badge {
  name: string;
  description: string;
  earned: boolean;
}

interface Challenge {
  name: string;
  target: number;
  progress: number;
  description?: string;
}

interface BadgeDisplayProps {
  partnerId: number;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ partnerId }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badges/${partnerId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Partner not found');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setBadges(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch badges';
        console.error('Error fetching badges:', err);
        setError(errorMessage);
        
        // Fallback to mock data for demo purposes
        setBadges([
          { name: "Eco Hero", description: "Achieved 100+ points", earned: true },
          { name: "Community Star", description: "Completed 5+ claims", earned: true },
          { name: "Donation Champion", description: "Donated 50+ items", earned: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badges/${partnerId}/challenges`);
        if (response.ok) {
          const data = await response.json();
          setChallenges(data);
        } else {
          // Fallback to mock challenges data
          setChallenges([
            { name: "Claim Champion", target: 10, progress: 5, description: "Claim 10 items this month" },
            { name: "Monthly Donor", target: 5, progress: 3, description: "Donate 5 items this month" },
            { name: "Eco Warrior", target: 1000, progress: 750, description: "Earn 1000 points" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        // Fallback to mock challenges data
        setChallenges([
          { name: "Claim Champion", target: 10, progress: 5, description: "Claim 10 items this month" },
          { name: "Monthly Donor", target: 5, progress: 3, description: "Donate 5 items this month" },
          { name: "Eco Warrior", target: 1000, progress: 750, description: "Earn 1000 points" },
        ]);
      }
    };

    fetchBadges();
    fetchChallenges();
  }, [partnerId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Your Badges</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
          <strong>Warning:</strong> {error} (showing demo data)
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading badges...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
            {badges.map((badge) => (
              <div 
                key={badge.name} 
                className={`flex flex-col items-center rounded-lg p-4 shadow transition-all ${
                  badge.earned 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                <Award className={`h-8 w-8 mb-2 ${badge.earned ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`font-semibold text-center ${badge.earned ? 'text-blue-900' : 'text-gray-600'}`}>
                  {badge.name}
                </span>
                <span className={`text-xs text-center ${badge.earned ? 'text-blue-700' : 'text-gray-500'}`}>
                  {badge.description}
                </span>
                {badge.earned && (
                  <span className="text-xs text-green-600 mt-1 font-medium">✓ Earned</span>
                )}
              </div>
            ))}
            {badges.length === 0 && (
              <div className="text-center w-full py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No badges yet. Start donating and claiming items to earn badges!</p>
              </div>
            )}
          </div>

          {/* Challenges Section */}
          {challenges.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Active Challenges</h3>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.name} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-900">{challenge.name}</span>
                      <span className="text-sm text-yellow-700">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    {challenge.description && (
                      <p className="text-xs text-yellow-600 mb-1">{challenge.description}</p>
                    )}
                    <p className="text-xs text-yellow-600">
                      {challenge.target - challenge.progress} more to complete!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BadgeDisplay; 