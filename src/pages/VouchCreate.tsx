import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  X,
  CheckCircle2,
  Image as ImageIcon,
  Search
} from 'lucide-react';
import { api, VouchTag } from '../services/api';
import type { Product, CreateVouchRequest } from '../services/api';

const VouchCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product_id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateVouchRequest>({
    product_id: productId || '',
    rating: 5,
    comment: '',
    tags: []
  });
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [availableTags] = useState(Object.values(VouchTag));

  // Helper function to convert enum values to readable labels
  const getTagLabel = (tag: VouchTag): string => {
    const labels: Record<VouchTag, string> = {
      [VouchTag.FAST_DELIVERY]: 'Fast Delivery',
      [VouchTag.HIGH_BALANCE]: 'High Balance',
      [VouchTag.SECURE]: 'Secure',
      [VouchTag.RELIABLE]: 'Reliable',
      [VouchTag.GOOD_SUPPORT]: 'Good Support',
      [VouchTag.EASY_CASHOUT]: 'Easy Cashout',
      [VouchTag.VERIFIED_SELLER]: 'Verified Seller'
    };
    return labels[tag] || tag;
  };

  useEffect(() => {
    loadProducts();
    if (productId) {
      loadProduct();
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [productId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts({ limit: 100 }); // Get all products
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const data = await api.getProduct(productId);
      setProduct(data);
      setFormData(prev => ({ ...prev, product_id: productId }));
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (selectedProductId: string) => {
    const selectedProduct = products.find(p => p.id === selectedProductId);
    setProduct(selectedProduct || null);
    setFormData(prev => ({ ...prev, product_id: selectedProductId }));
    setProductSearch(selectedProduct?.name || '');
    setShowDropdown(false);
  };

  const handleProductSearch = (searchTerm: string) => {
    setProductSearch(searchTerm);
    setShowDropdown(true);
    
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      
      setProofImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setProofImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const toggleTag = (tag: VouchTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id) {
      alert('Please select a product to review');
      return;
    }
    
    if (formData.comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review');
      return;
    }

    setSubmitting(true);
    try {
      const vouchData: CreateVouchRequest = {
        ...formData,
        proof_image: proofImage || undefined
      };
      
      await api.createVouch(vouchData);
      navigate('/vouches', { 
        state: { message: 'Vouch created successfully!' }
      });
    } catch (error) {
      console.error('Error creating vouch:', error);
      alert('Failed to create vouch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          select option {
            background-color: #0d0d12 !important;
            color: white !important;
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/vouches')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
      >
        <ArrowLeft size={18} />
        Back to Vouches
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Write a Vouch</h2>
        <p style={{ color: '#a0a0b8', fontSize: '16px' }}>
          Share your experience to help the community make informed decisions
        </p>
      </div>

      {/* Product Selection */}
      <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Select Product</h3>
        <p style={{ color: '#6b6b7d', fontSize: '14px', marginBottom: '20px' }}>
          Search and choose the product you want to review
        </p>
        
        {loadingProducts ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b6b7d' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid #6b6b7d', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            Loading products...
          </div>
        ) : (
          <div style={{ position: 'relative' }} data-dropdown>
            <Search size={20} color="#6b6b7d" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input
              type="text"
              placeholder="Search for a product..."
              value={productSearch}
              onChange={(e) => handleProductSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
            
            {showDropdown && filteredProducts.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#0d0d12',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                marginTop: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                {filteredProducts.slice(0, 10).map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleProductSelect(prod.id)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b6b7d' }}>
                      {prod.category} • ${prod.price.toFixed(2)}
                    </div>
                  </div>
                ))}
                {filteredProducts.length > 10 && (
                  <div style={{ padding: '12px 16px', fontSize: '12px', color: '#6b6b7d', textAlign: 'center' }}>
                    +{filteredProducts.length - 10} more results...
                  </div>
                )}
              </div>
            )}
            
            {showDropdown && filteredProducts.length === 0 && productSearch.trim() !== '' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#0d0d12',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                marginTop: '8px',
                padding: '16px',
                textAlign: 'center',
                color: '#6b6b7d',
                fontSize: '14px'
              }}>
                No products found matching "{productSearch}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      {product && (
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Product Being Reviewed</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=100'} 
              alt={product.name}
              style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{product.name}</h4>
              <p style={{ fontSize: '12px', color: '#6b6b7d', textTransform: 'uppercase' }}>
                {product.category}
              </p>
              <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '800' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Rating */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Rating</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating }))}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <Star 
                  size={32} 
                  fill={rating <= formData.rating ? "#f59e0b" : "transparent"} 
                  color={rating <= formData.rating ? "#f59e0b" : "#374151"} 
                />
              </button>
            ))}
            <span style={{ marginLeft: '16px', fontSize: '16px', fontWeight: '700', color: '#a0a0b8' }}>
              {formData.rating} star{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Your Review</h3>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Share your experience with this product. What worked well? Any issues? Would you recommend it?"
            required
            minLength={10}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b6b7d', marginTop: '8px' }}>
            {formData.comment.length}/500 characters (minimum 10)
          </p>
        </div>

        {/* Tags */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Tags (Optional)</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Select tags that describe your experience
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: formData.tags?.includes(tag) ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: formData.tags?.includes(tag) ? '#00f2ff' : '#a0a0b8',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {getTagLabel(tag)}
              </button>
            ))}
          </div>
        </div>

        {/* Proof Image */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Proof Image (Optional)</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Upload a screenshot or image as proof of your purchase/experience
          </p>
          
          {!previewUrl ? (
            <label style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '120px',
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}>
              <ImageIcon size={32} color="#6b6b7d" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '14px', color: '#6b6b7d', textAlign: 'center' }}>
                Click to upload image<br />
                <span style={{ fontSize: '12px' }}>Max 5MB • JPG, PNG, GIF</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={previewUrl} 
                alt="Proof preview" 
                style={{ 
                  maxWidth: '300px', 
                  maxHeight: '200px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} 
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/vouches')}
            style={{
              padding: '16px 32px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#6b6b7d',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.product_id || formData.comment.trim().length < 10}
            style={{
              padding: '16px 32px',
              backgroundColor: submitting ? 'rgba(0, 242, 255, 0.5)' : '#00f2ff',
              border: 'none',
              borderRadius: '16px',
              color: '#000',
              fontWeight: '800',
              fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid #000', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Publish Vouch
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default VouchCreate;