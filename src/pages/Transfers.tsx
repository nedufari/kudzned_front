import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  Banknote, 
  ShieldCheck, 
  Globe, 
  AlertTriangle,
  Send,
  Building2,
  Hash,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

const TransferForm = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <motion.form 
      onSubmit={handleSend}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        backgroundColor: '#0d0d12', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '32px', 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Name</label>
          <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={18} color="#00f2ff" />
            <input type="text" placeholder="e.g. Chase Bank, Wells Fargo" style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Type</label>
          <select style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', color: 'white', cursor: 'pointer', fontSize: '16px', outline: 'none' }}>
            <option>Personal Checking</option>
            <option>Business Savings</option>
            <option>Corporate Access</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Routing Number</label>
          <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash size={18} color="#a0a0b8" />
            <input type="text" placeholder="9-digit routing" style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Number</label>
          <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash size={16} color="#a0a0b8" />
            <input type="text" placeholder="Full account number" style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '700', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transfer Amount</label>
        <div style={{ backgroundColor: '#16161e', border: '2px solid rgba(0, 242, 255, 0.2)', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(0, 242, 255, 0.05)', borderRadius: '12px', color: '#00f2ff' }}>
            <DollarSign size={24} />
          </div>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" 
            style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '32px', fontWeight: '900' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: '20px', padding: '20px' }}>
        <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '13px', color: '#a0a0b8' }}>
          <strong style={{ color: '#f59e0b' }}>Warning:</strong> Check all details carefully. Once initiated, transfers are processed instantly and cannot be reversed. Support fees of 2% apply.
        </p>
      </div>

      <button 
        type="submit" 
        style={{ 
          backgroundColor: '#00f2ff', 
          color: '#000', 
          padding: '20px', 
          borderRadius: '16px', 
          fontWeight: '900', 
          fontSize: '18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Processing Access...' : 'Initiate Secure Transfer'}
        {!isLoading && <Send size={20} />}
      </button>
    </motion.form>
  );
};

const Transfers: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
      <div>
        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Global Bank Transfer</h3>
        <p style={{ color: '#a0a0b8', fontSize: '15px' }}>Send funds securely to any bank account worldwide. Delivery within 2-4 hours.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Verified Delivery', icon: ShieldCheck, color: '#10b981' },
          { label: 'Instant Clearing', icon: Send, color: '#00f2ff' },
          { label: 'Global Access', icon: Globe, color: '#ff00f2' }
        ].map((item, i) => (
          <div key={i} style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <item.icon size={20} color={item.color} />
            <span style={{ fontSize: '14px', fontWeight: '700' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <TransferForm />
    </div>
  );
};

export default Transfers;
