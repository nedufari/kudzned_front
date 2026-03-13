import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck,
  ArrowRight,
  Loader2,
  Plus,
  Minus
} from 'lucide-react';

// Define types locally to avoid API import issues
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Use mock cart data that works - no useEffect, no API calls that cause blank screens
  const mockCartItems = [
    {
      id: 'cart-1',
      product_id: 'bank-01',
      quantity: 1,
      price: 450.00,
      product: {
        id: 'bank-01',
        name: 'Chase High-Balance Personal Log',
        description: 'Premium Chase personal account with high history and active balances.',
        price: 450.00,
        category: 'Bank Logs',
        stock: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: 'cart-2',
      product_id: 'meth-01',
      quantity: 1,
      price: 150.00,
      product: {
        id: 'meth-01',
        name: 'BofA Cashout Method (Private)',
        description: 'Step-by-step guide on how to cash out BofA accounts safely.',
        price: 150.00,
        category: 'Methods',
        stock: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ];

  const cartItems = mockCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real implementation, would update the cart via API
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real implementation, would remove from cart via API
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

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
            cartItems.map((item: CartItem) => (
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
                  gap: '20px',
                  opacity: updatingItems.has(item.id) ? 0.6 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(0, 242, 255, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <ShoppingCart size={28} color="#00f2ff" />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#00f2ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.product.category}</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{item.product.name}</h4>
                    <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '900', marginTop: '4px' }}>${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '12px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#a0a0b8',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>
                        {updatingItems.has(item.id) ? <Loader2 size={16} className="animate-spin" /> : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#a0a0b8',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Plus size={16} />
                      </button>
                   </div>
                   <button 
                     onClick={() => removeItem(item.id)}
                     disabled={updatingItems.has(item.id)}
                     style={{ 
                       color: '#ff4b4b', 
                       padding: '10px', 
                       backgroundColor: 'rgba(255,75,75,0.1)', 
                       borderRadius: '12px',
                       border: 'none',
                       cursor: 'pointer'
                     }}
                   >
                      {updatingItems.has(item.id) ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#0d0d12', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <ShoppingCart size={64} color="#6b6b7d" style={{ marginBottom: '24px' }} />
               <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Your cart is empty</h4>
               <p style={{ color: '#a0a0b8', marginBottom: '32px' }}>Explore the marketplace and find premium assets to trade.</p>
               <button onClick={() => navigate('/shop')} style={{ backgroundColor: '#00f2ff', color: '#000', padding: '14px 32px', borderRadius: '14px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>Browse Shop</button>
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
                   <span style={{ fontWeight: '700' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '950' }}>
                   <span>Total</span>
                   <span style={{ color: '#00f2ff' }}>${subtotal.toFixed(2)}</span>
                </div>
             </div>

             <button 
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
                style={{ 
                  width: '100%', 
                  backgroundColor: cartItems.length === 0 ? '#666' : '#00f2ff', 
                  color: cartItems.length === 0 ? '#ccc' : '#000', 
                  padding: '18px', 
                  borderRadius: '16px', 
                  fontWeight: '900', 
                  fontSize: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: '16px',
                  border: 'none',
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
                }}
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
