import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Video, 
  Calendar, 
  Eye, 
  Share2, 
  TrendingUp,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ClipCard = ({ clip }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/cashout-clips/${clip.id}`)}
      style={{
        backgroundColor: '#0d0d12',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      <div style={{ position: 'relative', height: '200px', width: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#16161e' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img src={`https://images.unsplash.com/photo-1542382257-80dee2700140?auto=format&fit=crop&q=80&w=600&h=400&sig=${clip.id}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0d0d12, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button style={{ backgroundColor: '#00f2ff', color: '#000', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)', transition: 'transform 0.2s' }} className="hover:scale-110">
            <Play size={24} fill="currentColor" />
          </button>
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '10px', backdropFilter: 'blur(4px)', fontSize: '11px', fontWeight: '800', color: 'white' }}>
          {clip.duration}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{clip.title}</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#6b6b7d', fontSize: '12px', fontWeight: '700' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Calendar size={14} />
             {clip.date}
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Eye size={14} />
             {clip.views} Views
           </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px', 
        backgroundColor: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', padding: '8px', borderRadius: '10px', color: '#00f2ff' }}>
             <DollarSign size={18} />
           </div>
           <div>
             <p style={{ fontSize: '10px', color: '#6b6b7d', textTransform: 'uppercase' }}>Profit Made</p>
             <p style={{ fontSize: '15px', fontWeight: '900', color: '#10b981' }}>{clip.profit}</p>
           </div>
         </div>
         <button style={{ color: '#00f2ff', fontSize: '12px', fontWeight: '800' }}>
           <ChevronRight size={18} />
         </button>
      </div>
    </motion.div>
  );
};

const CashoutClips: React.FC = () => {
  const clips = [
    { id: 1, title: 'Chase High-Balance Cashout Proof', date: 'Oct 12, 2024', duration: '0:45', views: '2.4K', profit: '+$12,450.00' },
    { id: 2, title: 'Wells Fargo Business Wire Success', date: 'Oct 10, 2024', duration: '1:12', views: '1.8K', profit: '+$24,800.00' },
    { id: 3, title: 'PayPal Aged Account Transfer Proof', date: 'Oct 08, 2024', duration: '0:32', views: '4.2K', profit: '+$8,900.00' },
    { id: 4, title: 'BofA Corporate Account Payout', date: 'Oct 05, 2024', duration: '0:58', views: '1.2K', profit: '+$18,200.00' },
    { id: 5, title: 'TD Bank Personal App Success', date: 'Oct 02, 2024', duration: '1:05', views: '3.1K', profit: '+$6,400.00' },
    { id: 6, title: 'Cashout Clips: Daily Compilation', date: 'Sep 30, 2024', duration: '4:20', views: '8.4K', profit: 'Global Success' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Cashout Proof Gallery</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>Visual proof of successful cashouts and transfers from the KUDZNED marketplace.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ backgroundColor: '#ff00f2', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={18} />
             Upload Proof
          </button>
        </div>
      </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {clips.map((clip) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );
};

export default CashoutClips;
