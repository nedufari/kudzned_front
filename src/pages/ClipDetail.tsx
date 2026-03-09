import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Play, 
  Calendar, 
  Eye, 
  Share2, 
  DollarSign, 
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Video
} from 'lucide-react';
import { motion } from 'framer-motion';

const ClipDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for a single clip
  const clip = {
    id: id || '1',
    title: 'Chase High-Balance Cashout Proof',
    date: 'Oct 12, 2024',
    duration: '0:45',
    views: '2,482',
    profit: '+$12,450.00',
    description: 'Successful cashout of a Chase personal log with $12k+ balance. Using our private RDP and proxy setup. Funds were transferred to a clean crypto bridge in under 45 seconds.',
    thumbnail: 'https://images.unsplash.com/photo-1542382257-80dee2700140?auto=format&fit=crop&q=80&w=1200',
    tags: ['Chase', 'Cashout', 'Proof', 'Live']
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button 
        onClick={() => navigate('/cashout-clips')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
        className="hover:text-[#00f2ff]"
      >
        <ArrowLeft size={18} />
        Back to Gallery
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.3fr 0.7fr))', gap: '40px' }} className="main-grid">
        {/* Left - Video Player & Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', overflow: 'hidden' }}>
             <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={clip.thumbnail} alt="Video Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0, 242, 255, 0.4)' }}>
                        <Play size={40} fill="currentColor" />
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                   {clip.duration}
                </div>
             </div>
             
             <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <h2 style={{ fontSize: '28px', fontWeight: '900' }}>{clip.title}</h2>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}><Share2 size={20} /></button>
                      <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}><TrendingUp size={20} /></button>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px', fontWeight: '700' }}>
                      <Calendar size={16} />
                      {clip.date}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px', fontWeight: '700' }}>
                      <Eye size={16} />
                      {clip.views} Views
                   </div>
                </div>

                <p style={{ fontSize: '18px', color: '#a0a0b8', lineHeight: '1.6', marginBottom: '32px' }}>{clip.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                   {clip.tags.map(tag => (
                      <span key={tag} style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', color: '#00f2ff', padding: '6px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>
                         #{tag}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right - Stats & Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#10b981' }}>
                 <DollarSign size={32} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Profit</h4>
              <p style={{ fontSize: '32px', fontWeight: '950', color: '#10b981' }}>{clip.profit}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: '800', marginTop: '12px' }}>
                 <ShieldCheck size={16} />
                 PLATFORM VERIFIED
              </div>
           </div>

           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Item Mentioned</h4>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>Chase High-Balance Personal Log</p>
                 <button 
                  onClick={() => navigate('/shop/bank-01')}
                  style={{ color: '#00f2ff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                 >
                    View in Marketplace
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           <div style={{ backgroundColor: 'rgba(255, 0, 242, 0.05)', border: '1px solid rgba(255, 0, 242, 0.1)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: '800', color: '#ff00f2', marginBottom: '16px' }}>Want to share proof?</p>
              <button style={{ width: '100%', backgroundColor: '#ff00f2', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 <Video size={18} />
                 Upload Proof
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClipDetail;
