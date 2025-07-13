import React, { useState, useEffect } from 'react';
import { Bell, X, MapPin, Package } from 'lucide-react';

interface NotificationBannerProps {
  partnerId: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ partnerId }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      // Replace with real API call if needed
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partner_id: partnerId, item_id: 1 }) });
      // const data = await response.json();
      const data = [
        {
          id: 1,
          message: "New electronics available in your area!",
          type: "new_item",
          location: "New York",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          message: "Claim 10 items this month for a badge!",
          type: "challenge",
          progress: 5,
          target: 10,
          timestamp: new Date().toISOString(),
        }
      ];
      setNotifications(data);
      setTimeout(() => setDismissed((prev) => [...prev, 1]), 5000);
    };
    fetchNotifications();
  }, [partnerId]);

  const handleDismiss = (notificationId: number) => {
    setDismissed(prev => [...prev, notificationId]);
  };

  const visibleNotifications = notifications.filter(n => !dismissed.includes(n.id));

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      {visibleNotifications.map(notification => (
        <div
          key={notification.id}
          className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <Package className="h-4 w-4 text-blue-500 mr-1" />
                <p className="text-sm font-medium text-blue-800">
                  {notification.message}
                </p>
              </div>
              <div className="flex items-center mt-1">
                <MapPin className="h-3 w-3 text-blue-500 mr-1" />
                <p className="text-xs text-blue-600">
                  {notification.location}
                </p>
              </div>
              {notification.type === 'challenge' && notification.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-blue-600 mb-1">
                    <span>Progress: {notification.progress}/{notification.target}</span>
                    <span>{Math.round((notification.progress / notification.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(notification.progress / notification.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-blue-200 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;