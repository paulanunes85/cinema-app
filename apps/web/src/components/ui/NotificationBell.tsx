import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { NotificationType } from '@cinema-app/shared';

interface NotificationItem {
  id: string;
  type: string;
  referenceId: string;
  referenceType: string;
  read: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  [NotificationType.MENTION]: { icon: '💬', label: 'mencionou-te' },
  [NotificationType.STATUS_CHANGE]: { icon: '🔄', label: 'status alterado' },
  [NotificationType.COMMENT]: { icon: '💬', label: 'novo comentário' },
  [NotificationType.INVITATION]: { icon: '📩', label: 'convite de projeto' },
};

interface NotificationBellProps {
  projectId?: string;
}

export function NotificationBell({ projectId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useSocket({ projectId });

  const fetchNotifications = () => {
    api.get<NotificationItem[]>('/notifications?unread=false').then(setNotifications);
    api.get<{ count: number }>('/notifications/count').then((d) => setUnreadCount(d.count));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time: new notification
  useEffect(() => {
    const unsub = subscribe<NotificationItem>('notification:new', () => {
      fetchNotifications();
    });
    return unsub;
  }, [subscribe]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    await api.patch('/notifications/read-all');
    fetchNotifications();
  };

  const handleClickNotification = async (n: NotificationItem) => {
    if (!n.read) {
      await api.patch(`/notifications/${n.id}/read`);
      fetchNotifications();
    }
    setIsOpen(false);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin}min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-bg-secondary focus-ring cursor-pointer"
        aria-label={`${unreadCount} notificações não lidas`}
        aria-expanded={isOpen}
      >
        <span aria-hidden="true" className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-bg-primary border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-text-primary">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">
                Sem notificações
              </p>
            ) : (
              notifications.slice(0, 20).map((n) => {
                const config = TYPE_CONFIG[n.type] ?? { icon: '📌', label: n.type };
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className={`
                      w-full text-left px-4 py-3 flex items-start gap-3
                      hover:bg-bg-secondary transition-colors cursor-pointer
                      border-b border-border last:border-0
                      ${!n.read ? 'bg-primary/5' : ''}
                    `}
                  >
                    <span className="text-lg mt-0.5" aria-hidden="true">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        {config.label}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" aria-label="Não lida" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
