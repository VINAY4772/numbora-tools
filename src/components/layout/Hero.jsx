import React from 'react';
import { Sparkles, Calculator, GraduationCap, Wrench, Search } from 'lucide-react';
import { CATEGORIES } from '../../data/toolsData';

export default function Hero({ onSelectCategory, onOpenSearch }) {
  return (
    <div style={{ textAlign: 'center', margin: '40px 0 60px 0', position: 'relative' }}>
      {/* Badge Pill */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: 'var(--radius-full)', background: 'rgba(34, 169, 69, 0.12)', border: '1px solid rgba(34, 169, 69, 0.25)', color: 'var(--accent-emerald, #22a945)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
        <img src="/images/logo-icon.png" alt="Numbora" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
        <span>Numbora • Count on Everything</span>
      </div>

      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '16px' }}>
        Smart Tools for <span className="gradient-text">Calculations</span>, <br />
        <span className="gradient-text-cyan">Students</span> & <span className="gradient-text-emerald">Daily Productivity</span>
      </h1>

      <p style={{ maxWidth: '680px', margin: '0 auto 32px auto', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        Instant calculation suites, grade tracking, QR generation, unit converters, password security, and image optimization — all in one sleek interface.
      </p>

      {/* Hero Quick Search Bar */}
      <div style={{ maxWidth: '520px', margin: '0 auto 48px auto', position: 'relative' }}>
        <div
          onClick={onOpenSearch}
          className="glass-card"
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            border: '1px solid var(--border-highlight)',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Search size={20} color="var(--accent-primary)" />
          <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flex: 1, textAlign: 'left' }}>
            Type to search any tool (BMI, CGPA, QR, EMI, Image...)...
          </span>
          <kbd style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1080px', margin: '0 auto' }}>
        {/* Calculators Card */}
        <div
          className="glass-card glass-card-hover"
          onClick={() => onSelectCategory('calculators')}
          style={{ padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calculator size={24} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Calculators</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              BMI, Exact Age breakdown, Loan EMI visual schedule & GST tax splits.
            </p>
            <span className="badge badge-calculator">4 Tools</span>
          </div>
        </div>

        {/* Student Tools Card */}
        <div
          className="glass-card glass-card-hover"
          onClick={() => onSelectCategory('student-tools')}
          style={{ padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={24} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Student Tools</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              CGPA, Percentage formulas, Attendance bunk/attend planner & Marks sheet.
            </p>
            <span className="badge badge-student">4 Tools</span>
          </div>
        </div>

        {/* Utility Tools Card */}
        <div
          className="glass-card glass-card-hover"
          onClick={() => onSelectCategory('utility-tools')}
          style={{ padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wrench size={24} color="#34d399" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Utility Tools</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              QR generator, 8-category Unit converter, Password generator & Image compressor.
            </p>
            <span className="badge badge-utility">4 Tools</span>
          </div>
        </div>
      </div>
    </div>
  );
}
