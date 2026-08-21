import React from 'react';
import { Sparkles, Search, Sun, Moon, Grid, Bookmark } from 'lucide-react';
import { CATEGORIES } from '../../data/toolsData';

export default function Header({
  activeCategory,
  onSelectCategory,
  activeToolId,
  onResetTool,
  onOpenSearch,
  theme,
  onToggleTheme,
  favoriteToolsCount
}) {
  return (

    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Brand Logo */}
        <div
          onClick={onResetTool}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
        >
          <img
            src="/images/logo-icon.png"
            alt="Numbora Logo"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 4px 14px rgba(34, 169, 69, 0.25)',
              transition: 'transform 0.3s ease'
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', margin: 0, lineHeight: 1.1, fontWeight: 800 }}>
              Num<span style={{ color: 'var(--accent-emerald, #22a945)' }}>bora</span>
            </h1>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
              Count on Everything
            </span>
          </div>
        </div>

        {/* Center Category Navigation */}
        <nav style={{ display: 'flex', gap: '6px', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-full)' }} className="hide-mobile">
          <button
            onClick={() => onSelectCategory('all')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeCategory === 'all' && !activeToolId ? 'var(--gradient-primary)' : 'transparent',
              color: activeCategory === 'all' && !activeToolId ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            All Tools
          </button>
          {Object.values(CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeCategory === cat.id && !activeToolId ? 'var(--gradient-primary)' : 'transparent',
                color: activeCategory === cat.id && !activeToolId ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.title}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}
          >
            <Search size={16} color="var(--accent-primary)" />
            <span className="hide-mobile">Search tools...</span>
            <kbd style={{
              background: 'var(--bg-primary)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              border: '1px solid var(--border-color)'
            }}>
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>

      </div>
    </header>
  );
}
