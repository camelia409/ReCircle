import React from 'react';
import DonationForm from '../components/DonationForm';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Recycle, ArrowLeft, Heart, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Donation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl">
                  <Recycle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ReCircle</h1>
                  <p className="text-sm text-gray-600">AI-Powered Circular Supply Chain</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-blue-600">{user.name}</span>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-green-600 mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Difference Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Donate your items to help communities in need and reduce environmental waste. 
            Your generosity creates a positive impact for both people and the planet.
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4 mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247+</h3>
              <p className="text-gray-600">Items Donated</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 mx-auto">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">623.5 kg</h3>
              <p className="text-gray-600">Waste Diverted</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4 mx-auto">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">12</h3>
              <p className="text-gray-600">Partner Organizations</p>
            </div>
          </div>
        </div>

        {/* Donation Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Recycle className="h-6 w-6 mr-3" />
              Donate Your Items
            </h3>
            <p className="text-blue-100 mt-2">
              Fill out the form below to donate your items to partner organizations
            </p>
          </div>
          <div className="p-8">
            <DonationForm />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Your Donation Helps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Submit Donation</h4>
              <p className="text-gray-600">
                Describe your items and provide pickup location details
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Partner Review</h4>
              <p className="text-gray-600">
                Partner organizations review and claim items they need
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h4>
              <p className="text-gray-600">
                Items reach those in need and reduce environmental waste
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;