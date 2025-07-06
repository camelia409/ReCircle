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
      <div className="flex items-center text-green-600 text-sm">
        <Check className="h-4 w-4 mr-1" />
        Claimed
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          Claiming...
        </>
      ) : (
        'Claim Item'
      )}
    </button>
  );
};

export default ClaimButton;