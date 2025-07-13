import React, { useState } from 'react';
import ItemList from '../components/ItemList';
import ImpactChart from '../components/ImpactChart';
import Leaderboard from '../components/Leaderboard';
import NotificationBanner from '../components/NotificationBanner';
import DonationForm from '../components/DonationForm';
import Heatmap from '../components/Heatmap';
import TrendAnalysis from '../components/TrendAnalysis';
import PredictiveForecast from '../components/PredictiveForecast';
import PartnerInsights from '../components/PartnerInsights';
import Chatbot from '../components/Chatbot';
import ImpactCalculator from '../components/ImpactCalculator';
import BadgeDisplay from '../components/BadgeDisplay';
import KPIDashboard from '../components/KPIDashboard';
import AdminMap from '../components/AdminMap';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Recycle, Settings, ToggleLeft, BarChart3, Map, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false);

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
              {user?.role === 'partner' && (
                <div className="flex items-center space-x-2">
                  <ToggleLeft className="h-4 w-4 text-blue-600" />
                  <label className="text-sm text-gray-700">Demo Mode</label>
                  <input
                    type="checkbox"
                    checked={demoMode}
                    onChange={() => setDemoMode(!demoMode)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {user?.role === 'admin' && (
            <>
              <div className="lg:col-span-2 space-y-8">
                <KPIDashboard />
                <AdminMap />
                <AdminPanel />
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Admin Overview</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Monitor platform performance, manage partners, and track environmental impact.
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      <span>Total Donations: 1,247</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      <span>Waste Diverted: 623.5 kg</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                      <span>Active Partners: 12</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {user?.role === 'partner' && (
            <>
              {/* Donations Section - Made More Prominent */}
              <div className="lg:col-span-3 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Available Donations</h2>
                        <p className="text-blue-100">Browse and claim items from generous donors</p>
                      </div>
                    </div>
                    <div className="text-right text-white">
                      <div className="text-3xl font-bold">1,247</div>
                      <div className="text-blue-100">Total Items</div>
                    </div>
                  </div>
                </div>
                <ItemList partnerId={user.id} />
              </div>
              
              {/* Analytics and Insights */}
              <div className="lg:col-span-2 space-y-8">
                <Heatmap />
                <TrendAnalysis />
                <PredictiveForecast partnerId={user.id} />
                <PartnerInsights partnerId={user.id} />
                <ImpactCalculator partnerId={user.id} />
                <ImpactChart partnerId={user.id} />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-8">
                <Leaderboard />
                <BadgeDisplay partnerId={user.id} />
              </div>
            </>
          )}
          
          {user?.role === 'customer' && (
            <div className="md:col-span-2 lg:col-span-3">
              <DonationForm />
            </div>
          )}
        </div>
      </div>

      {/* Floating Chatbot for all users */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;