import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer style={{
      marginTop: '80px',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      padding: '40px 24px 24px 24px',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <img src="/images/logo-icon.png" alt="Numbora Emblem" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                Num<span style={{ color: 'var(--accent-emerald, #22a945)' }}>bora</span>
              </h3>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Count on Everything
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Free, fast, and private online tools suite. All calculations and transformations run 100% locally in your browser.
          </p>
        </div>

        {/* Categories Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <button onClick={() => onSelectCategory('calculators')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                Financial & Physical Calculators
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('student-tools')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                Student & Academic Tools
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('utility-tools')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                Utility Generators & Converters
              </button>
            </li>
          </ul>
        </div>

        {/* Privacy Guarantee */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="var(--accent-tertiary)" /> Privacy First
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            No data is sent to external servers or logged. Your inputs, generated QR codes, passwords, and compressed images remain on your device.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} Numbora. Count on Everything. Crafted for speed and privacy.
      </div>
    </footer>
  );
}
