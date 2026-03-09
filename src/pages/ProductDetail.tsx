import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  ShoppingCart,
  Star,
  Globe,
  Lock
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for a single product
  const product = {
    id: id || 'bank-01',
    title: 'Chase High-Balance Personal Log',
    category: 'Bank Logs',
    price: '$450.00',
    rating: 4.9,
    reviews: 124,
    description: 'Premium Chase personal account with high history and active balances. This log includes full access to the online banking portal, linked email, and security question answers.',
    features: [
      'Balance: $12,450.00 Verified',
      'Aged: 3+ Years',
      'Region: USA / New York',
      'Last Checked: 5 Minutes Ago',
      'Email Access: Included'
    ],
    specs: [
      { label: 'Network', value: 'Instant Delivery', icon: Zap },
      { label: 'Security', value: 'Safe & Anonymous', icon: ShieldCheck },
      { label: 'Region', value: 'USA Only', icon: Globe }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button 
        onClick={() => navigate('/shop')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
        className="hover:text-[#00f2ff]"
      >
        <ArrowLeft size={18} />
        Back to Shop
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.3fr 0.7fr))', gap: '40px' }} className="main-grid">
        {/* Left - Detail Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div>
                   <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: '#00f2ff', textTransform: 'uppercase', marginBottom: '16px', width: 'fit-content' }}>
                      {product.category}
                   </div>
                   <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '950', marginBottom: '16px' }}>{product.title}</h2>
                   <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '15px', fontWeight: '800' }}>
                         <Star size={18} fill="#f59e0b" />
                         {product.rating}
                      </div>
                      <div style={{ color: '#6b6b7d', fontSize: '15px', fontWeight: '700' }}>
                         {product.reviews} Reviews
                      </div>
                   </div>
                </div>
             </div>

             <p style={{ fontSize: '18px', color: '#a0a0b8', lineHeight: '1.6', marginBottom: '40px' }}>
                {product.description}
             </p>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                {product.specs.map((spec, i) => (
                   <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px' }}>
                         <spec.icon size={24} color="#00f2ff" />
                      </div>
                      <div>
                         <p style={{ fontSize: '12px', color: '#6b6b7d', fontWeight: '800', textTransform: 'uppercase' }}>{spec.label}</p>
                         <p style={{ fontSize: '15px', fontWeight: '800' }}>{spec.value}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
             <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Product Features</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {product.features.map((feat, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#a0a0b8' }}>{feat}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right - Pricing Sticky */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px', position: 'sticky', top: '24px' }}>
             <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', marginBottom: '24px' }}>Pricing Breakdown</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Item Price</span>
                   <span style={{ fontWeight: '700' }}>{product.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>+$0.00</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: '950' }}>
                   <span>Total</span>
                   <span style={{ color: '#00f2ff' }}>{product.price}</span>
                </div>
             </div>

             <button 
                onClick={() => navigate('/cart')}
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '18px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
             >
                <ShoppingCart size={20} />
                Add to Cart
             </button>
             <button 
                onClick={() => navigate('/success')}
                style={{ width: '100%', backgroundColor: '#00f2ff', color: '#000', padding: '18px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}
             >
                <Zap size={20} fill="currentColor" />
                Buy Now
             </button>
             <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b6b7d' }}>Secured by KUDZNED Escrow System</p>

             <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#a0a0b8', marginBottom: '16px' }}>Need help or custom orders?</p>
                <button style={{ width: '100%', backgroundColor: 'rgba(0, 242, 255, 0.05)', color: '#00f2ff', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                   <MessageSquare size={18} />
                   Contact Support
                </button>
             </div>
           </div>

           <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', borderRadius: '24px', padding: '24px', display: 'flex', gap: '16px' }}>
              <Lock size={24} color="#00f2ff" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#00f2ff', marginBottom: '4px' }}>Auto-Check Live</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8' }}>This item was auto-checked by our system and confirmed active 5 minutes ago.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
