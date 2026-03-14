import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Calendar,
  User,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2
} from 'lucide-react';
import { api, VouchTag, VouchStatus, VouchHelpfulnessType } from '../services/api';
import type { Vouch } from '../services/api';

const VouchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vouch, setVouch] = useState<Vouch | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);

  // Helper function to convert enum values to readable labels
  const getTagLabel = (tag: VouchTag): string => {
    const labels: Record<VouchTag, string> = {
      [VouchTag.FAST_DELIVERY]: 'Fast Delivery',
      [VouchTag.HIGH_BALANCE]: 'High Balance',
      [VouchTag.SECURE]: 'Secure',
      [VouchTag.RELIABLE]: 'Reliable',
      [VouchTag.GOOD_SUPPORT]: 'Good Support',
      [VouchTag.EASY_CASHOUT]: 'Easy Cashout',
      [VouchTag.VERIFIED_SELLER]: 'Verified Seller'
    };
    return labels[tag] || tag;
  };

  useEffect(() => {
    const loadVouch = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await api.getVouch(id);
        setVouch(data);
      } catch (error) {
        console.error('Error loading vouch:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVouch();
  }, [id]);

  const handleMarkHelpful = async (helpful: boolean) => {
    if (!vouch || hasVotedHelpful) return;

    try {
      const voteType = helpful ? VouchHelpfulnessType.HELPFUL : VouchHelpfulnessType.NOT_HELPFUL;
      await api.voteVouchHelpfulness(vouch.id, voteType);
      setHasVotedHelpful(true);
      // Update local state
      setVouch(prev => prev ? {
        ...prev,
        helpful_count: helpful ? prev.helpful_count + 1 : prev.helpful_count,
        not_helpful_count: !helpful ? prev.not_helpful_count + 1 : prev.not_helpful_count
      } : null);
    } catch (error) {
      console.error('Error marking vouch helpful:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ color: '#6b6b7d', fontSize: '16px' }}>Loading vouch...</div>
      </div>
    );
  }

  if (!vouch) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={32} color="#6b6b7d" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Vouch not found</h4>
          <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '24px' }}>
            This vouch may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate('/vouches')}
            className="btn-primary"
          >
            Back to Vouches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button 
        onClick={() => navigate('/vouches')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
      >
        <ArrowLeft size={18} />
        Back to Vouches
      </button>

      <div className="main-grid">
        {/* Left - Vouch Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={30} color="#00f2ff" />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{vouch.user.username}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b6b7d', fontSize: '14px' }}>
                         <Calendar size={14} />
                         {new Date(vouch.created_at).toLocaleDateString()}
                      </div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star 
                          key={i} 
                          size={18} 
                          fill={i <= vouch.rating ? "#f59e0b" : "transparent"} 
                          color={i <= vouch.rating ? "#f59e0b" : "#374151"} 
                        />
                      ))}
                   </div>
                   <span className={vouch.status === VouchStatus.APPROVED ? 'tag-green' : 'tag-gray'}>
                     {vouch.status === VouchStatus.APPROVED ? 'Verified Purchase' : 'Pending Review'}
                   </span>
                </div>
             </div>

             <div style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '20px', color: '#a0a0b8', lineHeight: '1.6', fontStyle: 'italic' }}>
                   "{vouch.comment}"
                </p>
             </div>

             {vouch.tags.length > 0 && (
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
                  {vouch.tags.map((tag, i) => (
                     <span key={i} className="tag tag-cyan">
                        #{getTagLabel(tag)}
                     </span>
                  ))}
               </div>
             )}

             {/* Action Buttons */}
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
               <button
                 onClick={() => handleMarkHelpful(true)}
                 disabled={hasVotedHelpful}
                 className={hasVotedHelpful ? 'btn-ghost' : 'btn-ghost'}
                 style={{
                   padding: '8px 16px',
                   fontSize: '12px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px',
                   backgroundColor: hasVotedHelpful ? 'rgba(16,185,129,0.1)' : undefined,
                   color: hasVotedHelpful ? '#10b981' : undefined
                 }}
               >
                 <ThumbsUp size={14} />
                 Helpful ({vouch.helpful_count})
               </button>
               <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '12px' }}>
                 <Share2 size={14} />
               </button>
               <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '12px' }}>
                 <Flag size={14} />
               </button>
             </div>
          </div>

          {/* Proof Image */}
          {vouch.proof_image_url && (
            <div className="card">
               <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#00f2ff" />
                  Proof Snapshot
               </h4>
               <img 
                 src={vouch.proof_image_url} 
                 alt="Proof of purchase" 
                 style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }} 
               />
               <p style={{ textAlign: 'center', color: '#6b6b7d', fontSize: '12px', marginTop: '16px' }}>
                 Snapshot uploaded by {vouch.user.username} on {new Date(vouch.created_at).toLocaleDateString()}
               </p>
            </div>
          )}
        </div>

        {/* Right - Product linked info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="card">
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Product Reviewed</h4>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>{vouch.product.name}</p>
                 <p style={{ fontSize: '12px', color: '#6b6b7d', marginBottom: '12px', textTransform: 'uppercase' }}>
                   {vouch.product.category}
                 </p>
                 <button 
                  onClick={() => navigate(`/shop/${vouch.product_id}`)}
                  style={{ color: '#00f2ff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                 >
                    View in Marketplace
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           {vouch.helpful_count > 0 && (
             <div className="card" style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', textAlign: 'center' }}>
                <ThumbsUp size={32} color="#10b981" style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>Helpful Review</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8' }}>
                  {vouch.helpful_count} {vouch.helpful_count === 1 ? 'person' : 'people'} found this review helpful.
                </p>
             </div>
           )}

           {/* User Stats */}
           <div className="card">
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px' }}>Reviewer Info</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#00f2ff" />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '800' }}>{vouch.user.username}</p>
                  <p className={vouch.user.verified ? 'tag-green' : 'tag-gray'} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px' }}>
                    {vouch.user.verified ? 'Verified User' : 'Unverified User'}
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VouchDetail;