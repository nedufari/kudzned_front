import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  User, 
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const VouchCard = ({ vouch }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/vouches/${vouch.id}`)}
      style={{
        backgroundColor: '#0d0d12',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="#00f2ff" />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{vouch.user}</h4>
            <span style={{ fontSize: '11px', color: '#6b6b7d', fontWeight: '700' }}>Verified Buyer</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
        </div>
      </div>

      <p style={{ color: '#a0a0b8', fontSize: '14px', lineHeight: '1.6', flex: 1 }}>
        "{vouch.comment}"
      </p>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Calendar size={14} color="#6b6b7d" />
           <span style={{ fontSize: '12px', color: '#6b6b7d', fontWeight: '700' }}>{vouch.date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00f2ff', fontSize: '12px', fontWeight: '800' }}>
           Details <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const Vouches: React.FC = () => {
  const vouches = [
    { id: 'V-001', user: 'Nedu Franco', date: 'Oct 14, 2024', rating: 5, comment: 'Just finished my first high-balance log purchase. The delivery was instant and the balance was exactly as advertised.' },
    { id: 'V-002', user: 'CryptoKing', date: 'Oct 12, 2024', rating: 5, comment: 'Excellent support. Had a small issue with the proxy but the team sorted it out in less than 5 minutes. 10/10.' },
    { id: 'V-003', user: 'SilentTrader', date: 'Oct 10, 2024', rating: 5, comment: 'Best SWIFT transfer service in the market. Guaranteed delivery every time without flags.' },
    { id: 'V-004', user: 'LogMaster_', date: 'Oct 09, 2024', rating: 5, comment: 'Highly recommend the BofA method. Used it twice and both cashouts went smoothly with high success.' },
    { id: 'V-005', user: 'Ghost_x', date: 'Oct 08, 2024', rating: 5, comment: 'Reliable accounts, fast delivery. Worth every penny. No more placeholders on this platform!' },
    { id: 'V-006', user: 'SkyWalker', date: 'Oct 07, 2024', rating: 4, comment: 'Good quality logs, though I wish there were more EU options available. Still solid service.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>User Vouches</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>See what our community has to say about their experience.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '10px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              1,240 Total Verified Vouches
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {vouches.map((vouch) => (
          <VouchCard key={vouch.id} vouch={vouch} />
        ))}
      </div>
    </div>
  );
};

export default Vouches;
