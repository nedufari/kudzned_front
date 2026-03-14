import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X,
  CheckCircle2,
  Video,
  DollarSign,
  Play,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { CreateClipRequest } from '../services/api';

const ClipUpload: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateClipRequest, 'video_file'>>({
    title: '',
    description: '',
    profit_amount: 0,
    tags: []
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableTags] = useState([
    'Chase', 'Wells Fargo', 'Bank of America', 'PayPal', 'Cashout', 'Proof', 
    'Live', 'Success', 'High Balance', 'Wire Transfer', 'Crypto', 'Bitcoin'
  ]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
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
    
    if (!formData.title.trim()) {
      alert('Please enter a title for your clip');
      return;
    }

    if (formData.profit_amount <= 0) {
      alert('Please enter a valid profit amount');
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
        video_file: videoFile
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
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Upload Cashout Proof</h2>
        <p style={{ color: '#a0a0b8', fontSize: '16px' }}>
          Share your successful cashout to inspire and educate the community
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Video Upload */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Video File</h3>
          <p style={{ fontSize: '14px', color: '#6b6b7d', marginBottom: '16px' }}>
            Upload your cashout proof video (MP4, MOV, AVI • Max 100MB)
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

        {/* Title */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Title</h3>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Chase High-Balance Cashout Proof"
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

        {/* Profit Amount */}
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Profit Amount</h3>
          <div style={{ position: 'relative' }}>
            <DollarSign size={20} color="#6b6b7d" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              value={formData.profit_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, profit_amount: parseFloat(e.target.value) || 0 }))}
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
            Enter the profit amount shown in your cashout proof
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
            disabled={submitting || !videoFile || !formData.title.trim() || formData.profit_amount <= 0}
            style={{
              padding: '16px 32px',
              backgroundColor: submitting ? 'rgba(255, 0, 242, 0.5)' : '#ff00f2',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '800',
              fontSize: '16px',
              cursor: submitting || !videoFile || !formData.title.trim() || formData.profit_amount <= 0 ? 'not-allowed' : 'pointer',
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