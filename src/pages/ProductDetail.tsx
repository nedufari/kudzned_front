import React, { useState, useEffect } from 'react';
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
  Lock,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from '../utils/toast';

interface Product {
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
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product data automatically
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading product:', id);
        const productData = await api.getProduct(id);
        console.log('Product loaded:', productData);
        
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
        
        // Fallback to mock data
        setProduct({
          id: id || 'unknown',
          name: 'Product Not Found',
          description: 'This product could not be loaded from the API.',
          price: 0,
          category: 'Unknown',
          stock: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Add to cart function
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await api.addToCart(product.id, 1);
      // Navigate to cart after successful add
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Show loading state
  if (loading) {
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
          className="hover:text-[#00f2ff]"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>

        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ 
            fontSize: 'clamp(20px, 5vw, 24px)', 
            fontWeight: '900', 
            marginBottom: 'clamp(8px, 2vw, 12px)' 
          }}>
            Loading Product...
          </h3>
          <p style={{ 
            color: '#a0a0b8', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            lineHeight: '1.4',
            maxWidth: '400px'
          }}>
            Fetching product details from the API
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Product not found</h3>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  // Generate features and specs from product data
  const features = [
    `Price: $${product.price.toFixed(2)}`,
    `Category: ${product.category}`,
    `Stock: ${product.stock > 0 ? 'Available' : 'Out of Stock'}`,
    `Status: ${product.is_active ? 'Active' : 'Inactive'}`,
    `Last Updated: ${new Date(product.updated_at).toLocaleDateString()}`
  ];

  const specs = [
    { label: 'Network', value: 'Instant Delivery', icon: Zap },
    { label: 'Security', value: 'Safe & Anonymous', icon: ShieldCheck },
    { label: 'Stock', value: product.stock > 0 ? 'In Stock' : 'Out of Stock', icon: Globe }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 6vw, 32px)' }}>
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
        className="hover:text-[#00f2ff]"
      >
        <ArrowLeft size={18} />
        Back to Shop
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
        gap: 'clamp(24px, 6vw, 40px)' 
      }}>
        {/* Left - Detail Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 6vw, 32px)' }}>
          <div style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: 'clamp(16px, 4vw, 32px)', 
            padding: 'clamp(20px, 5vw, 40px)' 
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                <div>
                   <div style={{ 
                     backgroundColor: 'rgba(0, 242, 255, 0.1)', 
                     padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', 
                     borderRadius: '10px', 
                     fontSize: 'clamp(9px, 2.5vw, 11px)', 
                     fontWeight: '800', 
                     color: '#00f2ff', 
                     textTransform: 'uppercase', 
                     marginBottom: 'clamp(12px, 3vw, 16px)', 
                     width: 'fit-content' 
                   }}>
                      {product.category}
                   </div>
                   <h2 style={{ 
                     fontSize: 'clamp(24px, 6vw, 40px)', 
                     fontWeight: '950', 
                     marginBottom: 'clamp(12px, 3vw, 16px)',
                     lineHeight: '1.2'
                   }}>
                     {product.name}
                   </h2>
                   <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: '#f59e0b', 
                        fontSize: 'clamp(13px, 3vw, 15px)', 
                        fontWeight: '800' 
                      }}>
                         <Star size={16} fill="#f59e0b" />
                         4.8
                      </div>
                      <div style={{ 
                        color: '#6b6b7d', 
                        fontSize: 'clamp(13px, 3vw, 15px)', 
                        fontWeight: '700' 
                      }}>
                         {Math.floor(Math.random() * 100) + 20} Reviews
                      </div>
                   </div>
                </div>
             </div>

             <p style={{ 
               fontSize: 'clamp(14px, 3vw, 18px)', 
               color: '#a0a0b8', 
               lineHeight: '1.6', 
               marginBottom: 'clamp(24px, 6vw, 40px)' 
             }}>
                {product.description}
             </p>

             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', 
               gap: 'clamp(16px, 4vw, 32px)' 
             }}>
                {specs.map((spec, i) => (
                   <div key={i} style={{ display: 'flex', gap: 'clamp(12px, 3vw, 16px)', alignItems: 'center' }}>
                      <div style={{ 
                        backgroundColor: 'rgba(255,255,255,0.03)', 
                        padding: 'clamp(8px, 2vw, 12px)', 
                        borderRadius: '16px',
                        flexShrink: 0
                      }}>
                         <spec.icon size={20} color="#00f2ff" />
                      </div>
                      <div>
                         <p style={{ 
                           fontSize: 'clamp(10px, 2.5vw, 12px)', 
                           color: '#6b6b7d', 
                           fontWeight: '800', 
                           textTransform: 'uppercase',
                           margin: 0
                         }}>
                           {spec.label}
                         </p>
                         <p style={{ 
                           fontSize: 'clamp(13px, 3vw, 15px)', 
                           fontWeight: '800',
                           margin: 0
                         }}>
                           {spec.value}
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: 'clamp(16px, 4vw, 32px)', 
            padding: 'clamp(20px, 5vw, 40px)' 
          }}>
             <h3 style={{ 
               fontSize: 'clamp(16px, 4vw, 20px)', 
               fontWeight: '800', 
               marginBottom: 'clamp(16px, 4vw, 24px)' 
             }}>
               Product Features
             </h3>
             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', 
               gap: 'clamp(12px, 3vw, 16px)' 
             }}>
                {features.map((feat, i) => (
                   <div key={i} style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: 'clamp(8px, 2vw, 12px)', 
                     backgroundColor: 'rgba(255,255,255,0.02)', 
                     padding: 'clamp(12px, 3vw, 16px)', 
                     borderRadius: '16px' 
                   }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                      <span style={{ 
                        fontSize: 'clamp(12px, 3vw, 15px)', 
                        fontWeight: '700', 
                        color: '#a0a0b8' 
                      }}>
                        {feat}
                      </span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right - Pricing Sticky */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 24px)' }}>
           <div style={{ 
             backgroundColor: '#0d0d12', 
             border: '1px solid rgba(255,255,255,0.05)', 
             borderRadius: 'clamp(16px, 4vw, 32px)', 
             padding: 'clamp(20px, 5vw, 32px)', 
             position: 'sticky', 
             top: '24px' 
           }}>
             <h4 style={{ 
               fontSize: 'clamp(14px, 3vw, 16px)', 
               fontWeight: '800', 
               color: '#6b6b7d', 
               textTransform: 'uppercase', 
               marginBottom: 'clamp(16px, 4vw, 24px)' 
             }}>
               Pricing Breakdown
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
                   <span style={{ color: '#a0a0b8' }}>Item Price</span>
                   <span style={{ fontWeight: '700' }}>${product.price.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(13px, 3vw, 15px)' 
                }}>
                   <span style={{ color: '#a0a0b8' }}>Network Fees</span>
                   <span style={{ fontWeight: '700', color: '#10b981' }}>+$0.00</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(20px, 5vw, 24px)', 
                  fontWeight: '950' 
                }}>
                   <span>Total</span>
                   <span style={{ color: '#00f2ff' }}>${product.price.toFixed(2)}</span>
                </div>
             </div>

             <button 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                style={{ 
                  width: '100%', 
                  backgroundColor: addingToCart ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', 
                  color: addingToCart ? '#666' : 'white', 
                  padding: 'clamp(14px, 3vw, 18px)', 
                  borderRadius: '16px', 
                  fontWeight: '800', 
                  fontSize: 'clamp(14px, 3vw, 16px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: (addingToCart || product.stock === 0) ? 'not-allowed' : 'pointer',
                  opacity: product.stock === 0 ? 0.5 : 1
                }}
             >
                {addingToCart ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
             </button>
             <button 
                onClick={() => navigate('/checkout')}
                disabled={product.stock === 0}
                style={{ 
                  width: '100%', 
                  backgroundColor: product.stock === 0 ? '#666' : '#00f2ff', 
                  color: product.stock === 0 ? '#ccc' : '#000', 
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
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                }}
             >
                <Zap size={20} fill="currentColor" />
                {product.stock === 0 ? 'Unavailable' : 'Buy Now'}
             </button>
             <p style={{ 
               textAlign: 'center', 
               fontSize: 'clamp(10px, 2.5vw, 12px)', 
               color: '#6b6b7d' 
             }}>
               Secured by KUDZNED Escrow System
             </p>

             <div style={{ 
               marginTop: 'clamp(24px, 6vw, 32px)', 
               paddingTop: 'clamp(24px, 6vw, 32px)', 
               borderTop: '1px solid rgba(255,255,255,0.05)', 
               textAlign: 'center' 
             }}>
                <p style={{ 
                  fontSize: 'clamp(11px, 2.5vw, 13px)', 
                  color: '#a0a0b8', 
                  marginBottom: 'clamp(12px, 3vw, 16px)' 
                }}>
                  Need help or custom orders?
                </p>
                <button style={{ 
                  width: '100%', 
                  backgroundColor: 'rgba(0, 242, 255, 0.05)', 
                  color: '#00f2ff', 
                  padding: 'clamp(10px, 2.5vw, 12px)', 
                  borderRadius: '12px', 
                  fontWeight: '800', 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                   <MessageSquare size={16} />
                   Contact Support
                </button>
             </div>
           </div>

           <div style={{ 
             backgroundColor: 'rgba(0, 242, 255, 0.05)', 
             border: '1px solid rgba(0, 242, 255, 0.1)', 
             borderRadius: 'clamp(16px, 4vw, 24px)', 
             padding: 'clamp(16px, 4vw, 24px)', 
             display: 'flex', 
             gap: 'clamp(12px, 3vw, 16px)' 
           }}>
              <Lock size={20} color="#00f2ff" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  fontWeight: '800', 
                  color: '#00f2ff', 
                  marginBottom: '4px' 
                }}>
                  Auto-Check Live
                </p>
                <p style={{ 
                  fontSize: 'clamp(10px, 2.5vw, 12px)', 
                  color: '#a0a0b8',
                  lineHeight: '1.4'
                }}>
                  This item was auto-checked by our system and confirmed {product.is_active ? 'active' : 'inactive'}.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
