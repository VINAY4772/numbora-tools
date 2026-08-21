import React, { useState, useEffect } from 'react';
import { Image, Upload, Download, ArrowRight, Check, RefreshCw } from 'lucide-react';

export default function ImageCompressor({ onCopyToast }) {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);

  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState('image/jpeg'); // 'image/jpeg' | 'image/webp' | 'image/png'
  const [compressedUrl, setCompressedUrl] = useState('');
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Compress image on Canvas
  useEffect(() => {
    if (!originalUrl) return;

    setIsCompressing(true);
    const img = new window.Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = format;
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);

      setCompressedUrl(dataUrl);

      // Estimate compressed size from base64
      const head = `data:${mimeType};base64,`;
      const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setCompressedSize(sizeInBytes);
      setIsCompressing(false);
    };
  }, [originalUrl, quality, format]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savingsPct = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
    link.download = `compressed_${Date.now()}.${ext}`;
    link.href = compressedUrl;
    link.click();
    if (onCopyToast) onCopyToast('Compressed image downloaded!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* File Dropzone */}
      {!originalFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="glass-card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
            border: '2px dashed var(--border-highlight)',
            cursor: 'pointer'
          }}
        >
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          />
          <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <Upload size={32} color="var(--accent-tertiary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Drop your image here or click to browse</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supports PNG, JPEG, WebP (100% Client-side processing)</p>
            </div>
          </label>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Controls & Metrics */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                  <Image size={20} color="var(--accent-tertiary)" /> Compression Settings
                </h3>
                <button className="btn-icon" onClick={() => { setOriginalFile(null); setOriginalUrl(''); }} title="Change Image">
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Quality Slider */}
              <div className="input-group">
                <div className="input-label">
                  <span>Compression Quality</span>
                  <strong style={{ color: 'var(--accent-tertiary)', fontSize: '1.1rem' }}>{quality}%</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </div>

              {/* Format selector */}
              <div className="input-group" style={{ marginTop: '16px' }}>
                <label className="input-label">Target Format</label>
                <select className="input-control" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/webp">WebP (.webp - NextGen)</option>
                  <option value="image/png">PNG (.png)</option>
                </select>
              </div>

              {/* Size metrics comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original Size</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {formatBytes(originalSize)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compressed Size</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-tertiary)', marginTop: '4px' }}>
                    {formatBytes(compressedSize)}
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
                color: '#10b981',
                fontWeight: 700
              }}>
                🎉 Reduced by {savingsPct}% ({formatBytes(Math.max(0, originalSize - compressedSize))} saved)
              </div>
            </div>

            <button className="btn btn-success" style={{ width: '100%', padding: '14px', marginTop: '20px' }} onClick={handleDownload}>
              <Download size={18} /> Download Compressed Image
            </button>
          </div>

          {/* Visual Side-by-side Preview */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Visual Preview</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Compressed Result ({quality}%)</div>
                <img
                  src={compressedUrl}
                  alt="Compressed preview"
                  style={{ maxHeight: '280px', maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
