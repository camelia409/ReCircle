import React, { useState } from 'react';
import { Package, MapPin, Hash, FileText, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

const DonationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    category: 'Clothing',
    description: '',
    location: '',
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<string>('');

  const categories = ['Clothing', 'Electronics', 'Food', 'Furniture'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Input validation
    if (!formData.category) {
      toast.error('Category is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      setLoading(false);
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'customer',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 400) {
          toast.error(`Validation error: ${errorMessage}`);
          setError(errorMessage);
        } else {
          toast.error(`Failed to submit donation: ${errorMessage}`);
          setError(errorMessage);
        }
        return;
      }
      
      const result = await response.json();
      toast.success(result.message || 'Donation submitted successfully!');
      setSuccess(true);
      setFormData({
        category: 'Clothing',
        description: '',
        location: '',
        quantity: 1,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      toast.error(`Failed to submit donation: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };

  const categorizeDescription = async (description: string) => {
    if (!description.trim()) {
      setSuggestedCategory('');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categorize-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedCategory(data.suggestedCategory);
      } else if (response.status === 400) {
        // Handle 400 error gracefully with fallback
        console.warn('Categorization API returned 400, using fallback logic');
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('shirt') || lowerDesc.includes('pants') || lowerDesc.includes('dress') || lowerDesc.includes('jacket')) {
          setSuggestedCategory('Clothing');
        } else if (lowerDesc.includes('phone') || lowerDesc.includes('laptop') || lowerDesc.includes('computer') || lowerDesc.includes('tv')) {
          setSuggestedCategory('Electronics');
        } else if (lowerDesc.includes('can') || lowerDesc.includes('food') || lowerDesc.includes('rice') || lowerDesc.includes('beans')) {
          setSuggestedCategory('Food');
        } else if (lowerDesc.includes('chair') || lowerDesc.includes('table') || lowerDesc.includes('sofa') || lowerDesc.includes('bed')) {
          setSuggestedCategory('Furniture');
        } else {
          setSuggestedCategory('');
        }
      } else {
        // Fallback to keyword matching for other errors
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('shirt') || lowerDesc.includes('pants') || lowerDesc.includes('dress') || lowerDesc.includes('jacket')) {
          setSuggestedCategory('Clothing');
        } else if (lowerDesc.includes('phone') || lowerDesc.includes('laptop') || lowerDesc.includes('computer') || lowerDesc.includes('tv')) {
          setSuggestedCategory('Electronics');
        } else if (lowerDesc.includes('can') || lowerDesc.includes('food') || lowerDesc.includes('rice') || lowerDesc.includes('beans')) {
          setSuggestedCategory('Food');
        } else if (lowerDesc.includes('chair') || lowerDesc.includes('table') || lowerDesc.includes('sofa') || lowerDesc.includes('bed')) {
          setSuggestedCategory('Furniture');
        } else {
          setSuggestedCategory('');
        }
      }
    } catch (error) {
      console.error('Error categorizing description:', error);
      setSuggestedCategory('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, description: value }));
    categorizeDescription(value);
  };

  const applySuggestedCategory = () => {
    if (suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
      setSuggestedCategory('');
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-100 to-blue-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Donation Submitted Successfully!</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for your generous donation! Your items will be reviewed and made available to partner organizations who can put them to good use in the community.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Partner organizations will review your donation</li>
              <li>• Items will be claimed by organizations in need</li>
              <li>• You'll help reduce waste and support communities</li>
            </ul>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg transform hover:scale-105"
          >
            <Heart className="h-5 w-5 mr-2" />
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mr-4">
          <Package className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Donate Items</h2>
          <p className="text-gray-600 mt-1">Help communities in need by donating your items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label htmlFor="category" className="block text-lg font-semibold text-gray-700 mb-3">
              Category *
            </label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="pl-12 block w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-lg font-semibold text-gray-700 mb-3">
              Quantity *
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="pl-12 block w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-semibold text-gray-700 mb-3">
            Pickup Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your address or preferred pickup location"
              className="pl-12 block w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-3">
            Item Description *
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe the items you're donating in detail. Include condition, size, brand, etc. This helps partners understand what you're offering."
              className="pl-12 block w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors resize-none"
              required
            />
          </div>
          {suggestedCategory && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg text-blue-800">
                    AI suggests: <strong className="text-blue-900">{suggestedCategory}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestedCategory}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-semibold text-lg shadow-lg"
                >
                  Apply Suggestion
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-6 text-lg text-red-700 bg-red-50 rounded-xl border-2 border-red-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-12 py-4 border border-transparent text-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting Donation...
              </>
            ) : (
              <>
                <Heart className="h-6 w-6 mr-3" />
                Submit Donation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;