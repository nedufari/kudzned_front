import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from '../utils/toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    category_id?: string;
    stock: number;
    image_url?: string;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);

  // Load cart data automatically
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log('Loading cart from API...');
        const cartData = await api.getCart();
        console.log('Cart loaded:', cartData);
        
        setCart(cartData);
      } catch (error) {
        console.error('Failed to load cart:', error);
        toast.error('Failed to load cart');
        
        // Fallback to empty cart
        setCart({
          id: 'empty',
          user_id: 'unknown',
          items: [],
          total: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Refresh cart data
  const refreshCart = async () => {
    setLoading(true);
    try {
      const cartData = await api.getCart();
      setCart(cartData);
      toast.success(`Cart refreshed with ${cartData.items.length} items!`);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      toast.error('Failed to refresh cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const updatedCart = await api.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const updatedCart = await api.updateCartItem(itemId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Handle checkout with balance validation
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setCheckingOut(true);
    try {
      console.log('Starting checkout process...');
      const order = await api.checkout(cart);
      console.log('Order created:', order);
      
      toast.success('Order placed successfully!');
      
      // Navigate to success page or order detail
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      // Error toast is already shown by the API client
    } finally {
      setCheckingOut(false);
    }
  };

  // Show loading state
  if (loading && !cart) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px', 
        gap: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(16px, 4vw, 20px)',
        textAlign: 'center'
      }}>
        <button 
          onClick={() => navigate('/shop')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#a0a0b8', 
            fontWeight: '700', 
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>

        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ 
            fontSize: 'clamp(20px, 5vw, 24px)', 
            fontWeight: '900', 
            marginBottom: 'clamp(8px, 2vw, 12px)' 
          }}>
            Loading Cart...
          </h3>
          <p style={{ 
            color: '#a0a0b8', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            lineHeight: '1.4',
            maxWidth: '400px'
          }}>
            Fetching your cart items from the API
          </p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Cart not found</h3>
        <button onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 6vw, 32px)' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(12px, 3vw, 16px)'
      }}>
        <button 
          onClick={() => navigate('/shop')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#a0a0b8', 
            fontWeight: '700', 
            fontSize: 'clamp(12px, 3vw, 14px)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>
        <h3 style={{ 
          fontSize: 'clamp(20px, 5vw, 24px)', 
          fontWeight: '900',
          textAlign: 'center'
        }}>
          Your Shopping Cart
        </h3>
        <button 
          onClick={refreshCart}
          disabled={loading}
          style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '8px 12px', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontWeight: '700', 
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
        gap: 'clamp(24px, 6vw, 40px)' 
      }}>
        {/* Left - Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 24px)' }}>
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: 'clamp(16px, 4vw, 24px)', 
                  padding: 'clamp(16px, 4vw, 24px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 20px)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                  <div style={{ 
                    width: 'clamp(48px, 12vw, 64px)', 
                    height: 'clamp(48px, 12vw, 64px)', 
                    backgroundColor: 'rgba(0, 242, 255, 0.1)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                     <ShoppingCart size={24} color="#00f2ff" />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <span style={{ 
                      fontSize: 'clamp(9px, 2.5vw, 11px)', 
                      fontWeight: '800', 
                      color: '#00f2ff', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px' 
                    }}>
                      {item.product.category}
                    </span>
                    <h4 style={{ 
                      fontSize: 'clamp(14px, 3vw, 18px)', 
                      fontWeight: '800', 
                      marginTop: '4px',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.product.name}
                    </h4>
                    <p style={{ 
                      fontSize: 'clamp(12px, 3vw, 14px)', 
                      color: '#10b981', 
                      fontWeight: '900', 
                      marginTop: '4px' 
                    }}>
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'clamp(12px, 3vw, 24px)',
                  flexShrink: 0
                }}>
                   {/* Quantity Controls */}
                   <div style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '8px', 
                     backgroundColor: 'rgba(255,255,255,0.05)', 
                     padding: '6px 12px', 
                     borderRadius: '12px' 
                   }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: item.quantity <= 1 ? '#666' : '#a0a0b8',
                          cursor: (updatingItems.has(item.id) || item.quantity <= 1) ? 'not-allowed' : 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ 
                        fontSize: 'clamp(12px, 3vw, 14px)', 
                        fontWeight: '800',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {updatingItems.has(item.id) ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: updatingItems.has(item.id) ? '#666' : '#a0a0b8',
                          cursor: updatingItems.has(item.id) ? 'not-allowed' : 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                   </div>
                   
                   {/* Remove Button */}
                   <button 
                     onClick={() => handleRemoveItem(item.id)}
                     disabled={updatingItems.has(item.id)}
                     style={{ 
                       color: updatingItems.has(item.id) ? '#666' : '#ff4b4b', 
                       padding: 'clamp(8px, 2vw, 10px)', 
                       backgroundColor: updatingItems.has(item.id) ? 'rgba(255,255,255,0.02)' : 'rgba(255,75,75,0.1)', 
                       borderRadius: '12px',
                       border: 'none',
                       cursor: updatingItems.has(item.id) ? 'not-allowed' : 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}
                   >
                      {updatingItems.has(item.id) ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)', 
              backgroundColor: '#0d0d12', 
              borderRadius: 'clamp(16px, 4vw, 32px)', 
              border: '1px solid rgba(255,255,255,0.05)' 
            }}>
               <ShoppingCart size={48} color="#6b6b7d" style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }} />
               <h4 style={{ 
                 fontSize: 'clamp(16px, 4vw, 20px)', 
                 fontWeight: '800', 
                 marginBottom: 'clamp(6px, 2vw, 8px)' 
               }}>
                 Your cart is empty
               </h4>
               <p style={{ 
                 color: '#a0a0b8', 
                 marginBottom: 'clamp(24px, 6vw, 32px)',
                 fontSize: 'clamp(12px, 3vw, 14px)',
                 lineHeight: '1.4'
               }}>
                 Explore the marketplace and find premium assets to trade.
               </p>
               <button 
                 onClick={() => navigate('/shop')} 
                 style={{ 
                   backgroundColor: '#00f2ff', 
                   color: '#000', 
                   padding: 'clamp(12px, 3vw, 14px) clamp(24px, 6vw, 32px)', 
                   borderRadius: '14px', 
                   fontWeight: '900',
                   fontSize: 'clamp(12px, 3vw, 14px)',
                   border: 'none',
                   cursor: 'pointer'
                 }}
               >
                 Browse Shop
               </button>
            </div>
          )}
        </div>

        {/* Right - Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: 'clamp(16px, 4vw, 32px)', 
            padding: 'clamp(20px, 5vw, 32px)' 
          }}>
             <h4 style={{ 
               fontSize: 'clamp(16px, 4vw, 18px)', 
               fontWeight: '800', 
               marginBottom: 'clamp(16px, 4vw, 24px)' 
             }}>
               Order Summary
             </h4>
             
             <div style={{ 
               display: 'flex', 
               flexDirection: 'column', 
               gap: 'clamp(12px, 3vw, 16px)', 
               marginBottom: 'clamp(24px, 6vw, 32px)' 
             }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(13px, 3vw, 15px)' 
                }}>
                   <span style={{ color: '#a0a0b8' }}>Items ({cart.items.length})</span>
                   <span style={{ fontWeight: '700' }}>${cart.total.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(13px, 3vw, 15px)' 
                }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(18px, 4vw, 20px)', 
                  fontWeight: '950' 
                }}>
                   <span>Total</span>
                   <span style={{ color: '#00f2ff' }}>${cart.total.toFixed(2)}</span>
                </div>
             </div>

             <button 
                onClick={handleCheckout}
                disabled={cart.items.length === 0 || checkingOut}
                style={{ 
                  width: '100%', 
                  backgroundColor: (cart.items.length === 0 || checkingOut) ? '#666' : '#00f2ff', 
                  color: (cart.items.length === 0 || checkingOut) ? '#ccc' : '#000', 
                  padding: 'clamp(14px, 3vw, 18px)', 
                  borderRadius: '16px', 
                  fontWeight: '900', 
                  fontSize: 'clamp(14px, 3vw, 16px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  border: 'none',
                  cursor: (cart.items.length === 0 || checkingOut) ? 'not-allowed' : 'pointer'
                }}
              >
                {checkingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : cart.items.length === 0 ? (
                  'Cart Empty'
                ) : (
                  <>
                    Checkout <ArrowRight size={18} />
                  </>
                )}
             </button>
             <p style={{ 
               textAlign: 'center', 
               fontSize: 'clamp(10px, 2.5vw, 12px)', 
               color: '#6b6b7d' 
             }}>
               Taxes and fees calculated at checkout.
             </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(0, 242, 255, 0.05)', 
            border: '1px solid rgba(0, 242, 255, 0.1)', 
            borderRadius: 'clamp(16px, 4vw, 24px)', 
            padding: 'clamp(16px, 4vw, 24px)', 
            display: 'flex', 
            gap: 'clamp(12px, 3vw, 16px)' 
          }}>
             <ShieldCheck size={20} color="#00f2ff" style={{ flexShrink: 0 }} />
             <div>
                <p style={{ 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  fontWeight: '800', 
                  color: '#00f2ff', 
                  marginBottom: '4px' 
                }}>
                  Buyer Protection
                </p>
                <p style={{ 
                  fontSize: 'clamp(10px, 2.5vw, 12px)', 
                  color: '#a0a0b8',
                  lineHeight: '1.4'
                }}>
                  Every transaction is secured by KUDZNED Escrow system. Guaranteed or money back.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;