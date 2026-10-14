import React, { useState } from 'react';
import { itemService } from '../services/itemService';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onImagesUploaded, initialImages = [] }) => {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setError('');
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const res = await itemService.uploadImage(file);
        return res.data.imageUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updated = [...images, ...newUrls];
      setImages(updated);
      onImagesUploaded(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image. Allowed formats: JPG, PNG, WEBP.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    onImagesUploaded(updated);
  };

  return (
    <div>
      <div
        style={{
          border: '2px dashed var(--border-hover)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: '#F8FAFC',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          {uploading ? (
            <>
              <div className="spinner" style={{ width: '28px', height: '28px' }}></div>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-navy)', fontWeight: 600 }}>
                Uploading image(s)...
              </span>
            </>
          ) : (
            <>
              <UploadCloud size={36} color="var(--secondary-blue)" />
              <div style={{ fontWeight: 600, color: 'var(--primary-navy)', fontSize: '0.95rem' }}>
                Click or drag & drop item photo(s) here
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                PNG, JPG, or WEBP (Max 10MB per file)
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          {images.map((url, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                width: '84px',
                height: '84px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src={url}
                alt="Upload preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'rgba(220, 38, 38, 0.9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Remove Image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
