import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Play, 
  Calendar, 
  Eye, 
  Share2, 
  DollarSign, 
  Video,
  User,
  Flag
} from 'lucide-react';
import { api } from '../services/api';
import type { CashoutClip } from '../services/api';

const ClipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clip, setClip] = useState<CashoutClip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClip = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await api.getClip(id);
        setClip(data);
      } catch (error) {
        console.error('Error loading clip:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClip();
  }, [id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    return views.toLocaleString();
  };

  const formatProfit = (amount: number) => {
    return `+$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ color: '#6b6b7d', fontSize: '16px' }}>Loading clip...</div>
      </div>
    );
  }
  if (!clip) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Video size={32} color="#6b6b7d" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Clip not found</h4>
          <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '24px' }}>
            This clip may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate('/cashout-clips')}
            className="btn-secondary"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button 
        onClick={() => navigate('/cashout-clips')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
      >
        <ArrowLeft size={18} />
        Back to Gallery
      </button>

      <div className="main-grid">
        {/* Left - Video Player & Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
             <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={clip.thumbnail_url || `https://images.unsplash.com/photo-1542382257-80dee2700140?auto=format&fit=crop&q=80&w=1200`} 
                  alt="Video Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0, 242, 255, 0.4)' }}>
                        <Play size={40} fill="currentColor" />
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                   {formatDuration(clip.duration)}
                </div>
             </div>
             
             <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                   <div style={{ flex: 1 }}>
                     <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>{clip.title}</h2>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <User size={12} color="#00f2ff" />
                         </div>
                         <span style={{ fontSize: '14px', fontWeight: '700', color: '#a0a0b8' }}>
                           {clip.user.username}
                         </span>
                         {clip.user.verified && (
                           <ShieldCheck size={14} color="#10b981" />
                         )}
                       </div>
                     </div>
                   </div>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-ghost" style={{ padding: '10px' }}><Share2 size={20} /></button>
                      <button className="btn-ghost" style={{ padding: '10px' }}><Flag size={20} /></button>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px', fontWeight: '700' }}>
                      <Calendar size={16} />
                      {new Date(clip.created_at).toLocaleDateString()}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px', fontWeight: '700' }}>
                      <Eye size={16} />
                      {formatViews(clip.view_count)} Views
                   </div>
                </div>

                {clip.description && (
                  <p style={{ fontSize: '18px', color: '#a0a0b8', lineHeight: '1.6', marginBottom: '32px' }}>
                    {clip.description}
                  </p>
                )}
                
                {clip.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                     {clip.tags.map(tag => (
                        <span key={tag} className="tag tag-pink">
                           #{tag}
                        </span>
                     ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right - Stats & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#10b981' }}>
                 <DollarSign size={32} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Profit</h4>
              <p style={{ fontSize: '32px', fontWeight: '950', color: '#10b981' }}>{formatProfit(clip.profit_amount)}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: '800', marginTop: '12px' }}>
                 <ShieldCheck size={16} />
                 PLATFORM VERIFIED
              </div>
           </div>

           {/* Video Stats */}
           <div className="card">
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Video Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b6b7d' }}>Duration</span>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>{formatDuration(clip.duration)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b6b7d' }}>Views</span>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>{formatViews(clip.view_count)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b6b7d' }}>Uploaded</span>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>{new Date(clip.created_at).toLocaleDateString()}</span>
                </div>
              </div>
           </div>

           {/* Creator Info */}
           <div className="card">
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Creator</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#00f2ff" />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '800' }}>{clip.user.username}</p>
                  <p className={clip.user.verified ? 'tag-green' : 'tag-gray'} style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '8px' }}>
                    {clip.user.verified ? 'Verified Creator' : 'Unverified User'}
                  </p>
                </div>
              </div>
           </div>

           {/* Upload CTA */}
           <div className="card" style={{ backgroundColor: 'rgba(255, 0, 242, 0.05)', border: '1px solid rgba(255, 0, 242, 0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: '800', color: '#ff00f2', marginBottom: '16px' }}>Want to share proof?</p>
              <button 
                onClick={() => navigate('/cashout-clips/upload')}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
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