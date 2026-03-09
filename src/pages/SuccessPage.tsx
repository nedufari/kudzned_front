import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '0 24px' }}>
       <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ type: 'spring', stiffness: 260, damping: 20 }}
         style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', color: '#10b981', boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' }}
       >
          <CheckCircle2 size={64} />
       </motion.div>

       <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
       >
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '950', marginBottom: '16px' }}>Payment Successful!</h2>
          <p style={{ fontSize: '18px', color: '#a0a0b8', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            We've received your payment. Your assets are now ready for access in your dashboard and have also been sent to your registered email.
          </p>
       </motion.div>

       <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.3 }}
         style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}
       >
          <button 
             onClick={() => navigate('/orders')}
             style={{ backgroundColor: '#00f2ff', color: '#000', padding: '16px 40px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
             View My Orders <ArrowRight size={20} />
          </button>
          <button 
             onClick={() => navigate('/dashboard')}
             style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '16px 40px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
          >
             Go to Dashboard
          </button>
       </motion.div>

       <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.4 }}
         style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '32px', 
            padding: '32px', 
            maxWidth: '1000px', 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            textAlign: 'left'
         }}
       >
          <div>
             <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '16px' }}>Transaction ID</h4>
             <p style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace' }}>TXN-9824-B1XC-CONFIRMED</p>
          </div>
          <div>
             <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '16px' }}>Voucher Status</h4>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '15px', fontWeight: '800' }}>
                <ShieldCheck size={18} />
                PLATFORM VERIFIED
             </div>
          </div>
          <div>
             <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '16px' }}>Action Required</h4>
             <button style={{ color: '#00f2ff', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Leave a Vouch & Earn $5 Credit 
                <TrendingUp size={16} />
             </button>
          </div>
       </motion.div>
    </div>
  );
};

export default SuccessPage;
