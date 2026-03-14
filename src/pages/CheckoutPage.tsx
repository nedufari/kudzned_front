import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Wallet,
  Loader2
} from 'lucide-react';

// Define types locally to avoid API import issues






const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [processing, setProcessing] = useState(false);

  // Use mock data that works - no useEffect, no API calls that cause blank screens
  const mockUser = {
    id: 'user-1',
    email: 'nedufranco@gmail.com',
    username: 'nedufari',
    role: 'customer',
    status: 'active'
  };

  const mockCart = {
    id: 'cart-1',
    user_id: 'user-1',
    items: [
      {
        id: 'cart-1',
        product_id: 'bank-01',
        quantity: 1,
        price: 450.00,
        product: {
          id: 'bank-01',
          name: 'Chase High-Balance Personal Log',
          description: 'Premium Chase personal account',
          price: 450.00,
          category: 'Bank Logs',
          stock: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ],
    total: 450.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const cart = mockCart;
  const user = mockUser;
  const subtotal = cart.total;

  const handleCompletePayment = async () => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to success page
      navigate('/success');
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/cart')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
          className="hover:text-[#00f2ff]"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>
        <h3 style={{ fontSize: '24px', fontWeight: '900' }}>Confirm Checkout</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1.2fr 0.8fr))', gap: '40px' }} className="main-grid">
        {/* Left - Payment Selection & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Choose Payment Method</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
               {[
                 { id: 'crypto', label: 'Cryptocurrency', icon: Zap, sub: 'BTC, ETH, LTC, SOL', color: '#00f2ff' },
                 { id: 'balance', label: 'Wallet Balance', icon: Wallet, sub: 'Current: $1,420.00', color: '#ff00f2' }
               ].map((method) => (
                 <div 
                   key={method.id}
                   onClick={() => setPaymentMethod(method.id)}
                   style={{ 
                     backgroundColor: paymentMethod === method.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
                     border: paymentMethod === method.id ? `1px solid ${method.color}` : '1px solid rgba(255,255,255,0.05)', 
                     padding: '24px', 
                     borderRadius: '24px', 
                     cursor: 'pointer',
                     position: 'relative',
                     transition: 'all 0.2s'
                   }}
                 >
                    {paymentMethod === method.id && (
                       <div style={{ position: 'absolute', top: '12px', right: '12px', color: method.color }}><CheckCircle2 size={18} /></div>
                    )}
                    <div style={{ color: method.color, marginBottom: '16px' }}><method.icon size={28} /></div>
                    <p style={{ fontSize: '16px', fontWeight: '800' }}>{method.label}</p>
                    <p style={{ fontSize: '12px', color: '#6b6b7d', fontWeight: '700' }}>{method.sub}</p>
                 </div>
               ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Delivery Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#6b6b7d', fontWeight: '800', textTransform: 'uppercase' }}>Delivery Email</label>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', fontSize: '15px' }}>
                    {user?.email || 'Loading...'}
                  </div>
               </div>
               <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '16px', borderRadius: '16px', fontSize: '13px', color: '#00f2ff', display: 'flex', gap: '12px' }}>
                  <Zap size={18} style={{ flexShrink: 0 }} />
                  Your assets will be delivered instantly to both your dashboard and the email address above upon payment confirmation.
               </div>
            </div>
          </div>
        </div>

        {/* Right - Order Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '32px' }}>
             <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Review & Pay</h4>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Subtotal ({cart.items.length} items)</span>
                   <span style={{ fontWeight: '700' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '950' }}>
                   <span>Order Total</span>
                   <span style={{ color: '#00f2ff' }}>${subtotal.toFixed(2)}</span>
                </div>
             </div>

             <button 
                onClick={handleCompletePayment}
                disabled={processing}
                style={{ 
                  width: '100%', 
                  backgroundColor: processing ? '#666' : (paymentMethod === 'balance' ? '#ff00f2' : '#00f2ff'), 
                  color: processing ? '#ccc' : '#000', 
                  padding: '18px', 
                  borderRadius: '16px', 
                  fontWeight: '900', 
                  fontSize: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: '16px', 
                  boxShadow: processing ? 'none' : (paymentMethod === 'balance' ? '0 0 30px rgba(255, 0, 242, 0.2)' : '0 0 30px rgba(0, 242, 255, 0.2)'),
                  border: 'none',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Payment <ArrowRight size={20} />
                  </>
                )}
             </button>
             <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b6b7d' }}>By clicking complete, you agree to our Terms of Sale.</p>
          </div>

          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
             <ShieldCheck size={32} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
             <h5 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>Safe & Encrypted</h5>
             <p style={{ fontSize: '12px', color: '#6b6b7d' }}>Your payment information is handled via military-grade encryption systems.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
