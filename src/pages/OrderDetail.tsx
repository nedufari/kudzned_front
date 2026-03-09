import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  History, 
  Zap, 
  CheckCircle2, 
  Settings, 
  MessageSquare, 
  ExternalLink,
  CreditCard,
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for a single order
  const order = {
    id: id || 'TXN-9824-B1XC',
    date: 'Oct 12, 2024 - 14:23 PM',
    status: 'Completed',
    item: 'Chase High-Balance Personal Log',
    category: 'Bank Logs',
    amount: '$450.00',
    method: 'BTC (Bitcoin)',
    wallet: 'bc1qxy2kg2ryyxpx4lhuv067z8483m3m3j',
    confirmations: '3/3',
    credentials: {
      username: 'user_4291',
      password: '************',
      email: 'logaccess_92@kudzned.tech',
      recovery: 'kudzned_recovery_key_2024'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/orders')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
          className="hover:text-[#00f2ff]"
        >
          <ArrowLeft size={18} />
          Back to History
        </button>
        <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
           <CheckCircle2 size={16} />
           {order.status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.3fr 0.7fr))', gap: '40px' }} className="main-grid">
        {/* Left - Receipt & Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
             <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Order Receipt</h3>
             <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '40px' }}>Transaction ID: {order.id}</p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                   <div>
                      <p style={{ fontSize: '12px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px' }}>Product Service</p>
                      <p style={{ fontSize: '16px', fontWeight: '800' }}>{order.item}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px' }}>Category</p>
                      <p style={{ fontSize: '16px', fontWeight: '800' }}>{order.category}</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px' }}>Amount Paid</p>
                      <p style={{ fontSize: '20px', fontWeight: '950', color: '#00f2ff' }}>{order.amount}</p>
                   </div>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px' }}>Method</p>
                      <p style={{ fontSize: '16px', fontWeight: '800' }}>{order.method}</p>
                   </div>
                </div>
             </div>

             <div style={{ marginTop: '40px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '40px' }}>
                <div style={{ backgroundColor: '#10b981', color: '#000', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '900' }}>Log Access Credentials</h4>
                      <CheckCircle2 size={24} />
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Username/Login</p>
                        <p style={{ fontSize: '15px', fontWeight: '900' }}>{order.credentials.username}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Password</p>
                        <p style={{ fontSize: '15px', fontWeight: '900' }}>{order.credentials.password}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Email Access</p>
                        <p style={{ fontSize: '15px', fontWeight: '900' }}>{order.credentials.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Recovery Key</p>
                        <p style={{ fontSize: '15px', fontWeight: '900' }}>{order.credentials.recovery}</p>
                      </div>
                   </div>
                </div>
                <button style={{ width: '100%', marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '16px', borderRadius: '16px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                   <Download size={18} />
                   Download Full Credentials (.txt)
                </button>
             </div>
          </div>
        </div>

        {/* Right - Audit logs / Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Zap size={18} color="#00f2ff" />
                 Blockchain Audit
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {[
                   { label: 'Network', value: 'Bitcoin (BTC)' },
                   { label: 'Confirmations', value: '3 / 3 (Full)', color: '#10b981' },
                   { label: 'Processing Time', value: '12 Minutes' },
                   { label: 'Fee Deducted', value: '0.000004 BTC' }
                 ].map((stat, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#a0a0b8' }}>{stat.label}</span>
                      <span style={{ fontWeight: '700', color: stat.color || 'white' }}>{stat.value}</span>
                   </div>
                 ))}
                 <button style={{ color: '#00f2ff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    View Explorer Transaction
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', borderRadius: '24px', padding: '24px', display: 'flex', gap: '16px' }}>
              <AlertTriangle size={24} color="#00f2ff" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#00f2ff', marginBottom: '4px' }}>Security Notice</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8' }}>Always use a clean proxy/RDP matching the log's state to prevent account flags. Check our guides in the Method section.</p>
              </div>
           </div>

           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#a0a0b8', marginBottom: '16px' }}>Problem with this order?</p>
              <button style={{ width: '100%', backgroundColor: 'rgba(255,75,75,0.1)', color: '#ff4b4b', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}>
                 Open Support Ticket
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
