import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Download,
  AlertTriangle
} from 'lucide-react';

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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left - Receipt & Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }} className="sm:p-10">
             <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }} className="sm:text-2xl">Order Receipt</h3>
             <p style={{ color: '#6b6b7d', fontSize: '13px', marginBottom: '32px', wordBreak: 'break-all' }} className="sm:text-sm">Transaction ID: {order.id}</p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }} className="sm:flex-row sm:justify-between">
                   <div>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Product Service</p>
                      <p style={{ fontSize: '15px', fontWeight: '800' }} className="sm:text-base">{order.item}</p>
                   </div>
                   <div style={{ textAlign: 'left' }} className="sm:text-right">
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Category</p>
                      <p style={{ fontSize: '15px', fontWeight: '800' }} className="sm:text-base">{order.category}</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid-cols-2">
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Amount Paid</p>
                      <p style={{ fontSize: '20px', fontWeight: '950', color: '#00f2ff' }}>{order.amount}</p>
                   </div>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Method</p>
                      <p style={{ fontSize: '15px', fontWeight: '800' }} className="sm:text-base">{order.method}</p>
                   </div>
                </div>
             </div>

             <div style={{ marginTop: '32px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                <div style={{ backgroundColor: '#10b981', color: '#000', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="sm:p-6">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '900' }} className="sm:text-lg">Log Access Credentials</h4>
                      <CheckCircle2 size={24} />
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid-cols-2">
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Username/Login</p>
                        <p style={{ fontSize: '14px', fontWeight: '900', wordBreak: 'break-all' }} className="sm:text-base">{order.credentials.username}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Password</p>
                        <p style={{ fontSize: '14px', fontWeight: '900' }} className="sm:text-base">{order.credentials.password}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Email Access</p>
                        <p style={{ fontSize: '14px', fontWeight: '900', wordBreak: 'break-all' }} className="sm:text-base">{order.credentials.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Recovery Key</p>
                        <p style={{ fontSize: '14px', fontWeight: '900', wordBreak: 'break-all' }} className="sm:text-base">{order.credentials.recovery}</p>
                      </div>
                   </div>
                </div>
                <button style={{ width: '100%', marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} className="sm:text-sm">
                   <Download size={18} />
                   Download Full Credentials (.txt)
                </button>
             </div>
          </div>
        </div>

        {/* Right - Audit logs / Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Zap size={18} color="#00f2ff" />
                 Blockchain Audit
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {[
                   { label: 'Network', value: 'Bitcoin (BTC)' },
                   { label: 'Confirmations', value: '3 / 3 (Full)', color: '#10b981' },
                   { label: 'Processing Time', value: '12 Minutes' },
                   { label: 'Fee Deducted', value: '0.000004 BTC' }
                 ].map((stat, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '12px' }} className="sm:text-sm">
                      <span style={{ color: '#a0a0b8' }}>{stat.label}</span>
                      <span style={{ fontWeight: '700', color: stat.color || 'white', textAlign: 'right' }}>{stat.value}</span>
                   </div>
                 ))}
                 <button style={{ color: '#00f2ff', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }} className="sm:text-sm">
                    View Explorer Transaction
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={20} color="#00f2ff" style={{ flexShrink: 0 }} className="sm:w-6 sm:h-6" />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '800', color: '#00f2ff', marginBottom: '4px' }} className="sm:text-sm">Security Notice</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.5' }} className="sm:text-sm">Always use a clean proxy/RDP matching the log's state to prevent account flags. Check our guides in the Method section.</p>
              </div>
           </div>

           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#a0a0b8', marginBottom: '16px' }}>Problem with this order?</p>
              <button style={{ width: '100%', backgroundColor: 'rgba(255,75,75,0.1)', color: '#ff4b4b', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }} className="sm:text-sm">
                 Open Support Ticket
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
