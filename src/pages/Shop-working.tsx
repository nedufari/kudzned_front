import React, { useState } from 'react';
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
  Loader2,
  X
} from 'lucide-react';
import { api } from '../services/api';
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
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [inStockOnly, setInStockOnly] = useState(false);

  const testApiEndpoints = async () => {
    console.log('Testing API endpoints...');
    
    try {
      // Test categories endpoint
      console.log('Testing categories: /products/categories');
      const categories = await api.getCategories();
      console.log('Categories response:', categories);
      
      // Test products endpoint with filters
      console.log('Testing products with filters...');
      const filters = {
        page: 1,
        limit: 20,
        status: 'active' as const,
        sort_by: 'created_at',
        sort_order: 'DESC' as const
      };
      const products = await api.getProducts(filters);
      console.log('Products response:', products);
      
      toast.success('API endpoints tested successfully!');
    } catch (error) {
      console.error('API test failed:', error);
      toast.error('API test failed - check console for details');
    }
  };

  // Load data manually when user clicks button - no complex filtering
  const loadData = async () => {
    setLoading(true);
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
      
      setProducts(productsData);
      setCategories(categoriesData);
      setDataLoaded(true);
      toast.success(`${productsData.length} products and ${categoriesData.length} categories loaded!`);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load products. Using sample data.');
      
      // Fallback to sample data
      setProducts([
        { 
          id: 'bank-01', 
          name: 'Chase High-Balance Personal Log', 
          description: 'Premium Chase personal account with high history and active balances. Fully checked and verified.',
          price: 450.00, 
          category: 'BankLogs', 
          stock: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 'bank-02', 
          name: 'Wells Fargo Business Credit Line', 
          description: 'Business accounts with pre-approved credit lines. Includes full business documentation.',
          price: 850.00, 
          category: 'BankLogs', 
          stock: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      
      setCategories([
        { id: '1', name: 'BankLogs', slug: 'bank-logs', description: 'Bank logs', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
        { id: '2', name: 'Methods', slug: 'methods', description: 'Premium Methods', is_active: true, sort_order: 2, created_at: '', updated_at: '' }
      ]);
      
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const searchWithFilters = async () => {
    if (!dataLoaded) {
      toast.error('Please load data first');
      return;
    }
    
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

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All Products');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('created_at');
    setSortOrder('desc');
    setInStockOnly(false);
  };

  const handleSearch = () => {
    searchWithFilters();
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

  // Show load button if data not loaded yet
  if (!dataLoaded) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>Asset Marketplace</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px', marginBottom: '32px' }}>Load products and categories from the API</p>
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#666' : '#00f2ff',
            color: loading ? '#ccc' : '#000',
            padding: '16px 32px',
            borderRadius: '16px',
            fontWeight: '900',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '12px'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Loading Products...
            </>
          ) : (
            <>
              <RefreshCw size={20} />
              Load Products & Categories
            </>
          )}
        </button>
        
        <button
          onClick={testApiEndpoints}
          style={{
            backgroundColor: 'transparent',
            color: '#a0a0b8',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
        >
          Test API Endpoints
        </button>
        
        <p style={{ fontSize: '12px', color: '#6b6b7d', textAlign: 'center' }}>
          Click the button above to load real products from the API
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Asset Marketplace</h3>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>Browse and purchase premium digital assets securely.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px' }}>
            <Search size={18} color="#6b6b7d" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '14px', width: '100%' }} 
            />
          </div>
          <button 
            onClick={searchWithFilters}
            disabled={loading || !dataLoaded}
            style={{ 
              backgroundColor: (!dataLoaded || loading) ? '#666' : '#ff00f2', 
              color: (!dataLoaded || loading) ? '#ccc' : '#fff',
              border: 'none', 
              borderRadius: '16px', 
              padding: '12px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontWeight: '700', 
              fontSize: '14px',
              cursor: (!dataLoaded || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
          <button 
            onClick={loadData}
            disabled={loading}
            style={{ 
              backgroundColor: '#0d0d12', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', 
              padding: '12px 20px', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontWeight: '700', 
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            Refresh
          </button>
          <button style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px' }}>
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800' }}>Advanced Filters</h4>
            <button 
              onClick={clearFilters}
              style={{ 
                backgroundColor: 'transparent', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                padding: '6px 12px', 
                color: '#a0a0b8', 
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {/* Price Range */}
            <div>
              <label style={{ fontSize: '12px', color: '#a0a0b8', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Price Range</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '14px',
                    width: '80px'
                  }}
                />
                <span style={{ color: '#a0a0b8' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '14px',
                    width: '80px'
                  }}
                />
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <label style={{ fontSize: '12px', color: '#a0a0b8', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Sort By</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'created_at')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '14px',
                    flex: 1
                  }}
                >
                  <option value="created_at">Date</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '14px',
                    width: '80px'
                  }}
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
            
            {/* Stock Filter */}
            <div>
              <label style={{ fontSize: '12px', color: '#a0a0b8', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Availability</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: '#00f2ff' }}
                />
                <span style={{ fontSize: '14px', color: 'white' }}>In Stock Only</span>
              </label>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 20px',
                color: '#a0a0b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}
              disabled={loading}
              style={{
                backgroundColor: '#00f2ff',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categoryOptions.map((cat) => (
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
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      {dataLoaded && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <span style={{ color: '#a0a0b8', fontSize: '14px' }}>
              Showing {filteredProducts.length} of {products.length} products
              {activeCategory !== 'All Products' && ` in ${activeCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {(searchTerm || activeCategory !== 'All Products' || minPrice || maxPrice || inStockOnly) && (
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: 'rgba(255, 75, 75, 0.1)',
                  border: '1px solid rgba(255, 75, 75, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#ff4b4b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            style={{
              backgroundColor: '#0d0d12',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/shop/${product.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: '#00f2ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {product.category}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: '700' }}>
                <Star size={14} fill="#f59e0b" />
                4.8
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{product.name}</h4>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b6b7d', fontWeight: '700' }}>
                    <Globe size={14} />
                    Stock: {product.stock}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                    <Zap size={14} />
                    Instant
                 </div>
              </div>
              <p style={{ color: '#a0a0b8', fontSize: '14px', lineHeight: '1.5' }}>
                {product.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#6b6b7d', textTransform: 'uppercase', fontWeight: '800' }}>Price</p>
                <p style={{ fontSize: '20px', fontWeight: '950', color: '#10b981' }}>${product.price.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleAddToCart(product.id);
                    }}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)', 
                      color: 'white', 
                      padding: '10px', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                 >
                    <ShoppingBag size={18} />
                 </button>
                 <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 16px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}>
                   Details
                   <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0a0b8' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No products found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default Shop;