import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  User, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { Vouch } from '../services/api';

const VouchCard = ({ vouch }: { vouch: Vouch }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/vouches/${vouch.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="#00f2ff" />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{vouch.user.username}</h4>
            <span className={vouch.verified ? 'tag-green' : 'tag-gray'} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px' }}>
              {vouch.verified ? 'Verified Buyer' : 'Unverified'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star 
              key={i} 
              size={14} 
              fill={i <= vouch.rating ? "#f59e0b" : "transparent"} 
              color={i <= vouch.rating ? "#f59e0b" : "#374151"} 
            />
          ))}
        </div>
      </div>

      <p style={{ color: '#a0a0b8', fontSize: '14px', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
        "{vouch.comment}"
      </p>

      {vouch.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {vouch.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag tag-cyan">
              {tag}
            </span>
          ))}
          {vouch.tags.length > 3 && (
            <span style={{ color: '#6b6b7d', fontSize: '10px', fontWeight: '700' }}>
              +{vouch.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Calendar size={14} color="#6b6b7d" />
           <span style={{ fontSize: '12px', color: '#6b6b7d', fontWeight: '700' }}>
             {new Date(vouch.created_at).toLocaleDateString()}
           </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {vouch.helpful_count > 0 && (
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
              {vouch.helpful_count} helpful
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00f2ff', fontSize: '12px', fontWeight: '800' }}>
             Details <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Vouches: React.FC = () => {
  const navigate = useNavigate();
  const [vouches, setVouches] = useState<Vouch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVouches = async () => {
    setLoading(true);
    try {
      const data = await api.getVouches({ 
        sort_by: 'date', 
        sort_order: 'desc',
        limit: 20 
      });
      setVouches(data);
    } catch (error) {
      console.error('Error loading vouches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouches();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleVouchCreated = () => loadVouches();
    const handleVouchUpdated = () => loadVouches();
    const handleVouchDeleted = () => loadVouches();

    window.addEventListener('vouchCreated', handleVouchCreated);
    window.addEventListener('vouchUpdated', handleVouchUpdated);
    window.addEventListener('vouchDeleted', handleVouchDeleted);

    return () => {
      window.removeEventListener('vouchCreated', handleVouchCreated);
      window.removeEventListener('vouchUpdated', handleVouchUpdated);
      window.removeEventListener('vouchDeleted', handleVouchDeleted);
    };
  }, []);

  const filteredVouches = vouches.filter(vouch => 
    searchQuery === '' || 
    vouch.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vouch.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vouch.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVerifiedVouches = vouches.filter(v => v.verified).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>User Vouches</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>See what our community has to say about their experience.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
           <div className="tag tag-green" style={{ padding: '10px 20px', fontSize: '14px' }}>
              <CheckCircle2 size={18} />
              {totalVerifiedVouches} Verified Vouches
           </div>
           <button
             onClick={() => navigate('/vouches/create')}
             className="btn-secondary"
           >
             <Plus size={18} />
             Write Vouch
           </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '500px' }}>
        <Search size={20} color="#6b6b7d" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search vouches, users, or products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '48px' }}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div style={{ color: '#6b6b7d', fontSize: '16px' }}>Loading vouches...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVouches.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={32} color="#6b6b7d" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No vouches found</h4>
            <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '24px' }}>
              {searchQuery ? 'Try adjusting your search' : 'Be the first to share your experience'}
            </p>
            <button
              onClick={() => navigate('/vouches/create')}
              className="btn-primary"
            >
              Write First Vouch
            </button>
          </div>
        </div>
      )}

      {/* Vouches Grid */}
      {!loading && filteredVouches.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredVouches.map((vouch) => (
            <VouchCard key={vouch.id} vouch={vouch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vouches;