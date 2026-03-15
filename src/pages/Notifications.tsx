import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  DollarSign,
  Clock,
  Trash2,
  Check,
  Filter,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { AppNotification } from '../services/api';

type NotificationType = 'success' | 'warning' | 'info' | 'transaction';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: any;
}

const mapAppNotificationToLocal = (apiNotif: AppNotification): Notification => {
  let type: NotificationType = 'info';
  if (
    apiNotif.type === 'login_success' || 
    apiNotif.type === 'deposit_confirmed' || 
    apiNotif.type === 'kyc_approved'
  ) {
    type = 'success';
  } else if (
    apiNotif.type === 'kyc_rejected' || 
    apiNotif.type.includes('warning')
  ) {
    type = 'warning';
  } else if (apiNotif.type === 'order_created' || apiNotif.type.includes('order')) {
    type = 'transaction';
  }

  // Simple relative time formatter
  const timeDiff = Math.floor((new Date().getTime() - new Date(apiNotif.created_at).getTime()) / 1000); // seconds
  let timeStr = '';
  if (timeDiff < 60) timeStr = `${timeDiff}s ago`;
  else if (timeDiff < 3600) timeStr = `${Math.floor(timeDiff / 60)}m ago`;
  else if (timeDiff < 86400) timeStr = `${Math.floor(timeDiff / 3600)}h ago`;
  else timeStr = `${Math.floor(timeDiff / 86400)}d ago`;

  return {
    id: apiNotif.id,
    type,
    title: apiNotif.title,
    message: apiNotif.message,
    time: timeStr,
    read: apiNotif.is_read
  };
};

const NotificationCard = ({ notification, onMarkRead, onDelete }: { 
  notification: Notification, 
  onMarkRead: (id: string) => void,
  onDelete: (id: string) => void 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'transaction':
        return notification.icon || <DollarSign size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#00f2ff';
      case 'transaction':
        return '#ff00f2';
      default:
        return '#a0a0b8';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: notification.read ? '#0d0d12' : 'rgba(0, 242, 255, 0.03)',
        border: `1px solid ${notification.read ? 'rgba(255,255,255,0.05)' : 'rgba(0, 242, 255, 0.1)'}`,
        borderRadius: '20px',
        padding: '16px', // Reduced padding for mobile
        display: 'flex',
        gap: '12px', // Reduced gap for mobile
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{ 
        backgroundColor: notification.read ? '#16161e' : 'rgba(0, 242, 255, 0.05)',
        transition: { duration: 0.2 }
      }}
    >
      {!notification.read && (
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: getColor()
          }}
          animate={{
            boxShadow: [
              `0 0 0px ${getColor()}`,
              `0 0 10px ${getColor()}`,
              `0 0 0px ${getColor()}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.div
        style={{
          width: '40px', // Smaller icon for mobile
          height: '40px',
          borderRadius: '12px',
          backgroundColor: `${getColor()}15`,
          color: getColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {getIcon()}
      </motion.div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h4 style={{ 
            fontSize: '15px', // Slightly smaller font
            fontWeight: '800', 
            color: notification.read ? '#a0a0b8' : 'white',
            marginBottom: '4px',
            lineHeight: '1.2'
          }}>
            {notification.title}
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b6b7d', fontSize: '12px', fontWeight: '700' }}>
              <Clock size={12} />
              {notification.time}
            </div>
          </div>
        </div>
        <p style={{ 
          fontSize: '13px', // Smaller font for message
          color: '#a0a0b8', 
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          {notification.message}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!notification.read && (
            <motion.button
              onClick={() => onMarkRead(notification.id)}
              style={{
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                color: '#00f2ff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(0, 242, 255, 0.2)'
              }}
              whileHover={{ 
                backgroundColor: 'rgba(0, 242, 255, 0.15)',
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Check size={12} />
              Mark Read
            </motion.button>
          )}
          <motion.button
            onClick={() => onDelete(notification.id)}
            style={{
              backgroundColor: 'rgba(255, 75, 75, 0.1)',
              color: '#ff4b4b',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255, 75, 75, 0.2)'
            }}
            whileHover={{ 
              backgroundColor: 'rgba(255, 75, 75, 0.15)',
              scale: 1.05
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={12} />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Fallback unread fetch trigger
    const fetchUnread = () => {
      fetchNotifications();
    };
    
    window.addEventListener('notificationUpdated', fetchUnread);
    return () => {
      window.removeEventListener('notificationUpdated', fetchUnread);
    };
  }, []);

  const fetchNotifications = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      const currentPage = isLoadMore ? page + 1 : 1;
      const res = await api.getNotifications(currentPage, 20);
      const localNotifications = res.data.map(mapAppNotificationToLocal);

      if (isLoadMore) {
        setNotifications((prev) => {
          // preserve unread statuses across app fetches if needed, but here we just merge
          const newIds = localNotifications.map((n) => n.id);
          const filteredPrev = prev.filter((p) => !newIds.includes(p.id));
          return [...filteredPrev, ...localNotifications];
        });
        setPage(currentPage);
      } else {
        setNotifications(localNotifications);
        setPage(1);
      }
      
      setHasMore(res.metadata?.hasNext || false);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      if (!isLoadMore) setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div className="responsive-flex stack-on-mobile" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: '900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell size={32} color="#00f2ff" />
              </motion.div>
              Notifications
            </h3>
            <p style={{ color: '#a0a0b8', fontSize: '14px' }}>
              Stay updated with your account activity and marketplace alerts.
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: 'rgba(255, 0, 242, 0.1)',
                border: '1px solid rgba(255, 0, 242, 0.3)',
                padding: '8px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0px rgba(255, 0, 242, 0)',
                    '0 0 15px rgba(255, 0, 242, 0.6)',
                    '0 0 0px rgba(255, 0, 242, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ff00f2'
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#ff00f2' }}>
                {unreadCount} Unread
              </span>
            </motion.div>
          )}
        </div>

        {/* Filter & Actions */}
        <div className="responsive-flex stack-on-mobile">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => setFilter('all')}
              style={{
                backgroundColor: filter === 'all' ? '#00f2ff' : 'rgba(255,255,255,0.05)',
                color: filter === 'all' ? '#000' : '#a0a0b8',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: filter === 'all' ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              All ({notifications.length})
            </motion.button>
            <motion.button
              onClick={() => setFilter('unread')}
              style={{
                backgroundColor: filter === 'unread' ? '#00f2ff' : 'rgba(255,255,255,0.05)',
                color: filter === 'unread' ? '#000' : '#a0a0b8',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: filter === 'unread' ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unread ({unreadCount})
            </motion.button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {unreadCount > 0 && (
              <motion.button
                onClick={handleMarkAllRead}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Check size={16} />
                Mark All Read
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader className="animate-spin" size={32} color="#00f2ff" />
        </div>
      ) : (
        <>
          {/* Notifications List */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            layout
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <NotificationCard
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '80px 40px',
                  backgroundColor: '#0d0d12',
                  borderRadius: '32px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bell size={64} color="#6b6b7d" style={{ marginBottom: '24px' }} />
                </motion.div>
                <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
                  {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                </h4>
                <p style={{ color: '#a0a0b8' }}>
                  {filter === 'unread' 
                    ? 'You\'ve read all your notifications. Great job staying on top of things!'
                    : 'When you receive notifications, they\'ll appear here.'}
                </p>
              </motion.div>
            )}
            
            {hasMore && filter === 'all' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <motion.button
                  onClick={() => fetchNotifications(true)}
                  style={{
                    backgroundColor: 'rgba(0, 242, 255, 0.05)',
                    color: '#00f2ff',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '14px',
                    border: '1px solid rgba(0, 242, 255, 0.2)',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 242, 255, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Notifications;
