import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Zap, 
  Star,
  Globe,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '../utils/toast';
import { api } from '../services/api';

// Define Product type locally to avoid API import issues
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

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (productId: string) => void }) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      await onAddToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: '#0d0d12',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(16px, 4vw, 20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(12px, 3vw, 16px)',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '280px'
      }}
      onClick={() => navigate(`/shop/${product.id}`)}
      className="group"
    >
      {/* Product Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 242, 255, 0.1)', 
          padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', 
          borderRadius: '10px', 
          fontSize: 'clamp(9px, 2.5vw, 11px)', 
          fontWeight: '800', 
          color: '#00f2ff', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          flexShrink: 0
        }}>
          {product.category}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          color: '#f59e0b', 
          fontSize: 'clamp(10px, 2.5vw, 12px)', 
          fontWeight: '700',
          flexShrink: 0
        }}>
          <Star size={12} fill="#f59e0b" />
          4.8
        </div>
      </div>

      {/* Product Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
        <h4 style={{ 
          fontSize: 'clamp(16px, 4vw, 18px)', 
          fontWeight: '800', 
          marginBottom: 0,
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h4>
        
        {/* Product Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 12px)' }}>
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '4px', 
             fontSize: 'clamp(10px, 2.5vw, 12px)', 
             color: '#6b6b7d', 
             fontWeight: '700' 
           }}>
              <Globe size={12} />
              Stock: {product.stock}
           </div>
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '4px', 
             fontSize: 'clamp(10px, 2.5vw, 12px)', 
             color: '#10b981', 
             fontWeight: '700' 
           }}>
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
          <p style={{ 
            fontSize: 'clamp(9px, 2.5vw, 11px)', 
            color: '#6b6b7d', 
            textTransform: 'uppercase', 
            fontWeight: '800',
            margin: 0
          }}>
            Price
          </p>
          <p style={{ 
            fontSize: 'clamp(18px, 4vw, 20px)', 
            fontWeight: '950', 
            color: '#10b981',
            margin: 0
          }}>
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 8px)', flexShrink: 0 }}>
           <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              style={{ 
                backgroundColor: isAddingToCart ? 'rgba(0, 242, 255, 0.2)' : 'rgba(255,255,255,0.05)', 
                color: 'white', 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1,
                border: 'none',
                minWidth: '36px',
                minHeight: '36px'
              }}
              className="hover:bg-white hover:text-black transition-all"
           >
              {isAddingToCart ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
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
           }} className="group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
             Details
             <ArrowRight size={12} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const Shop: React.FC = () => {
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
          api.getProducts(),
          api.getCategories()
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
          { id: '2', name: 'Methods', slug: 'methods', description: 'Premium Methods', is_active: true, sort_order: 2, created_at: '', updated_at: '' }
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
        api.getProducts(),
        api.getCategories()
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
      const filters: any = {
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
      const productsData = await api.getProducts(filters);
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
      await api.addToCart(productId, 1);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 6vw, 32px)' }}>
      {/* Header Area - Mobile Responsive */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 20px)' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: '900', marginBottom: 'clamp(6px, 2vw, 8px)' }}>Asset Marketplace</h3>
          <p style={{ color: '#a0a0b8', fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '1.4' }}>Browse and purchase premium digital assets securely.</p>
        </div>
        
        {/* Search and Filter - Mobile Responsive Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: 'clamp(10px, 3vw, 12px) clamp(16px, 4vw, 20px)', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <Search size={18} color="#6b6b7d" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 'clamp(13px, 3vw, 14px)', width: '100%' }} 
            />
          </div>
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

      {/* Category Pills - Mobile Responsive Horizontal Scroll */}
      <div style={{ 
        display: 'flex', 
        gap: 'clamp(6px, 2vw, 10px)', 
        overflowX: 'auto', 
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      } as React.CSSProperties & { scrollbarWidth?: string; msOverflowStyle?: string }}>
        {categoryOptions.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)', 
              borderRadius: '14px', 
              backgroundColor: activeCategory === cat ? 'rgba(0, 242, 255, 0.1)' : '#0d0d12', 
              color: activeCategory === cat ? '#00f2ff' : '#a0a0b8', 
              border: activeCategory === cat ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid rgba(255,255,255,0.03)',
              fontWeight: '800',
              fontSize: 'clamp(12px, 3vw, 14px)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid - Mobile Responsive */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', 
        gap: 'clamp(16px, 4vw, 24px)' 
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 20px)', 
            color: '#a0a0b8',
            backgroundColor: '#0d0d12',
            borderRadius: 'clamp(16px, 4vw, 24px)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
              <ShoppingBag size={48} color="#6b6b7d" />
            </div>
            <h4 style={{ fontSize: 'clamp(16px, 4vw, 18px)', marginBottom: 'clamp(6px, 2vw, 8px)', fontWeight: '700' }}>No products found</h4>
            <p style={{ 
              fontSize: 'clamp(12px, 3vw, 14px)', 
              lineHeight: '1.4',
              marginBottom: 'clamp(16px, 4vw, 24px)'
            }}>
              {categories.length > 0 
                ? `We have ${categories.length} categories ready, but no products match your current filters.`
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
