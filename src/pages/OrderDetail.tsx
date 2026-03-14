import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Download,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Clock,
  XCircle
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

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Load order automatically on component mount
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        toast.error('Order ID is required');
        navigate('/orders');
        return;
      }

      try {
        console.log('Loading order:', id);
        const orderData = await api.getOrder(id);
        console.log('Order loaded:', orderData);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
        
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('401')) {
          toast.error('Please log in to view order details');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.error('Failed to load order details');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  // Manual refresh order function
  const refreshOrder = async () => {
    if (!id) return;

    setLoading(true);
    try {
      console.log('Refreshing order:', id);
      const orderData = await api.getOrder(id);
      console.log('Order refreshed:', orderData);
      setOrder(orderData);
      toast.success('Order details refreshed!');
    } catch (error) {
      console.error('Failed to refresh order:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes('401')) {
        toast.error('Please log in to view order details');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error('Failed to refresh order details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatCurrency = (amount: string) => {
    return (parseFloat(amount) / 100).toFixed(2); // Convert from satoshis to dollars
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <button 
          onClick={() => navigate('/orders')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#a0a0b8', 
            fontWeight: '700', 
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>
            Loading Order...
          </h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px', lineHeight: '1.4', maxWidth: '400px' }}>
            Fetching order details from the API
          </p>
        </div>
      </div>
    );
  }

  // Show error state if no order loaded
  if (!order) {
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
        <button 
          onClick={() => navigate('/orders')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#a0a0b8', 
            fontWeight: '700', 
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>
            Order Not Found
          </h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px', marginBottom: '24px', maxWidth: '400px' }}>
            The order you're looking for could not be found or you don't have permission to view it.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={refreshOrder}
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
              Try Again
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={() => navigate('/orders')}
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
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate('/orders')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#a0a0b8', 
            fontWeight: '700', 
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          className="hover:text-[#00f2ff]"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center' 
        }}>
          <button 
            onClick={refreshOrder}
            disabled={loading}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              color: 'white', 
              padding: '8px 12px', 
              borderRadius: '12px', 
              fontWeight: '700', 
              fontSize: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              border: 'none'
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
          <div style={{ 
            backgroundColor: `${statusColor}15`, 
            color: statusColor, 
            padding: '8px 16px', 
            borderRadius: '12px', 
            fontSize: '13px', 
            fontWeight: '900', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            textTransform: 'capitalize'
          }}>
            {getStatusIcon(order.status)}
            {order.status}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left - Receipt & Order Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }} className="sm:p-10">
             <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }} className="sm:text-2xl">Order Receipt</h3>
             <p style={{ color: '#6b6b7d', fontSize: '13px', marginBottom: '32px', wordBreak: 'break-all' }} className="sm:text-sm">Order ID: {order.id}</p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }} className="sm:flex-row sm:justify-between">
                   <div>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Product/Service</p>
                      <p style={{ fontSize: '15px', fontWeight: '800' }} className="sm:text-base">{getOrderDescription(order)}</p>
                   </div>
                   <div style={{ textAlign: 'left' }} className="sm:text-right">
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Date</p>
                      <p style={{ fontSize: '15px', fontWeight: '800' }} className="sm:text-base">{formatDate(order.created_at)}</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid-cols-2">
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Total Amount</p>
                      <p style={{ fontSize: '20px', fontWeight: '950', color: '#00f2ff' }}>${formatCurrency(order.total_amount)}</p>
                   </div>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Payment Status</p>
                      <p style={{ fontSize: '15px', fontWeight: '800', textTransform: 'capitalize' }} className="sm:text-base">{order.payment_status}</p>
                   </div>
                </div>
             </div>

             {/* Order Items */}
             <div style={{ marginTop: '32px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Order Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                          {item.product.title}
                        </p>
                        <p style={{ fontSize: '12px', color: '#a0a0b8' }}>
                          Quantity: {item.quantity} × ${formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>
                        ${formatCurrency(item.total_price)}
                      </p>
                    </div>
                  ))}
                </div>
             </div>

             {/* Placeholder for credentials - only show for completed orders */}
             {order.status === 'completed' && (
               <div style={{ marginTop: '32px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                  <div style={{ backgroundColor: '#10b981', color: '#000', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="sm:p-6">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '900' }} className="sm:text-lg">Access Credentials</h4>
                        <CheckCircle2 size={24} />
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid-cols-2">
                        <div>
                          <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Status</p>
                          <p style={{ fontSize: '14px', fontWeight: '900' }} className="sm:text-base">Ready for Access</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Delivery</p>
                          <p style={{ fontSize: '14px', fontWeight: '900' }} className="sm:text-base">Instant</p>
                        </div>
                     </div>
                     <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: '600' }}>
                       Credentials will be provided through secure channels. Check your account dashboard or contact support.
                     </p>
                  </div>
                  <button style={{ width: '100%', marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: 'none', cursor: 'pointer' }} className="sm:text-sm">
                     <Download size={18} />
                     Contact Support for Credentials
                  </button>
               </div>
             )}
          </div>
        </div>

        {/* Right - Order Status & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Zap size={18} color="#00f2ff" />
                 Order Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {[
                   { label: 'Order Status', value: order.status, color: statusColor },
                   { label: 'Payment Status', value: order.payment_status, color: order.payment_status === 'paid' ? '#10b981' : '#f59e0b' },
                   { label: 'Items Count', value: `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` },
                   { label: 'Order Date', value: formatDate(order.created_at) }
                 ].map((stat, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '12px' }} className="sm:text-sm">
                      <span style={{ color: '#a0a0b8' }}>{stat.label}</span>
                      <span style={{ fontWeight: '700', color: stat.color || 'white', textAlign: 'right', textTransform: 'capitalize' }}>{stat.value}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={20} color="#00f2ff" style={{ flexShrink: 0 }} className="sm:w-6 sm:h-6" />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '800', color: '#00f2ff', marginBottom: '4px' }} className="sm:text-sm">Security Notice</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.5' }} className="sm:text-sm">Always use secure connections and verify all credentials before use. Contact support if you encounter any issues.</p>
              </div>
           </div>

           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#a0a0b8', marginBottom: '16px' }}>Need help with this order?</p>
              <button style={{ width: '100%', backgroundColor: 'rgba(255,75,75,0.1)', color: '#ff4b4b', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', border: 'none', cursor: 'pointer' }} className="sm:text-sm">
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
