import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from '../utils/toast';

// Define Order interfaces locally to avoid import issues
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: string;
    category_id: string;
    images: string[];
    status: string;
    availability: string;
    created_at: string;
    updated_at: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  total_amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders automatically on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('Loading orders...');
        const ordersData = await api.getOrders(1, 20);
        console.log('Orders loaded:', ordersData);
        setOrders(ordersData || []); // Ensure we always have an array
      } catch (error) {
        console.error('Failed to load orders:', error);
        
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('401')) {
          toast.error('Please log in to view your orders');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.error('Failed to load orders');
        }
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  // Manual refresh orders function
  const refreshOrders = async () => {
    setLoading(true);
    try {
      console.log('Refreshing orders...');
      const ordersData = await api.getOrders(1, 20);
      console.log('Orders refreshed:', ordersData);
      setOrders(ordersData || []); // Ensure we always have an array
      toast.success(`Refreshed ${(ordersData || []).length} orders!`);
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes('401')) {
        toast.error('Please log in to view your orders');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error('Failed to refresh orders');
      }
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatCurrency = (amount: string) => {
    return (parseFloat(amount) / 100).toFixed(2); // Convert from cents to dollars
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderDescription = (order: Order) => {
    if (order.items.length === 1) {
      return order.items[0].product.title;
    } else if (order.items.length > 1) {
      return `${order.items.length} items`;
    }
    return 'Order';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 size={16} />;
      case 'pending':
      case 'processing': return <Clock size={16} />;
      case 'cancelled':
      case 'failed': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending':
      case 'processing': return '#f59e0b';
      case 'cancelled':
      case 'failed': return '#ff4b4b';
      default: return '#a0a0b8';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px', 
        gap: '24px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>
            Loading Orders...
          </h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px', lineHeight: '1.4', maxWidth: '400px' }}>
            Fetching your purchase history from the API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Purchased Order History</h3>
          <p style={{ color: '#a0a0b8', fontSize: '15px' }}>Track your orders, view credentials, and check transaction status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={refreshOrders}
            disabled={loading}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              color: 'white', 
              padding: '10px 16px', 
              borderRadius: '12px', 
              fontWeight: '700', 
              fontSize: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              border: 'none'
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
          <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          backgroundColor: '#0d0d12',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '24px'
        }}>
          <ShoppingBag size={64} style={{ margin: '0 auto 24px', opacity: 0.3, color: '#a0a0b8' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
            No Orders Yet
          </h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            You haven't placed any orders yet. Start shopping to see your purchase history here.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/shop')}
              style={{ 
                backgroundColor: '#00f2ff', 
                color: '#000', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: '800', 
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Browse Shop
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={refreshOrders}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: '800', 
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Refresh Orders
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div style={{ 
          backgroundColor: '#0d0d12', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: '700' }}>Your Orders ({orders.length})</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'clamp(12px, 3vw, 16px)', 
                    padding: 'clamp(12px, 3vw, 16px)', 
                    borderRadius: '16px', 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: 0
                  }}
                  className="hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]"
                >
                  {/* Status Icon */}
                  <div style={{ 
                    width: 'clamp(40px, 10vw, 48px)', 
                    height: 'clamp(40px, 10vw, 48px)', 
                    borderRadius: '12px', 
                    backgroundColor: `${statusColor}15`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: statusColor,
                    flexShrink: 0
                  }}>
                    {getStatusIcon(order.status)}
                  </div>
                  
                  {/* Order Info */}
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <h4 style={{ 
                      fontSize: 'clamp(14px, 3.5vw, 16px)', 
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px'
                    }}>
                      {getOrderDescription(order)}
                    </h4>
                    <p style={{ 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      color: '#a0a0b8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {formatDate(order.created_at)} • Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  
                  {/* Amount & Status */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ 
                      fontSize: 'clamp(14px, 3.5vw, 16px)', 
                      fontWeight: '700',
                      color: '#10b981'
                    }}>
                      ${formatCurrency(order.total_amount)}
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      color: statusColor, 
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {order.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;