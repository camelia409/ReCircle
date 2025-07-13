import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface DonationLocation {
  lat: number;
  lng: number;
  location: string;
  quantity: number;
}

const Heatmap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchDonationLocations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donation-locations`);
        if (!response.ok) throw new Error('Failed to fetch donation locations');
        const data: DonationLocation[] = await response.json();
        
        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10); // NYC default
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add markers for each donation location
          data.forEach((location) => {
            const radius = Math.min(20, Math.max(5, location.quantity * 2)); // Scale radius based on quantity
            const circle = L.circleMarker([location.lat, location.lng], {
              radius: radius,
              fillColor: '#3b82f6',
              color: '#1e40af',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }).addTo(map);

            circle.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-blue-900">${location.location}</h3>
                <p class="text-blue-700">Quantity: ${location.quantity} items</p>
              </div>
            `);
          });

          mapInstanceRef.current = map;
        }
      } catch (error) {
        console.error('Error fetching donation locations:', error);
        // Mock data for demo
        const mockData: DonationLocation[] = [
          { lat: 40.7128, lng: -74.0060, location: 'New York', quantity: 15 },
          { lat: 40.7589, lng: -73.9851, location: 'Manhattan', quantity: 8 },
          { lat: 40.7505, lng: -73.9934, location: 'Brooklyn', quantity: 12 },
        ];

        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          mockData.forEach((location) => {
            const radius = Math.min(20, Math.max(5, location.quantity * 2));
            const circle = L.circleMarker([location.lat, location.lng], {
              radius: radius,
              fillColor: '#3b82f6',
              color: '#1e40af',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }).addTo(map);

            circle.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-blue-900">${location.location}</h3>
                <p class="text-blue-700">Quantity: ${location.quantity} items</p>
              </div>
            `);
          });

          mapInstanceRef.current = map;
        }
      }
    };

    fetchDonationLocations();

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
        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Donation Heatmap</h2>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-blue-200"
        style={{ zIndex: 1 }}
      />
      <div className="mt-4 text-sm text-blue-600">
        <p>Circle size indicates donation quantity. Larger circles = more items.</p>
      </div>
    </div>
  );
};

export default Heatmap; 