import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface ClaimButtonProps {
  itemId: number;
  partnerId: number;
  onSuccess?: (itemId: number) => void;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({ itemId, partnerId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          partner_id: partnerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to claim item');
      }

      setClaimed(true);
      onSuccess?.(itemId);
    } catch (error) {
      console.error('Error claiming item:', error);
      alert(error instanceof Error ? error.message : 'Failed to claim item');
    } finally {
      setLoading(false);
    }
  };

  if (claimed) {
    return (
      <div className="flex items-center text-green-600 text-base font-semibold">
        <div className="p-2 bg-green-100 rounded-lg mr-2">
          <Check className="h-5 w-5" />
        </div>
        Claimed Successfully
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          <Check className="h-5 w-5 mr-2" />
          Claim Item
        </>
      )}
    </button>
  );
};

export default ClaimButton;