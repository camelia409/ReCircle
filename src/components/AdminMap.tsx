import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'lucide-react';

interface MapData {
  lat: number;
  lng: number;
  type: 'partner' | 'donation';
  name: string;
  location: string;
}

const AdminMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-map-data`);
        if (!response.ok) throw new Error('Failed to fetch map data');
        const data: MapData[] = await response.json();
        
        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add markers for each data point
          data.forEach((item) => {
            const isPartner = item.type === 'partner';
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                isPartner ? 'bg-blue-600' : 'bg-blue-300'
              }"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            const marker = L.marker([item.lat, item.lng], { icon }).addTo(map);

            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-blue-900">${item.name}</h3>
                <p class="text-blue-700">${item.location}</p>
                <span class="inline-block px-2 py-1 text-xs rounded ${
                  isPartner ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-600'
                }">${isPartner ? 'Partner' : 'Donation'}</span>
              </div>
            `);
          });

          mapInstanceRef.current = map;
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
        // Mock data for demo
        const mockData: MapData[] = [
          { lat: 40.7128, lng: -74.0060, type: 'partner', name: 'Community Aid', location: 'New York' },
          { lat: 40.7589, lng: -73.9851, type: 'donation', name: 'Donation Center', location: 'Manhattan' },
          { lat: 40.7505, lng: -73.9934, type: 'partner', name: 'Food Bank', location: 'Brooklyn' },
          { lat: 40.7282, lng: -73.7949, type: 'donation', name: 'Clothing Drive', location: 'Queens' },
        ];

        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          mockData.forEach((item) => {
            const isPartner = item.type === 'partner';
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                isPartner ? 'bg-blue-600' : 'bg-blue-300'
              }"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            const marker = L.marker([item.lat, item.lng], { icon }).addTo(map);

            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-blue-900">${item.name}</h3>
                <p class="text-blue-700">${item.location}</p>
                <span class="inline-block px-2 py-1 text-xs rounded ${
                  isPartner ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-600'
                }">${isPartner ? 'Partner' : 'Donation'}</span>
              </div>
            `);
          });

          mapInstanceRef.current = map;
        }
      }
    };

    fetchMapData();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Map className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Geospatial Overview</h2>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-blue-200"
        style={{ zIndex: 1 }}
      />
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span className="text-blue-800">Partners</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
          <span className="text-blue-600">Donations</span>
        </div>
      </div>
    </div>
  );
};

export default AdminMap; 