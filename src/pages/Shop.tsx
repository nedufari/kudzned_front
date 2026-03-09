import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Filter, 
  Zap, 
  Star,
  Globe,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: '#0d0d12',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/shop/${product.id}`)}
      className="group"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: '#00f2ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: '700' }}>
          <Star size={14} fill="#f59e0b" />
          {product.rating}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{product.title}</h4>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b6b7d', fontWeight: '700' }}>
              <Globe size={14} />
              USA
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
              <Zap size={14} />
              Instant
           </div>
        </div>
        <p style={{ color: '#a0a0b8', fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', fontWeight: '800' }}>Starting From</p>
          <p style={{ fontSize: '20px', fontWeight: '950', color: '#10b981' }}>{product.price}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button 
              onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="hover:bg-white hover:text-black transition-all"
           >
              <ShoppingBag size={18} />
           </button>
           <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 16px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} className="group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
             Details
             <ArrowRight size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All Products');

  const products = [
    { id: 'bank-01', title: 'Chase High-Balance Personal Log', category: 'Bank Logs', price: '$450.00', rating: 4.9, description: 'Premium Chase personal account with high history and active balances. Fully checked and verified.' },
    { id: 'bank-02', title: 'Wells Fargo Business Credit Line', category: 'Bank Logs', price: '$850.00', rating: 5.0, description: 'Business accounts with pre-approved credit lines. Includes full business documentation.' },
    { id: 'trans-01', title: 'Global Swift Transfer (MT103)', category: 'Transfers', price: '$1,200.00', rating: 4.8, description: 'Fast global bank wires with guaranteed delivery. Maximum safety and encryption.' },
    { id: 'acc-01', title: 'Aged PayPal Business Account (2018)', category: 'Accounts', price: '$250.00', rating: 5.0, description: 'Highly trusted aged accounts with active balance and transaction history.' },
    { id: 'meth-01', title: 'BofA Cashout Method (Private)', category: 'Methods', price: '$150.00', rating: 4.7, description: 'Step-by-step guide on how to cash out BofA accounts safely in 2024.' },
    { id: 'acc-02', title: 'Crypto Exchange Verified (No KYC)', category: 'Accounts', price: '$350.00', rating: 4.9, description: 'Fully verified accounts for major exchanges without needing your personal identity.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Asset Marketplace</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>Browse and purchase premium digital assets securely.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px' }}>
            <Search size={18} color="#6b6b7d" />
            <input type="text" placeholder="Search logs, methods..." style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '14px', width: '100%' }} />
          </div>
          <button style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px' }}>
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
        {['All Products', 'Bank Logs', 'Transfers', 'Accounts', 'Methods', 'Fullz/SSN'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '14px', 
              backgroundColor: activeCategory === cat ? 'rgba(0, 242, 255, 0.1)' : '#0d0d12', 
              color: activeCategory === cat ? '#00f2ff' : '#a0a0b8', 
              border: activeCategory === cat ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid rgba(255,255,255,0.03)',
              fontWeight: '800',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
