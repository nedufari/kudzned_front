import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowRight,
  Calendar,
  Hash
} from 'lucide-react';
import { motion } from 'framer-motion';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const orders = [
    { id: 'TXN-9824-B1XC', date: 'Oct 12, 2024', item: 'Chase High-Balance Personal Log', amount: '$450.00', status: 'Completed', color: '#10b981' },
    { id: 'TXN-7731-A9QW', date: 'Oct 10, 2024', item: 'Global Swift Transfer (MT103)', amount: '$1,200.00', status: 'Pending', color: '#f59e0b' },
    { id: 'TXN-5521-L0KP', date: 'Oct 08, 2024', item: 'Aged PayPal Business Account', amount: '$250.00', status: 'Completed', color: '#10b981' },
    { id: 'TXN-4492-Z3MM', date: 'Oct 05, 2024', item: 'Wells Fargo Business Credit Line', amount: '$850.00', status: 'Failed', color: '#ff4b4b' },
    { id: 'TXN-3310-X2RR', date: 'Oct 02, 2024', item: 'BofA Cashout Method (Private)', amount: '$150.00', status: 'Completed', color: '#10b981' },
    { id: 'TXN-1192-M7ZZ', date: 'Sep 30, 2024', item: 'Crypto Exchange Verified', amount: '$350.00', status: 'Completed', color: '#10b981' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} />;
      case 'Pending': return <Clock size={16} />;
      case 'Failed': return <XCircle size={16} />;
      default: return null;
    }
  };

  return (
     <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Purchase History</h3>
          <p style={{ color: '#a0a0b8', fontSize: '15px' }}>Track your orders, view credentials, and check transaction status.</p>
        </div>
        <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block" style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Transaction ID</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr 
                key={i} 
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background-color 0.2s' }} 
                className="hover:bg-[rgba(255,255,255,0.01)] group"
              >
                <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: '#a0a0b8' }}>{order.id}</td>
                <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>{order.date}</td>
                <td style={{ padding: '20px 24px', fontSize: '15px', fontWeight: '800' }}>{order.item}</td>
                <td style={{ padding: '20px 24px', fontSize: '15px', fontWeight: '900', color: '#10b981' }}>{order.amount}</td>
                <td style={{ padding: '20px 24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: order.color, fontSize: '13px', fontWeight: '900', backgroundColor: `${order.color}15`, padding: '6px 12px', borderRadius: '10px', width: 'fit-content' }}>
                      {getStatusIcon(order.status)}
                      {order.status}
                   </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                   <button style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', color: '#00f2ff', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', border: '1px solid rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '6px' }} className="group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                      View
                      <ArrowRight size={14} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((order, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/orders/${order.id}`)}
            style={{
              backgroundColor: '#0d0d12',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b6b7d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Hash size={12} />
                  Transaction ID
                </div>
                <p style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: '#a0a0b8', wordBreak: 'break-all' }}>
                  {order.id}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: order.color, fontSize: '12px', fontWeight: '900', backgroundColor: `${order.color}15`, padding: '6px 12px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <div style={{ color: '#6b6b7d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                Product
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.3' }}>
                {order.item}
              </h4>
            </div>

            {/* Date & Amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b6b7d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Calendar size={12} />
                  Date
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>
                  {order.date}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#6b6b7d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Amount
                </div>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>
                  {order.amount}
                </p>
              </div>
            </div>

            {/* View Button */}
            <button 
              style={{ 
                width: '100%',
                backgroundColor: 'rgba(0, 242, 255, 0.05)', 
                color: '#00f2ff', 
                padding: '12px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '800', 
                border: '1px solid rgba(0, 242, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              View Details
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
