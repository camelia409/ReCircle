import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlockchainEntry {
  item_id: number;
  event: string;
  timestamp: string;
  partner_id: number | null;
}

interface BlockchainLogProps {
  itemId: number;
}

const BlockchainLog: React.FC<BlockchainLogProps> = ({ itemId }) => {
  const [logs, setLogs] = useState<BlockchainEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const logsPerPage = 5;
  const totalPages = Math.ceil(logs.length / logsPerPage);
  const paginatedLogs = logs.slice((page - 1) * logsPerPage, page * logsPerPage);

  useEffect(() => {
    fetchBlockchainLog();
  }, [itemId]);

  const fetchBlockchainLog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blockchain/${itemId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blockchain log');
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blockchain log');
      // Mock data for MVP
      setLogs([
        {
          item_id: itemId,
          event: 'listed',
          timestamp: '2025-01-06T12:00:00Z',
          partner_id: null,
        },
        {
          item_id: itemId,
          event: 'claimed',
          timestamp: '2025-01-06T14:30:00Z',
          partner_id: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'listed':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'claimed':
        return <User className="h-4 w-4 text-green-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'listed':
        return 'bg-blue-100 text-blue-800';
      case 'claimed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading blockchain log...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Blockchain Traceability - Item #{itemId}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-yellow-700 bg-yellow-100 rounded-md">
          Using mock data: {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-blue-200 rounded-lg">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Partner ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLogs.map((log, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getEventIcon(log.event)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventColor(log.event)}`}>
                      {log.event}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.partner_id ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Partner #{log.partner_id}
                    </div>
                  ) : (
                    <span className="text-gray-400">System</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {logs.length > logsPerPage && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-blue-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blockchain entries found for this item.
        </div>
      )}
    </div>
  );
};

export default BlockchainLog;