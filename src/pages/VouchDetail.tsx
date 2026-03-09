import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Calendar,
  User,
  ExternalLink,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const VouchDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for a single vouch
  const vouch = {
    id: id || 'VCH-229-X',
    user: 'Nedu Franco',
    date: 'Oct 14, 2024',
    rating: 5,
    comment: 'Just finished my first high-balance log purchase. The delivery was instant and the balance was exactly as advertised. I checked the log with a dedicated RDP and it was completely live. Highly recommend KUDZNED for anyone looking for reliability.',
    product: 'Chase High-Balance Personal Log',
    proofImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
    verified: true,
    tags: ['Fast Delivery', 'High Balance', 'Secure']
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button 
        onClick={() => navigate('/vouches')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
        className="hover:text-[#00f2ff]"
      >
        <ArrowLeft size={18} />
        Back to Vouches
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.2fr 0.8fr))', gap: '40px' }} className="main-grid">
        {/* Left - Vouch Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={30} color="#00f2ff" />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{vouch.user}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px' }}>
                         <Calendar size={14} />
                         {vouch.date}
                      </div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
                   </div>
                   <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>Verified Purchase</span>
                </div>
             </div>

             <div style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '20px', color: '#a0a0b8', lineHeight: '1.6', fontStyle: 'italic' }}>
                   "{vouch.comment}"
                </p>
             </div>

             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {vouch.tags.map((tag, i) => (
                   <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                      {tag}
                   </span>
                ))}
             </div>
          </div>

          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
             <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#00f2ff" />
                Proof Snapshot
             </h4>
             <img 
               src={vouch.proofImage} 
               alt="Proof of purchase" 
               style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }} 
             />
             <p style={{ textAlign: 'center', color: '#6b6b7d', fontSize: '12px', marginTop: '16px' }}>Snapshot taken on {vouch.date} by user.</p>
          </div>
        </div>

        {/* Right - Product linked info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Item Mentioned</h4>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>{vouch.product}</p>
                 <button 
                  onClick={() => navigate('/shop/bank-01')}
                  style={{ color: '#00f2ff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                 >
                    View in Marketplace
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           <div style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
              <ThumbsUp size={32} color="#10b981" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>Helpful Review</p>
              <p style={{ fontSize: '12px', color: '#a0a0b8' }}>14 people found this review helpful.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VouchDetail;
