import React, { useState, useEffect } from 'react';
import { Bell, X, MapPin, Package } from 'lucide-react';

interface NotificationBannerProps {
  partnerId: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ partnerId }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    // Mock notifications for MVP - simulate new items in partner's location
    const mockNotifications = [
      {
        id: 1,
        message: "New electronics available in your area!",
        type: "new_item",
        location: "New York",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        message: "Clothing donation just added nearby",
        type: "new_item", 
        location: "New York",
        timestamp: new Date().toISOString(),
      }
    ];

    // Filter notifications based on partner location (mock logic)
    if (partnerId === 1) { // Community Aid in New York
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
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
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
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
            </div>
          </div>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;