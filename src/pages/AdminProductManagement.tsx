import React, { useState, useEffect } from 'react';
import { 
  Package, 
  FolderPlus, 
  Tag, 
  DollarSign, 
  FileText, 
  Layers, 
  Upload,
  PlusCircle,
  Save,
  Settings,
  Shield,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, type Category } from '../services/api';
import { toast } from '../utils/toast';

const AdminProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create-product' | 'create-category'>('create-product');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Form states for Product
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    tags: '',
    status: 'active',
    availability: 'in_stock'
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);

  // Form states for Category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    console.log('AdminProductManagement mounted');
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setFetchingCategories(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
      if (data.length > 0 && !productForm.category_id) {
        setProductForm(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description || !productForm.category_id || !productForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.createProduct({
        title: productForm.title,
        description: productForm.description,
        category_id: productForm.category_id,
        price: parseInt(productForm.price),
        image: productImage || undefined,
        digital_file: digitalFile || undefined,
        tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        status: productForm.status,
        availability: productForm.availability
      });
      toast.success('Product created successfully!');
      // Reset form
      setProductForm({
        title: '',
        description: '',
        category_id: categories[0]?.id || '',
        price: '',
        tags: '',
        status: 'active',
        availability: 'in_stock'
      });
      setProductImage(null);
      setDigitalFile(null);
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      await api.createCategory(categoryForm);
      toast.success('Category created successfully!');
      setCategoryForm({
        name: '',
        description: '',
        is_active: true,
        sort_order: categories.length + 1
      });
      loadCategories(); // Refresh categories
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    padding: '14px',
    color: 'white',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '800',
    color: '#6b6b7d',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
    display: 'block'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#00f2ff', marginBottom: '8px' }}>
            <Shield size={20} />
            <span style={{ fontWeight: '800', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Console</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.02em' }}>Inventory Management</h1>
          <p style={{ color: '#a0a0b8', fontSize: '16px' }}>Direct portal for SONNET marketplace assets and classifications.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0d0d12', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { id: 'create-product', icon: Package, label: 'Add Product' },
            { id: 'create-category', icon: FolderPlus, label: 'Add Category' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: activeTab === tab.id ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#00f2ff' : '#6b6b7d'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create-product' && (
          <motion.div
            key="create-product"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              backgroundColor: '#0d0d12', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '32px', 
              padding: '40px' 
            }}
          >
            <form onSubmit={handleProductSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {/* Basic Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#00f2ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} /> Essential Information
                  </h3>
                  
                  <div>
                    <label style={labelStyle}>Product Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Premium Chase Personal Log" 
                      style={inputStyle}
                      value={productForm.title}
                      onChange={e => setProductForm({...productForm, title: e.target.value})}
                      className="focus:border-[#00f2ff]"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Price (Satoshis)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        placeholder="50000" 
                        style={{ ...inputStyle, paddingLeft: '40px' }}
                        value={productForm.price}
                        onChange={e => setProductForm({...productForm, price: e.target.value})}
                      />
                      <DollarSign size={16} color="#6b6b7d" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Category</label>
                    <select 
                      style={{ ...inputStyle, appearance: 'none' }}
                      value={productForm.category_id}
                      onChange={e => setProductForm({...productForm, category_id: e.target.value})}
                      disabled={fetchingCategories}
                    >
                      {fetchingCategories ? (
                        <option>Loading categories...</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea 
                      placeholder="Detailed breakdown of the asset..." 
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                      value={productForm.description}
                      onChange={e => setProductForm({...productForm, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Logistics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ff00f2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={20} /> Logistics & Files
                  </h3>

                  <div>
                    <label style={labelStyle}>Tags (Comma separated)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="chase, log, high-balance" 
                        style={{ ...inputStyle, paddingLeft: '40px' }}
                        value={productForm.tags}
                        onChange={e => setProductForm({...productForm, tags: e.target.value})}
                      />
                      <Tag size={16} color="#6b6b7d" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select 
                        style={inputStyle}
                        value={productForm.status}
                        onChange={e => setProductForm({...productForm, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Availability</label>
                      <select 
                        style={inputStyle}
                        value={productForm.availability}
                        onChange={e => setProductForm({...productForm, availability: e.target.value})}
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Main Image</label>
                      <label style={{ 
                        ...inputStyle, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        height: '100px',
                        border: productImage ? '1px solid #00f2ff' : '1px dashed rgba(255,255,255,0.1)',
                        backgroundColor: productImage ? 'rgba(0,242,255,0.05)' : '#16161e'
                      }}>
                        <Upload size={20} color={productImage ? '#00f2ff' : '#6b6b7d'} />
                        <span style={{ fontSize: '11px', color: productImage ? '#00f2ff' : '#6b6b7d', textAlign: 'center' }}>
                          {productImage ? productImage.name.substring(0, 15) + '...' : 'Select Cover'}
                        </span>
                        <input type="file" hidden accept="image/*" onChange={e => e.target.files && setProductImage(e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <label style={labelStyle}>Digital Asset</label>
                      <label style={{ 
                        ...inputStyle, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        height: '100px',
                        border: digitalFile ? '1px solid #ff00f2' : '1px dashed rgba(255,255,255,0.1)',
                        backgroundColor: digitalFile ? 'rgba(255,0,242,0.05)' : '#16161e'
                      }}>
                        <FileText size={20} color={digitalFile ? '#ff00f2' : '#6b6b7d'} />
                        <span style={{ fontSize: '11px', color: digitalFile ? '#ff00f2' : '#6b6b7d', textAlign: 'center' }}>
                          {digitalFile ? digitalFile.name.substring(0, 15) + '...' : 'Upload File'}
                        </span>
                        <input type="file" hidden onChange={e => e.target.files && setDigitalFile(e.target.files[0])} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button 
                  type="button" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '16px 32px', borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    setProductForm({
                      title: '',
                      description: '',
                      category_id: categories[0]?.id || '',
                      price: '',
                      tags: '',
                      status: 'active',
                      availability: 'in_stock'
                    });
                    setProductImage(null);
                    setDigitalFile(null);
                  }}
                >
                  Reset Form
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#00f2ff', 
                    color: '#000', 
                    padding: '16px 48px', 
                    borderRadius: '16px', 
                    fontWeight: '900', 
                    border: 'none', 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)'
                  }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                  Publish Asset
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'create-category' && (
          <motion.div
            key="create-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              backgroundColor: '#0d0d12', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '32px', 
              padding: '40px',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <form onSubmit={handleCategorySubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff' }}>
                    <FolderPlus size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '900' }}>New Classification</h3>
                    <p style={{ color: '#6b6b7d', fontSize: '14px' }}>Define a new category for products.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Category Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BTC Flash" 
                      style={inputStyle}
                      value={categoryForm.name}
                      onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Sort Order</label>
                    <input 
                      type="number" 
                      placeholder="1" 
                      style={inputStyle}
                      value={categoryForm.sort_order}
                      onChange={e => setCategoryForm({...categoryForm, sort_order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea 
                    placeholder="What kind of products belong here?" 
                    style={{ ...inputStyle, minHeight: '100px' }}
                    value={categoryForm.description}
                    onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', backgroundColor: '#16161e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div 
                    onClick={() => setCategoryForm({...categoryForm, is_active: !categoryForm.is_active})}
                    style={{ 
                      width: '44px', 
                      height: '24px', 
                      borderRadius: '12px', 
                      backgroundColor: categoryForm.is_active ? '#00f2ff' : '#2a2a35', 
                      position: 'relative', 
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      backgroundColor: 'white', 
                      position: 'absolute', 
                      top: '3px', 
                      left: categoryForm.is_active ? '23px' : '3px',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '800' }}>Active Visibility</p>
                    <p style={{ fontSize: '12px', color: '#6b6b7d' }}>Show this category in the public shop.</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#ff00f2', 
                    color: 'white', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    fontWeight: '900', 
                    border: 'none', 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 0 30px rgba(255, 0, 242, 0.2)'
                  }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Create Category
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Settings size={20} color="#6b6b7d" />
          <h2 style={{ fontSize: '20px', fontWeight: '900' }}>Current Classifications</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              style={{ 
                backgroundColor: '#0d0d12', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '24px', 
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                cursor: 'default'
              }}
              className="hover:border-[#00f2ff]/30"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0b8' }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '800', fontSize: '15px' }}>{cat.name}</h4>
                  <p style={{ fontSize: '12px', color: '#6b6b7d' }}>{cat.description || 'No description'}</p>
                </div>
              </div>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: cat.is_active ? '#10b981' : '#ff4b4b',
                boxShadow: `0 0 10px ${cat.is_active ? '#10b981' : '#ff4b4b'}66`
              }} />
            </div>
          ))}
          {categories.length === 0 && !fetchingCategories && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b6b7d', backgroundColor: '#0d0d12', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.05)' }}>
              No categories created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;
