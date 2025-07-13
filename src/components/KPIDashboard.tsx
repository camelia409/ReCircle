import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Clock, Recycle } from 'lucide-react';

interface KPIData {
  totalDonations: number;
  wasteDiverted: number;
  activePartners: number;
  avgClaimTime: number;
}

const KPIDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-kpis`);
        if (!response.ok) throw new Error('Failed to fetch KPI data');
        const data: KPIData = await response.json();
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        // Mock KPI data
        setKpiData({
          totalDonations: 1247,
          wasteDiverted: 623.5,
          activePartners: 12,
          avgClaimTime: 2.3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const kpiCards = [
    {
      title: 'Total Donations',
      value: kpiData?.totalDonations || 0,
      icon: BarChart3,
      color: 'blue',
      description: 'Items donated this month',
    },
    {
      title: 'Waste Diverted',
      value: `${kpiData?.wasteDiverted || 0} kg`,
      icon: Recycle,
      color: 'green',
      description: 'Environmental impact',
    },
    {
      title: 'Active Partners',
      value: kpiData?.activePartners || 0,
      icon: Users,
      color: 'purple',
      description: 'Organizations engaged',
    },
    {
      title: 'Avg Claim Time',
      value: `${kpiData?.avgClaimTime || 0} days`,
      icon: Clock,
      color: 'orange',
      description: 'Efficiency metric',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">KPI Dashboard</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32 text-blue-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Loading KPIs...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`h-8 w-8 ${getColorClasses(card.color)} p-1 rounded`} />
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-sm font-medium text-gray-700 mb-1">{card.title}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KPIDashboard; 