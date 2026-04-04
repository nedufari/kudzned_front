import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X,
  Video,
  DollarSign
} from 'lucide-react';
import { api, CashoutClipType } from '../services/api';
import type { Product, CreateClipRequest } from '../services/api';

const ClipUpload: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateClipRequest, 'video' | 'thumbnail'>>({
    product_id: '',
    title: '',
    description: '',
    amount: 0,
    cashout_type: CashoutClipType.BANK_TRANSFER,
    payment_method: '',
    duration_seconds: 0,
    tags: []
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableTags] = useState([
    'payout', 'success', 'evidence', 'live', 'high-yield', 'wire', 'crypto', 'bitcoin'
  ]);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts({ limit: 100 });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getCashoutTypeLabel = (type: CashoutClipType): string => {
    const labels: Record<CashoutClipType, string> = {
      [CashoutClipType.BANK_TRANSFER]: 'Bank Transfer',
      [CashoutClipType.CRYPTO_WITHDRAWAL]: 'Crypto Withdrawal',
      [CashoutClipType.PAYPAL]: 'PayPal',
      [CashoutClipType.CASHAPP]: 'CashApp',
      [CashoutClipType.VENMO]: 'Venmo',
      [CashoutClipType.ZELLE]: 'Zelle',
      [CashoutClipType.WIRE_TRANSFER]: 'Wire Transfer',
      [CashoutClipType.CHECK]: 'Check',
      [CashoutClipType.OTHER]: 'Other'
    };
    return labels[type] || type;
  };

  const extractThumbnail = (file: File): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      video.onloadedmetadata = () => {
        // Seek to 1s or 10% of duration, whichever is smaller
        video.currentTime = Math.min(1, video.duration * 0.1);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (!ctx) { URL.revokeObjectURL(url); resolve(null); return; }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const thumbFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
              resolve(thumbFile);
            } else {
              resolve(null);
            }
          }, 'image/jpeg', 0.85);
        } catch {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      video.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      video.load();
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video size must be less than 100MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-extract thumbnail
      const thumb = await extractThumbnail(file);
      if (thumb) {
        setThumbnailFile(thumb);
      }
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setUploadProgress(0);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }
    
    if (!formData.product_id) {
      alert('Please select a product');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('Please enter a title for your clip');
      return;
    }

    if (formData.amount <= 0) {
      alert('Please enter a valid cashout amount');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const clipData: CreateClipRequest = {
        ...formData,
        video: videoFile,
        thumbnail: thumbnailFile || undefined
      };
      
      await api.createClip(clipData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        navigate('/cashout-clips', { 
          state: { message: 'Clip uploaded successfully!' }
        });
      }, 1000);
    } catch (error) {
      console.error('Error uploading clip:', error);
      alert('Failed to upload clip. Please try again.');
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/cashout-clips')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b8', fontWeight: '700', fontSize: '14px' }}
      >
        <ArrowLeft size={18} />
        Back to Gallery
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Upload Payout Success</h2>
        <p style={{ color: '#a0a0b8', fontSize: '16px' }}>
          Share your successful payout to inspire and educate the community
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Video Upload */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Video File</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Upload your payout success video (MP4, MOV, AVI • Max 100MB)
          </p>
          
          {!previewUrl ? (
            <label style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}>
              <Video size={48} color="#6b6b7d" style={{ marginBottom: '16px' }} />
              <span style={{ fontSize: '16px', color: '#a0a0b8', textAlign: 'center', marginBottom: '8px' }}>
                Click to upload video
              </span>
              <span style={{ fontSize: '12px', color: '#6b6b7d', textAlign: 'center' }}>
                Supported formats: MP4, MOV, AVI<br />
                Maximum file size: 100MB
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'relative', 
                backgroundColor: '#000', 
                borderRadius: '16px', 
                overflow: 'hidden',
                aspectRatio: '16/9',
                maxWidth: '500px'
              }}>
                <video 
                  src={previewUrl} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  controls
                />
              </div>
              
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700' }}>{videoFile?.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b6b7d' }}>
                    {videoFile && formatFileSize(videoFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Selection */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Product</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Select the product this cashout clip is related to
          </p>
          
          {loadingProducts ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b6b7d' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid #6b6b7d', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Loading products...
            </div>
          ) : (
            <select
              value={formData.product_id}
              onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
              required
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#0d0d12', color: 'white' }}>
                Select a product...
              </option>
              {products.map(product => (
                <option key={product.id} value={product.id} style={{ backgroundColor: '#0d0d12', color: 'white' }}>
                  {product.name} - ${product.price.toFixed(2)} ({product.category})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Title */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Title</h3>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., High-Yield Asset Payout Success"
            required
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Payout Amount */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Payout Amount</h3>
          <div style={{ position: 'relative' }}>
            <DollarSign size={20} color="#6b6b7d" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
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
          </div>
          <p style={{ fontSize: '12px', color: '#6b6b7d', marginTop: '8px' }}>
            Enter the amount you successfully received
          </p>
        </div>

        {/* Cashout Type */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Cashout Method</h3>
          <select
            value={formData.cashout_type}
            onChange={(e) => setFormData(prev => ({ ...prev, cashout_type: e.target.value as CashoutClipType }))}
            required
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            {Object.values(CashoutClipType).map(type => (
              <option key={type} value={type} style={{ backgroundColor: '#0d0d12', color: 'white' }}>
                {getCashoutTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Payment Method (Optional)</h3>
          <input
            type="text"
            value={formData.payment_method || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
            placeholder="e.g., Chase Bank, Bitcoin Wallet, etc."
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b6b7d', marginTop: '8px' }}>
            Specify the bank or service used
          </p>
        </div>

        {/* Description */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Description (Optional)</h3>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your cashout process, tools used, or any tips for the community..."
            style={{
              width: '100%',
              minHeight: '100px',
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
        </div>

        {/* Tags */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Tags (Optional)</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Select relevant tags to help others find your clip
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
                  backgroundColor: formData.tags?.includes(tag) ? 'rgba(255, 0, 242, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: formData.tags?.includes(tag) ? '#ff00f2' : '#a0a0b8',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Progress */}
        {submitting && (
          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Uploading...</h3>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${uploadProgress}%`, 
                  height: '100%', 
                  backgroundColor: '#ff00f2',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
            <p style={{ fontSize: '14px', color: '#6b6b7d', marginTop: '8px' }}>
              {uploadProgress.toFixed(0)}% complete
            </p>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/cashout-clips')}
            disabled={submitting}
            style={{
              padding: '16px 32px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: submitting ? '#374151' : '#6b6b7d',
              fontWeight: '700',
              fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !videoFile || !formData.title.trim() || !formData.product_id || formData.amount <= 0}
            style={{
              padding: '16px 32px',
              backgroundColor: submitting ? 'rgba(255, 0, 242, 0.5)' : '#ff00f2',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '800',
              fontSize: '16px',
              cursor: submitting || !videoFile || !formData.title.trim() || !formData.product_id || formData.amount <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Clip
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClipUpload;