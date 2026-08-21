import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 200,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--accent-tertiary)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 20px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: 'var(--text-primary)',
      fontWeight: 600,
      fontSize: '0.9rem'
    }}>
      <CheckCircle2 size={18} color="#10b981" />
      {message}
    </div>
  );
}
