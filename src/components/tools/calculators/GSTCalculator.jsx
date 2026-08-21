import React, { useState } from 'react';
import { Receipt, RotateCcw, Copy, Check } from 'lucide-react';

export default function GSTCalculator({ onCopyToast }) {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState('add'); // 'add' (exclusive) | 'remove' (inclusive)
  const [currency, setCurrency] = useState('₹');
  const [copied, setCopied] = useState(false);

  const ratesPreset = [5, 12, 18, 28];

  let netAmount = 0;
  let gstAmount = 0;
  let grossAmount = 0;

  if (amount > 0 && gstRate >= 0) {
    if (mode === 'add') {
      netAmount = amount;
      gstAmount = (amount * gstRate) / 100;
      grossAmount = netAmount + gstAmount;
    } else {
      grossAmount = amount;
      netAmount = (amount * 100) / (100 + gstRate);
      gstAmount = grossAmount - netAmount;
    }
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const handleReset = () => {
    setAmount(10000);
    setGstRate(18);
    setMode('add');
  };

  const handleCopy = () => {
    const text = `GST Invoice Breakdown (${mode.toUpperCase()} GST ${gstRate}%): Net Amount: ${currency}${netAmount.toFixed(2)}, CGST: ${currency}${cgst.toFixed(2)}, SGST: ${currency}${sgst.toFixed(2)}, Total GST: ${currency}${gstAmount.toFixed(2)}, Total Gross: ${currency}${grossAmount.toFixed(2)}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('GST Tax breakdown copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Input controls */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <Receipt size={20} color="var(--accent-primary)" /> Tax Details
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="input-control"
              style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
            </select>
            <button className="btn-icon" onClick={handleReset} title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* GST Type Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setMode('add')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'add' ? 'var(--gradient-primary)' : 'transparent',
              color: mode === 'add' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Add GST (Exclusive)
          </button>
          <button
            onClick={() => setMode('remove')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'remove' ? 'var(--gradient-primary)' : 'transparent',
              color: mode === 'remove' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Remove GST (Inclusive)
          </button>
        </div>

        {/* Amount Input */}
        <div className="input-group">
          <label className="input-label">{mode === 'add' ? 'Initial Net Amount' : 'Total Gross Amount'}</label>
          <input
            type="number"
            className="input-control"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {/* GST Rate Preset Chips */}
        <div className="input-group" style={{ marginTop: '16px' }}>
          <div className="input-label">GST Tax Rate (%)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {ratesPreset.map((rate) => (
              <button
                key={rate}
                onClick={() => setGstRate(rate)}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: gstRate === rate ? 'var(--accent-primary)' : 'var(--bg-input)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {rate}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="0.5"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
          />
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: '4px' }}>
            Custom: <strong>{gstRate}%</strong>
          </div>
        </div>
      </div>

      {/* Analysis & Breakdown Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Calculated Tax Breakdown
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Final Gross Amount</div>
            <div className="result-value">
              {currency}{grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Price (Excl. Tax)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {currency}{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total GST ({gstRate}%)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)', marginTop: '4px' }}>
                {currency}{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* CGST / SGST split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CGST ({gstRate / 2}%)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {currency}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SGST / UTGST ({gstRate / 2}%)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {currency}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
