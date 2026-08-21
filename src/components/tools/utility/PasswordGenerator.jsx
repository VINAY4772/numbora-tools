import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_LIST = [
  'correct', 'horse', 'battery', 'staple', 'rocket', 'galaxy', 'shadow', 'thunder',
  'phoenix', 'crystal', 'dragon', 'horizon', 'cyber', 'matrix', 'velvet', 'quantum',
  'vector', 'shield', 'banner', 'forest', 'ocean', 'sunset', 'nebula', 'solstice',
  'aurora', 'beacon', 'breeze', 'canyon', 'falcon', 'glacier', 'harbor', 'island'
];

export default function PasswordGenerator({ onCopyToast }) {
  const [mode, setMode] = useState('random'); // 'random' | 'passphrase'
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // Passphrase settings
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    if (mode === 'passphrase') {
      const selected = [];
      for (let i = 0; i < wordCount; i++) {
        const randIndex = Math.floor(Math.random() * WORD_LIST.length);
        selected.push(WORD_LIST[randIndex]);
      }
      setPassword(selected.join(separator));
      return;
    }

    let charPool = '';
    if (useUpper) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charPool += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charPool += '0123456789';
    if (useSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charPool) {
      setPassword('Select at least 1 option');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charPool[array[i] % charPool.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, mode, wordCount, separator]);

  // Calculate Strength & Entropy
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let strengthLabel = 'Weak';
  let strengthColor = '#ef4444';
  if (score >= 4) { strengthLabel = 'Very Strong'; strengthColor = '#10b981'; }
  else if (score === 3) { strengthLabel = 'Strong'; strengthColor = '#3b82f6'; }
  else if (score === 2) { strengthLabel = 'Medium'; strengthColor = '#f59e0b'; }

  const handleCopy = () => {
    if (!password || password.startsWith('Select')) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    if (onCopyToast) onCopyToast('Password copied securely!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Generated Password Showcase Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Generated Password
            </span>
            <button className="btn-icon" onClick={generatePassword} title="Generate New">
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Password Box */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            textAlign: 'center',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '1px',
            position: 'relative',
            marginBottom: '16px'
          }}>
            {password}
          </div>

          {/* Strength Bar */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Security Strength</span>
              <strong style={{ color: strengthColor }}>{strengthLabel}</strong>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-input)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(score / 5) * 100}%`, background: strengthColor, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '20px' }} onClick={handleCopy}>
          {copied ? <Check size={18} color="#ffffff" /> : <Copy size={18} />}
          {copied ? 'Copied Password!' : 'Copy Password'}
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '20px' }}>
          <Key size={20} color="var(--accent-tertiary)" /> Generator Options
        </h3>

        {/* Mode Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setMode('random')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'random' ? 'var(--gradient-emerald)' : 'transparent',
              color: mode === 'random' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Random Characters
          </button>
          <button
            onClick={() => setMode('passphrase')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'passphrase' ? 'var(--gradient-emerald)' : 'transparent',
              color: mode === 'passphrase' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Memorable Passphrase
          </button>
        </div>

        {mode === 'random' ? (
          <>
            {/* Length slider */}
            <div className="input-group">
              <div className="input-label">
                <span>Password Length</span>
                <strong style={{ color: 'var(--accent-tertiary)', fontSize: '1.1rem' }}>{length} chars</strong>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>

            {/* Checkbox Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-tertiary)' }} />
                Include Uppercase Letters (A-Z)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-tertiary)' }} />
                Include Lowercase Letters (a-z)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-tertiary)' }} />
                Include Numbers (0-9)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-tertiary)' }} />
                Include Symbols (@#$%^&*)
              </label>
            </div>
          </>
        ) : (
          <>
            {/* Word Count */}
            <div className="input-group">
              <div className="input-label">
                <span>Number of Words</span>
                <strong style={{ color: 'var(--accent-tertiary)' }}>{wordCount} words</strong>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
              />
            </div>

            <div className="input-group" style={{ marginTop: '16px' }}>
              <label className="input-label">Word Separator</label>
              <select className="input-control" value={separator} onChange={(e) => setSeparator(e.target.value)}>
                <option value="-">Hyphen (-)</option>
                <option value=".">Period (.)</option>
                <option value="_">Underscore (_)</option>
                <option value="@">At Sign (@)</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
