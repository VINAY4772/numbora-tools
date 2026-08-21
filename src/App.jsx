import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Hero from './components/layout/Hero';
import Footer from './components/layout/Footer';
import SearchModal from './components/layout/SearchModal';
import Toast from './components/ui/Toast';

import { TOOLS, CATEGORIES } from './data/toolsData';

// Icons import
import {
  Activity, Calendar, DollarSign, Receipt,
  GraduationCap, Percent, CheckSquare, BookOpen,
  QrCode, Repeat, Key, Image,
  ArrowLeft, Star, Sparkles, ChevronRight, Calculator, Wrench
} from 'lucide-react';

// Tool Components Import
import BMICalculator from './components/tools/calculators/BMICalculator';
import AgeCalculator from './components/tools/calculators/AgeCalculator';
import EMICalculator from './components/tools/calculators/EMICalculator';
import GSTCalculator from './components/tools/calculators/GSTCalculator';

import CGPACalculator from './components/tools/student/CGPACalculator';
import PercentageCalculator from './components/tools/student/PercentageCalculator';
import AttendanceCalculator from './components/tools/student/AttendanceCalculator';
import MarksCalculator from './components/tools/student/MarksCalculator';

import QRGenerator from './components/tools/utility/QRGenerator';
import UnitConverter from './components/tools/utility/UnitConverter';
import PasswordGenerator from './components/tools/utility/PasswordGenerator';
import ImageCompressor from './components/tools/utility/ImageCompressor';

const ICON_MAP = {
  Activity, Calendar, DollarSign, Receipt,
  GraduationCap, Percent, CheckSquare, BookOpen,
  QrCode, Repeat, Key, Image
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeToolId, setActiveToolId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [favorites, setFavorites] = useState(['bmi-calculator', 'cgpa-calculator', 'qr-generator']);

  // Update theme data-theme on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setActiveToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (toolId) => {
    setActiveToolId(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (e, toolId) => {
    e.stopPropagation();
    if (favorites.includes(toolId)) {
      setFavorites(favorites.filter(id => id !== toolId));
      setToastMessage('Removed from Favorites');
    } else {
      setFavorites([...favorites, toolId]);
      setToastMessage('Added to Favorites');
    }
  };

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  // Render correct Tool Component based on activeToolId
  const renderActiveToolComponent = () => {
    if (!activeToolId) return null;
    switch (activeToolId) {
      case 'bmi-calculator': return <BMICalculator onCopyToast={setToastMessage} />;
      case 'age-calculator': return <AgeCalculator onCopyToast={setToastMessage} />;
      case 'emi-calculator': return <EMICalculator onCopyToast={setToastMessage} />;
      case 'gst-calculator': return <GSTCalculator onCopyToast={setToastMessage} />;

      case 'cgpa-calculator': return <CGPACalculator onCopyToast={setToastMessage} />;
      case 'percentage-calculator': return <PercentageCalculator onCopyToast={setToastMessage} />;
      case 'attendance-calculator': return <AttendanceCalculator onCopyToast={setToastMessage} />;
      case 'marks-calculator': return <MarksCalculator onCopyToast={setToastMessage} />;

      case 'qr-generator': return <QRGenerator onCopyToast={setToastMessage} />;
      case 'unit-converter': return <UnitConverter onCopyToast={setToastMessage} />;
      case 'password-generator': return <PasswordGenerator onCopyToast={setToastMessage} />;
      case 'image-compressor': return <ImageCompressor onCopyToast={setToastMessage} />;
      default: return <div>Tool under maintenance</div>;
    }
  };

  // Group tools by Category for grid rendering
  const displayCategories = activeCategory === 'all'
    ? Object.values(CATEGORIES)
    : Object.values(CATEGORIES).filter(c => c.id === activeCategory);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background ambient lighting effects */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* Header Bar */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        activeToolId={activeToolId}
        onResetTool={() => setActiveToolId(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        favoriteToolsCount={favorites.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* VIEW A: Single Active Tool Workspace */}
        {activeToolId && activeTool ? (
          <div style={{ marginTop: '32px' }} className="animate-fade-in">
            {/* Back Bar & Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveToolId(null)}
                  style={{ padding: '8px 16px' }}
                >
                  <ArrowLeft size={18} /> Catalog
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${CATEGORIES[activeTool.category.toUpperCase().replace('-', '_')]?.badgeClass}`}>
                    {CATEGORIES[activeTool.category.toUpperCase().replace('-', '_')]?.title}
                  </span>
                  <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{activeTool.name}</h2>
                </div>
              </div>

              <button
                className="btn-icon"
                onClick={(e) => toggleFavorite(e, activeTool.id)}
                title={favorites.includes(activeTool.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star size={18} fill={favorites.includes(activeTool.id) ? '#f59e0b' : 'none'} color={favorites.includes(activeTool.id) ? '#f59e0b' : 'var(--text-muted)'} />
              </button>
            </div>

            {/* Description note */}
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1rem' }}>
              {activeTool.description}
            </p>

            {/* Rendered Tool Component */}
            {renderActiveToolComponent()}
          </div>
        ) : (
          /* VIEW B: Homepage / Category Catalog */
          <div className="animate-fade-in">
            {/* Hero Banner */}
            <Hero
              onSelectCategory={handleSelectCategory}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Favorites Bar (if any) */}
            {favorites.length > 0 && activeCategory === 'all' && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-warning)' }}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" /> Your Favorite Tools
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                  {TOOLS.filter(t => favorites.includes(t.id)).map(tool => {
                    const IconComp = ICON_MAP[tool.iconName] || Sparkles;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleSelectTool(tool.id)}
                        className="glass-card glass-card-hover"
                        style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconComp size={20} color="#f59e0b" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tool.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.tags[0]}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Categorized Tools Sections */}
            {displayCategories.map(cat => {
              const categoryTools = TOOLS.filter(t => t.category === cat.id);
              return (
                <section key={cat.id} style={{ marginBottom: '56px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }} />
                        {cat.title}
                      </h2>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{cat.description}</p>
                    </div>
                    <span className={`badge ${cat.badgeClass}`}>{categoryTools.length} Tools</span>
                  </div>

                  {/* Tools Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {categoryTools.map(tool => {
                      const IconComp = ICON_MAP[tool.iconName] || Sparkles;
                      const isFav = favorites.includes(tool.id);

                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.id)}
                          className="glass-card glass-card-hover"
                          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconComp size={22} color={cat.color} />
                              </div>

                              <button
                                className="btn-icon"
                                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent' }}
                                onClick={(e) => toggleFavorite(e, tool.id)}
                                title="Favorite"
                              >
                                <Star size={16} fill={isFav ? '#f59e0b' : 'none'} color={isFav ? '#f59e0b' : 'var(--text-muted)'} />
                              </button>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{tool.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.description}</p>
                          </div>

                          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: cat.color, fontWeight: 700 }}>
                            <span>Launch Tool</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Toast Overlay */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
