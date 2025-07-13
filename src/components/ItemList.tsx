import React, { useState, useEffect } from 'react';
import { Package, MapPin, Hash, AlertCircle } from 'lucide-react';
import ClaimButton from './ClaimButton';

interface Item {
  id: number;
  category: string;
  description: string;
  location: string;
  quantity: number;
  status: string;
}

interface ItemListProps {
  partnerId?: number;
}

const ItemList: React.FC<ItemListProps> = ({ partnerId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchLocations();
  }, [categoryFilter, locationFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/api/listings?`;
      if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (locationFilter) url += `location=${encodeURIComponent(locationFilter)}&`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/locations`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const handleClaimSuccess = (itemId: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: 'claimed' } : item
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Clothing': 'bg-purple-100 text-purple-800',
      'Electronics': 'bg-blue-100 text-blue-800',
      'Food': 'bg-green-100 text-green-800',
      'Books': 'bg-yellow-100 text-yellow-800',
      'Toys': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading items...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mr-4">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Donations</h2>
              <p className="text-gray-600">Browse and claim items from generous donors</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{items.length}</div>
            <div className="text-sm text-gray-600">Items Available</div>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-green-600">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Description
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200">
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-base text-gray-900 font-medium">{item.description}</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center text-base text-gray-900">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    {item.location}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center text-base text-gray-900">
                    <Hash className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  {item.status === 'available' && partnerId ? (
                    <ClaimButton 
                      itemId={item.id} 
                      partnerId={partnerId} 
                      onSuccess={handleClaimSuccess}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">
                      {item.status === 'claimed' ? 'Already Claimed' : 'Login to claim'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">
            {categoryFilter || locationFilter 
              ? "Try adjusting your filters to see more items."
              : "There are currently no donations available."
            }
          </p>
          {(categoryFilter || locationFilter) && (
            <button
              onClick={() => {
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemList;