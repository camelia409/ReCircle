import React from 'react';
import ItemList from '../components/ItemList';
import ImpactChart from '../components/ImpactChart';
import Leaderboard from '../components/Leaderboard';
import NotificationBanner from '../components/NotificationBanner';
import DonationForm from '../components/DonationForm';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Recycle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">ReCircle</h1>
              </div>
              <div className="ml-8 text-sm text-gray-600">
                AI-Powered Circular Supply Chain Platform
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
                </div>
              )}
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'partner' && <NotificationBanner partnerId={user.id} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {user?.role === 'partner' && (
            <>
              <div className="lg:col-span-2 space-y-8">
                <ItemList partnerId={user.id} />
                <ImpactChart partnerId={user.id} />
              </div>
              <div>
                <Leaderboard />
              </div>
            </>
          )}
          
          {user?.role === 'customer' && (
            <div className="lg:col-span-3">
              <DonationForm />
            </div>
          )}
          
          {user?.role === 'admin' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
                <p className="text-gray-600">Use the Admin Panel button above to access administrative features.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;