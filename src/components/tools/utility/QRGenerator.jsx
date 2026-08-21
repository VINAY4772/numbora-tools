import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, RefreshCw, Wifi, Mail, Link, User } from 'lucide-react';

export default function QRGenerator({ onCopyToast }) {
  const [type, setType] = useState('text'); // 'text' | 'url' | 'wifi' | 'email' | 'contact'
  const [textValue, setTextValue] = useState('https://github.com');
  const [copied, setCopied] = useState(false);

  // WiFi fields
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SecretPass123');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');

  // Email fields
  const [emailTo, setEmailTo] = useState('support@example.com');
  const [emailSubject, setEmailSubject] = useState('Hello');
  const [emailBody, setEmailBody] = useState('Sent via QR Code');

  // Customization options
  const [fgColor, setFgColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M'); // L, M, Q, H

  const canvasRef = useRef(null);

  // Construct payloads
  let payload = textValue;
  if (type === 'url') {
    payload = textValue.startsWith('http') ? textValue : `https://${textValue}`;
  } else if (type === 'wifi') {
    payload = `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
  } else if (type === 'email') {
    payload = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }

  // Draw QR code on Canvas whenever payload or settings change
  useEffect(() => {
    if (canvasRef.current && payload) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: errorLevel
      }, (err) => {
        if (err) console.error('QR Render Error:', err);
      });
    }
  }, [payload, fgColor, bgColor, qrSize, errorLevel]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode_${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      if (onCopyToast) onCopyToast('QR Code PNG image downloaded!');
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    if (onCopyToast) onCopyToast('QR payload copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Settings & Inputs */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '20px' }}>
          <QrCode size={20} color="var(--accent-tertiary)" /> QR Code Contents
        </h3>

        {/* Input Type Selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button
            onClick={() => { setType('text'); setTextValue('Hello World'); }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: type === 'text' ? 'var(--gradient-emerald)' : 'var(--bg-input)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Plain Text
          </button>
          <button
            onClick={() => { setType('url'); setTextValue('https://google.com'); }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: type === 'url' ? 'var(--gradient-emerald)' : 'var(--bg-input)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Website Link
          </button>
          <button
            onClick={() => setType('wifi')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: type === 'wifi' ? 'var(--gradient-emerald)' : 'var(--bg-input)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Wi-Fi Credentials
          </button>
          <button
            onClick={() => setType('email')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: type === 'email' ? 'var(--gradient-emerald)' : 'var(--bg-input)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Email Draft
          </button>
        </div>

        {/* Dynamic Fields */}
        {type === 'text' && (
          <div className="input-group">
            <label className="input-label">Enter Text</label>
            <textarea
              className="input-control"
              rows={4}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Type any message..."
            />
          </div>
        )}

        {type === 'url' && (
          <div className="input-group">
            <label className="input-label">Website URL</label>
            <input
              type="text"
              className="input-control"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        {type === 'wifi' && (
          <>
            <div className="input-group">
              <label className="input-label">Wi-Fi Network Name (SSID)</label>
              <input
                type="text"
                className="input-control"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-control"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Security Type</label>
              <select
                className="input-control"
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value)}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (No Password)</option>
              </select>
            </div>
          </>
        )}

        {type === 'email' && (
          <>
            <div className="input-group">
              <label className="input-label">Recipient Email</label>
              <input
                type="email"
                className="input-control"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Subject</label>
              <input
                type="text"
                className="input-control"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Body</label>
              <textarea
                className="input-control"
                rows={2}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Custom Styling */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            QR Style & Colors
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">Foreground Color</label>
              <input
                type="color"
                className="input-control"
                style={{ height: '40px', padding: '2px', cursor: 'pointer' }}
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Background Color</label>
              <input
                type="color"
                className="input-control"
                style={{ height: '40px', padding: '2px', cursor: 'pointer' }}
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Live Preview
          </span>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopyPayload}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied Data' : 'Copy Data'}
          </button>
        </div>

        {/* Rendered Canvas */}
        <div style={{
          padding: '20px',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px 0'
        }}>
          <canvas ref={canvasRef} />
        </div>

        <button className="btn btn-success" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} onClick={handleDownload}>
          <Download size={18} /> Download PNG Image
        </button>
      </div>
    </div>
  );
}
