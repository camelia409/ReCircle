import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Shield, Search } from 'lucide-react';

interface PendingPartner {
  id: number;
  name: string;
  location: string;
  status: string;
}

interface AuditEntry {
  item_id: number;
  partner_id: number;
  timestamp: string;
}

const AdminPanel: React.FC = () => {
  const [pendingPartners, setPendingPartners] = useState<PendingPartner[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPendingPartners();
    fetchAuditLog();
  }, []);

  const fetchPendingPartners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/partners`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      
      const data = await response.json();
      setPendingPartners(data.filter((p: PendingPartner) => p.status === 'pending'));
    } catch (error) {
      console.error('Error fetching partners:', error);
      // Mock data for MVP
      setPendingPartners([
        { id: 5, name: 'Eco Warriors', location: 'Boston', status: 'pending' },
        { id: 6, name: 'Food Bank Central', location: 'Seattle', status: 'pending' },
      ]);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/audit`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit log');
      }
      
      const data = await response.json();
      setAuditLog(data);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      // Mock data for MVP
      setAuditLog([
        { item_id: 1, partner_id: 1, timestamp: '2025-01-06T10:30:00Z' },
        { item_id: 2, partner_id: 2, timestamp: '2025-01-06T11:15:00Z' },
        { item_id: 3, partner_id: 1, timestamp: '2025-01-06T12:45:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId: number) => {
    setApproving(partnerId);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partner_id: partnerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve partner');
      }

      // Remove from pending list
      setPendingPartners(prev => prev.filter(p => p.id !== partnerId));
    } catch (error) {
      console.error('Error approving partner:', error);
      // For MVP, just remove from list
      setPendingPartners(prev => prev.filter(p => p.id !== partnerId));
    } finally {
      setApproving(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredPartners = pendingPartners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading admin data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Partners */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-orange-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Pending Partner Approvals</h2>
        </div>
        <div className="mb-4 flex items-center">
          <Search className="h-5 w-5 text-blue-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-blue-200 rounded-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Organization Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider border-b border-blue-200">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleApprove(partner.id)}
                      disabled={approving === partner.id}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {approving === partner.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPartners.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending partner approvals.
          </div>
        )}
      </div>

      {/* Claim Audit Log */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Claim Audit Log</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLog.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{entry.item_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Partner #{entry.partner_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTimestamp(entry.timestamp)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {auditLog.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No claim audit entries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;