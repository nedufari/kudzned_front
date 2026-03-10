import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  Trash2,
  Check,
  Filter,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

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
        padding: '20px',
        display: 'flex',
        gap: '16px',
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
          width: '48px',
          height: '48px',
          borderRadius: '14px',
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
            fontSize: '16px', 
            fontWeight: '800', 
            color: notification.read ? '#a0a0b8' : 'white',
            marginBottom: '4px'
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
          fontSize: '14px', 
          color: '#a0a0b8', 
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          {notification.message}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!notification.read && (
            <motion.button
              onClick={() => onMarkRead(notification.id)}
              style={{
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                color: '#00f2ff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
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
              <Check size={14} />
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
              fontSize: '12px',
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
            <Trash2 size={14} />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Order Delivered Successfully',
      message: 'Your Chase High-Balance Personal Log has been delivered. Check your email for access credentials.',
      time: '2m ago',
      read: false
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Payment Confirmed',
      message: 'Your BTC payment of $450.00 has been confirmed with 3 blockchain confirmations.',
      time: '15m ago',
      read: false,
      icon: <DollarSign size={20} />
    },
    {
      id: '3',
      type: 'info',
      title: 'New Products Available',
      message: 'Fresh Wells Fargo Business logs just dropped in the marketplace. Limited quantity available.',
      time: '1h ago',
      read: false,
      icon: <ShoppingBag size={20} />
    },
    {
      id: '4',
      type: 'warning',
      title: 'Security Alert',
      message: 'New login detected from IP 192.168.1.1. If this wasn\'t you, please secure your account immediately.',
      time: '3h ago',
      read: true
    },
    {
      id: '5',
      type: 'success',
      title: 'Wallet Topped Up',
      message: 'Your wallet has been credited with $500.00. Transaction ID: TXN-9824-B1XC',
      time: '5h ago',
      read: true,
      icon: <DollarSign size={20} />
    },
    {
      id: '6',
      type: 'info',
      title: 'Price Drop Alert',
      message: 'PayPal Aged Accounts are now 20% off for the next 24 hours. Don\'t miss out!',
      time: '1d ago',
      read: true,
      icon: <TrendingUp size={20} />
    },
    {
      id: '7',
      type: 'transaction',
      title: 'Transfer Completed',
      message: 'Your global wire transfer of $2,400 has been successfully processed and delivered.',
      time: '2d ago',
      read: true,
      icon: <CheckCircle2 size={20} />
    },
    {
      id: '8',
      type: 'info',
      title: 'Account Verified',
      message: 'Your KUDZNED account has been fully verified. You now have access to premium features.',
      time: '3d ago',
      read: true,
      icon: <Shield size={20} />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell size={32} color="#00f2ff" />
              </motion.div>
              Notifications
            </h3>
            <p style={{ color: '#a0a0b8', fontSize: '16px' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
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
            {notifications.length > 0 && (
              <motion.button
                onClick={handleClearAll}
                style={{
                  backgroundColor: 'rgba(255, 75, 75, 0.1)',
                  color: '#ff4b4b',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 75, 75, 0.2)'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 75, 75, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
                Clear All
              </motion.button>
            )}
          </div>
        </div>
      </div>

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
      </motion.div>
    </div>
  );
};

export default Notifications;
