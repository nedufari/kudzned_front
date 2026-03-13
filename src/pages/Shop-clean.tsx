import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Filter, 
  Zap, 
  Star,
  Globe,
  ArrowRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { apiClient } from '../services/api';
import { toast } from '../utils/toast';

// Define types locally to avoid import issues
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data automatically when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from API...');
        console.log('Categories endpoint: /products/categories');
        console.log('Products endpoint: /products');
        
        const [productsData, categoriesData] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getCategories()
        ]);
        
        console.log('Products loaded:', productsData.length);
        console.log('Categories loaded:', categoriesData.length);
        console.log('Categories data:', categoriesData);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load products. Using sample data.');
        
        // Fallback to sample data
        setProducts([]);
        setCategories([
          { id: '1', name: 'BankLogs', slug: 'bank-logs', description: 'Bank logs', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
          { id: '2', name: 'Transfer', slug: 'transfer', description: 'Transfers', is_active: true, sort_order: 2, created_at: '', updated_at: '' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh data manually
  const refreshData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      toast.success(`${productsData.length} products and ${categoriesData.length} categories loaded!`);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh products');
    } finally {
      setLoading(false);
    }
  };

  const searchWithFilters = async () => {
    setLoading(true);
    try {
      const filters = {
        page: 1,
        limit: 20,
        status: 'active' as const,
        sort_by: 'created_at',
        sort_order: 'DESC' as const
      };
      
      // Add search term if provided
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }
      
      // Add category filter if selected
      if (activeCategory !== 'All Products') {
        const selectedCategory = categories.find(cat => cat.name === activeCategory);
        if (selectedCategory) {
          filters.category_id = selectedCategory.id;
        }
      }
      
      console.log('Searching with filters:', filters);
      const productsData = await apiClient.getProducts(filters);
      console.log('Search results:', productsData);
      
      setProducts(productsData);
      toast.success(`Found ${productsData.length} products!`);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed - check console for details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await apiClient.addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Simple local filtering
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryOptions = ['All Products', ...categories.map(cat => cat.name)];

  // Show loading state
  if (loading && products.length === 0 && categories.length === 0) {
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
        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ 
            fontSize: 'clamp(20px, 5vw, 24px)', 
            fontWeight: '900', 
            marginBottom: 'clamp(8px, 2vw, 12px)' 
          }}>
            Loading Marketplace...
          </h3>
          <p style={{ 
            color: '#a0a0b8', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            lineHeight: '1.4',
            maxWidth: '400px'
          }}>
            Fetching products and categories from the API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: '900', marginBottom: '8px' }}>Asset Marketplace</h3>
          <p style={{ color: '#a0a0b8', fontSize: 'clamp(14px, 3vw, 16px)' }}>Browse and purchase premium digital assets securely.</p>
        </div>
        
        {/* Search and Controls - Mobile Responsive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search Input - Full width on mobile */}
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <Search size={18} color="#6b6b7d" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '14px', width: '100%' }} 
            />
          </div>
          
          {/* Action Buttons - Stack on mobile, row on desktop */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button 
              onClick={searchWithFilters}
              disabled={loading}
              style={{ 
                backgroundColor: loading ? '#666' : '#ff00f2', 
                color: loading ? '#ccc' : '#fff',
                border: 'none', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontWeight: '700', 
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                flex: '1',
                minWidth: '120px',
                justifyContent: 'center'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </button>
            <button 
              onClick={refreshData}
              disabled={loading}
              style={{ 
                backgroundColor: '#0d0d12', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontWeight: '700', 
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                flex: '1',
                minWidth: '120px',
                justifyContent: 'center'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Data Summary - Mobile Responsive */}
      <div style={{ padding: 'clamp(12px, 3vw, 16px)', backgroundColor: '#0d0d12', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#a0a0b8', fontSize: 'clamp(12px, 3vw, 14px)', margin: 0, lineHeight: '1.4' }}>
          <strong style={{ color: '#00f2ff' }}>{categories.length}</strong> categories loaded, 
          <strong style={{ color: '#ff00f2', marginLeft: '8px' }}>{products.length}</strong> products available
          {filteredProducts.length !== products.length && (
            <span style={{ display: 'block', marginTop: '4px' }}>
              <strong style={{ color: '#10b981' }}>{filteredProducts.length}</strong> matching current filters
            </span>
          )}
        </p>
      </div>

      {/* Categories - Mobile Responsive Horizontal Scroll */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '8px', 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitScrollbar: { display: 'none' }
      }}>
        {categoryOptions.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)', 
              borderRadius: '12px', 
              backgroundColor: activeCategory === cat ? 'rgba(0, 242, 255, 0.1)' : '#0d0d12', 
              color: activeCategory === cat ? '#00f2ff' : '#a0a0b8', 
              border: activeCategory === cat ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid rgba(255,255,255,0.03)',
              fontWeight: '800',
              fontSize: 'clamp(12px, 3vw, 14px)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0,
              minWidth: 'fit-content',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid - Mobile Responsive */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', 
        gap: 'clamp(16px, 4vw, 24px)' 
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div 
              key={product.id}
              style={{
                backgroundColor: '#0d0d12',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 'clamp(16px, 4vw, 24px)',
                padding: 'clamp(16px, 4vw, 20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 3vw, 16px)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                minHeight: '280px'
              }}
              onClick={() => navigate(`/shop/${product.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
            >
              {/* Product Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ 
                  backgroundColor: 'rgba(0, 242, 255, 0.1)', 
                  padding: '4px 8px', 
                  borderRadius: '8px', 
                  fontSize: 'clamp(9px, 2.5vw, 11px)', 
                  fontWeight: '800', 
                  color: '#00f2ff', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  flexShrink: 0
                }}>
                  {product.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '700', flexShrink: 0 }}>
                  <Star size={12} fill="#f59e0b" />
                  4.8
                </div>
              </div>

              {/* Product Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
                <h4 style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: '800', 
                  margin: 0,
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </h4>
                
                {/* Product Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#6b6b7d', fontWeight: '700' }}>
                      <Globe size={12} />
                      Stock: {product.stock}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#10b981', fontWeight: '700' }}>
                      <Zap size={12} />
                      Instant
                   </div>
                </div>
                
                <p style={{ 
                  color: '#a0a0b8', 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  lineHeight: '1.4',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {product.description}
                </p>
              </div>

              {/* Product Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid rgba(255,255,255,0.03)', 
                paddingTop: 'clamp(12px, 3vw, 16px)',
                gap: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', color: '#6b6b7d', textTransform: 'uppercase', fontWeight: '800', margin: 0 }}>Price</p>
                  <p style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: '950', color: '#10b981', margin: 0 }}>${product.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                   <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAddToCart(product.id);
                      }}
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        color: 'white', 
                        padding: 'clamp(8px, 2vw, 10px)', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        minWidth: '36px',
                        minHeight: '36px'
                      }}
                   >
                      <ShoppingBag size={16} />
                   </button>
                   <button style={{ 
                     backgroundColor: 'rgba(255,255,255,0.05)', 
                     color: 'white', 
                     padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)', 
                     borderRadius: '12px', 
                     fontWeight: '800', 
                     fontSize: 'clamp(11px, 2.5vw, 13px)', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '4px', 
                     border: 'none', 
                     cursor: 'pointer',
                     whiteSpace: 'nowrap'
                   }}>
                     Details
                     <ArrowRight size={12} />
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 20px)', 
            backgroundColor: '#0d0d12', 
            borderRadius: 'clamp(16px, 4vw, 32px)', 
            border: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
              <ShoppingBag size={48} color="#6b6b7d" />
            </div>
            <h4 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: '800', marginBottom: '8px' }}>No products found</h4>
            <p style={{ 
              color: '#a0a0b8', 
              marginBottom: 'clamp(16px, 4vw, 24px)', 
              fontSize: 'clamp(14px, 3vw, 16px)',
              lineHeight: '1.4'
            }}>
              {categories.length > 0 
                ? `We have ${categories.length} categories ready, but no products are available yet.`
                : 'No products or categories available at the moment.'
              }
            </p>
            {activeCategory !== 'All Products' && (
              <button 
                onClick={() => setActiveCategory('All Products')}
                style={{ 
                  backgroundColor: '#00f2ff', 
                  color: '#000', 
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)', 
                  borderRadius: '12px', 
                  fontWeight: '700',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View All Categories
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;