import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Activity, Calendar, DollarSign, Receipt, GraduationCap, Percent, CheckSquare, BookOpen, QrCode, Repeat, Key, Image } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/toolsData';

const ICON_MAP = {
  Activity, Calendar, DollarSign, Receipt, GraduationCap, Percent, CheckSquare, BookOpen, QrCode, Repeat, Key, Image
};

export default function SearchModal({ isOpen, onClose, onSelectTool }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search trigger is handled in parent, but let's toggle safely
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = TOOLS.filter(tool => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start',
      justify: 'center',
      paddingTop: '80px',
      paddingLeft: '16px',
      paddingRight: '16px'
    }} onClick={onClose}>

      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: 0,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', gap: '12px' }}>
          <Search size={22} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools (e.g. BMI, CGPA, QR, Password, Attendance...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontFamily: 'var(--font-main)'
            }}
          />
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
          {filteredTools.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tools matching "{query}" found.
            </div>
          ) : (
            filteredTools.map((tool) => {
              const IconComp = ICON_MAP[tool.iconName] || Search;
              const catMeta = Object.values(CATEGORIES).find(c => c.id === tool.category);

              return (
                <div
                  key={tool.id}
                  onClick={() => { onSelectTool(tool.id); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}>
                      <IconComp size={20} color={catMeta?.color || 'var(--accent-primary)'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tool.description}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${catMeta?.badgeClass}`} style={{ fontSize: '0.65rem' }}>{catMeta?.title}</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
