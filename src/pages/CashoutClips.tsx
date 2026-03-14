import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play,
  Video, 
  Calendar, 
  Eye, 
  DollarSign,
  ChevronRight,
  Search,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api, CashoutClipType, CashoutClipStatus } from '../services/api';
import type { CashoutClip } from '../services/api';

const CashoutClips: React.FC = () => {
  const navigate = useNavigate();
  const [clips, setClips] = useState<CashoutClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadClips = async () => {
    setLoading(true);
    try {
      const data = await api.getClips({ 
        sort_by: 'created_at', 
        sort_order: 'DESC', 
        limit: 20,
        status: CashoutClipStatus.APPROVED // Only show approved clips
      });
      setClips(data);
    } catch (error) {
      console.error('Error loading clips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClips();
  }, []);

  const filteredClips = clips.filter(clip => 
    searchQuery === '' || 
    clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.payment_method?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = clips.reduce((sum, clip) => sum + clip.views_count, 0);
  const totalAmount = clips.reduce((sum, clip) => sum + clip.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Cashout Proof Gallery</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>Visual proof of successful cashouts and transfers from the KUDZNED marketplace.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '10px 16px', borderRadius: '14px', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} />
            ${totalAmount.toLocaleString()} Total Proven
          </div>
          <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', color: '#00f2ff', padding: '10px 16px', borderRadius: '14px', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} />
            {totalViews.toLocaleString()} Views
          </div>
          <button
            onClick={() => navigate('/cashout-clips/upload')}
            style={{ backgroundColor: '#ff00f2', color: 'white', padding: '10px 24px', borderRadius: '14px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Video size={18} />
             Upload Proof
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '500px' }}>
        <Search size={20} color="#6b6b7d" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search clips, titles, or users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div style={{ color: '#6b6b7d', fontSize: '16px' }}>Loading clips...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredClips.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={32} color="#6b6b7d" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No clips found</h4>
            <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '24px' }}>
              {searchQuery ? 'Try adjusting your search' : 'Be the first to share your cashout proof'}
            </p>
            <button
              onClick={() => navigate('/cashout-clips/upload')}
              style={{ backgroundColor: '#ff00f2', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
            >
              Upload First Clip
            </button>
          </div>
        </div>
      )}

      {/* Clips Grid */}
      {!loading && filteredClips.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredClips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
    </div>
  );
};

const ClipCard = ({ clip }: { clip: CashoutClip }) => {
  const navigate = useNavigate();
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatAmount = (amount: number) => {
    return `+$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCashoutTypeLabel = (type: CashoutClipType): string => {
    const labels: Record<CashoutClipType, string> = {
      [CashoutClipType.BANK_TRANSFER]: 'Bank Transfer',
      [CashoutClipType.CRYPTO_WITHDRAWAL]: 'Crypto',
      [CashoutClipType.PAYPAL]: 'PayPal',
      [CashoutClipType.CASHAPP]: 'CashApp',
      [CashoutClipType.VENMO]: 'Venmo',
      [CashoutClipType.ZELLE]: 'Zelle',
      [CashoutClipType.WIRE_TRANSFER]: 'Wire Transfer',
      [CashoutClipType.CHECK]: 'Check',
      [CashoutClipType.OTHER]: 'Other'
    };
    return labels[type] || type;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/cashout-clips/${clip.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', height: '200px', width: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#16161e', marginBottom: '20px' }}>
        <img 
          src={clip.thumbnail_url || `https://images.unsplash.com/photo-1542382257-80dee2700140?auto=format&fit=crop&q=80&w=600&h=400&sig=${clip.id}`} 
          alt="Video thumbnail" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0d0d12, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#00f2ff', color: '#000', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }}>
            <Play size={24} fill="currentColor" />
          </div>
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: 'white' }}>
          {formatDuration(clip.duration_seconds)}
        </div>
      </div>

      <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{clip.title}</h4>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#6b6b7d', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <Calendar size={14} />
           {new Date(clip.created_at).toLocaleDateString()}
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <Eye size={14} />
           {formatViews(clip.views_count)} Views
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
             <p style={{ fontSize: '10px', color: '#6b6b7d', textTransform: 'uppercase' }}>Amount Cashed Out</p>
             <p style={{ fontSize: '15px', fontWeight: '900', color: '#10b981' }}>{formatAmount(clip.amount)}</p>
           </div>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '4px' }}>
           <span style={{ fontSize: '10px', color: '#6b6b7d', textTransform: 'uppercase' }}>
             {getCashoutTypeLabel(clip.cashout_type)}
           </span>
           <span style={{ fontSize: '11px', color: '#6b6b7d', fontWeight: '700' }}>
             by {clip.user.username}
           </span>
           <ChevronRight size={18} color="#00f2ff" />
         </div>
      </div>
    </motion.div>
  );
};

export default CashoutClips;