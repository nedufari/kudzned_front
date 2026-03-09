import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock cart items
  const cartItems = [
    { id: 'bank-01', title: 'Chase High-Balance Personal Log', category: 'Bank Logs', price: '$450.00', quantity: 1 },
    { id: 'meth-01', title: 'BofA Cashout Method (Private)', category: 'Methods', price: '$150.00', quantity: 1 }
  ];

  const subtotal = 600;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/shop')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
          className="hover:text-[#00f2ff]"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>
        <h3 style={{ fontSize: '24px', fontWeight: '900' }}>Your Shopping Cart</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.3fr 0.7fr))', gap: '40px' }} className="main-grid">
        {/* Left - Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '24px', 
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(0, 242, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <ShoppingCart size={28} color="#00f2ff" />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#00f2ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '900', marginTop: '4px' }}>{item.price}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>{item.quantity}</span>
                   </div>
                   <button style={{ color: '#ff4b4b', padding: '10px', backgroundColor: 'rgba(255,75,75,0.1)', borderRadius: '12px' }}>
                      <Trash2 size={20} />
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#0d0d12', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <ShoppingCart size={64} color="#6b6b7d" style={{ marginBottom: '24px' }} />
               <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Your cart is empty</h4>
               <p style={{ color: '#a0a0b8', marginBottom: '32px' }}>Explore the marketplace and find premium assets to trade.</p>
               <button onClick={() => navigate('/shop')} style={{ backgroundColor: '#00f2ff', color: '#000', padding: '14px 32px', borderRadius: '14px', fontWeight: '900' }}>Browse Shop</button>
            </div>
          )}
        </div>

        {/* Right - Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px' }}>
             <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Order Summary</h4>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Items ({cartItems.length})</span>
                   <span style={{ fontWeight: '700' }}>${subtotal}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '950' }}>
                   <span>Total</span>
                   <span style={{ color: '#00f2ff' }}>${subtotal}.00</span>
                </div>
             </div>

             <button 
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', backgroundColor: '#00f2ff', color: '#000', padding: '18px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}
              >
                Checkout <ArrowRight size={20} />
             </button>
             <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b6b7d' }}>Taxes and fees calculated at checkout.</p>
          </div>

          <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', borderRadius: '24px', padding: '24px', display: 'flex', gap: '16px' }}>
             <ShieldCheck size={24} color="#00f2ff" style={{ flexShrink: 0 }} />
             <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#00f2ff', marginBottom: '4px' }}>Buyer Protection</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8' }}>Every transaction is secured by KUDZNED Escrow system. Guaranteed or money back.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
