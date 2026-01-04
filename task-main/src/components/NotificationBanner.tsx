import { AlertCircle, Clock, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

export type NotificationType = 'overdue' | 'starting-soon' | 'time-exceeded' | 'end-of-day';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationBannerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationBanner({ notifications, onDismiss }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    onDismiss(id);
  };

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'overdue':
        return <AlertCircle size={20} />;
      case 'starting-soon':
        return <Clock size={20} />;
      case 'time-exceeded':
        return <TrendingUp size={20} />;
      case 'end-of-day':
        return <Clock size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'starting-soon':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'time-exceeded':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'end-of-day':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-2 ${getStyles(notification.type)} animate-fadeIn`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
