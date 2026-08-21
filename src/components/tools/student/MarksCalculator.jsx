import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, RotateCcw, Copy, Check, Award } from 'lucide-react';

export default function MarksCalculator({ onCopyToast }) {
  const [copied, setCopied] = useState(false);

  const initialSubjects = [
    { id: 1, name: 'Mathematics', obtained: 92, max: 100 },
    { id: 2, name: 'Physics', obtained: 85, max: 100 },
    { id: 3, name: 'Computer Science', obtained: 96, max: 100 },
    { id: 4, name: 'English', obtained: 78, max: 100 },
    { id: 5, name: 'Chemistry', obtained: 88, max: 100 }
  ];

  const [subjects, setSubjects] = useState(initialSubjects);

  const addSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects([...subjects, { id: newId, name: `Subject ${newId}`, obtained: 80, max: 100 }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Calculations
  const totalObtained = subjects.reduce((sum, s) => sum + Number(s.obtained || 0), 0);
  const totalMax = subjects.reduce((sum, s) => sum + Number(s.max || 0), 0);
  const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  // Grade calculation
  let grade = 'A+';
  let gradeColor = '#10b981';
  if (overallPercentage >= 90) { grade = 'A+'; gradeColor = '#10b981'; }
  else if (overallPercentage >= 80) { grade = 'A'; gradeColor = '#3b82f6'; }
  else if (overallPercentage >= 70) { grade = 'B'; gradeColor = '#06b6d4'; }
  else if (overallPercentage >= 60) { grade = 'C'; gradeColor = '#f59e0b'; }
  else if (overallPercentage >= 50) { grade = 'D'; gradeColor = '#f97316'; }
  else { grade = 'F'; gradeColor = '#ef4444'; }

  // High/Low subjects
  const sortedSubjects = [...subjects].sort((a, b) => {
    const pA = a.max > 0 ? (a.obtained / a.max) : 0;
    const pB = b.max > 0 ? (b.obtained / b.max) : 0;
    return pB - pA;
  });

  const topSubject = sortedSubjects[0];
  const lowestSubject = sortedSubjects[sortedSubjects.length - 1];

  const handleReset = () => {
    setSubjects(initialSubjects);
  };

  const handleCopy = () => {
    const text = `Marks Sheet: Total ${totalObtained}/${totalMax} (${overallPercentage.toFixed(2)}%). Grade: ${grade}. Subjects count: ${subjects.length}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('Marks breakdown copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Subjects Entry Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <BookOpen size={20} color="var(--accent-secondary)" /> Subject Marks Entry
          </h3>
          <button className="btn-icon" onClick={handleReset} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subjects.map((subj) => {
            const pct = subj.max > 0 ? (subj.obtained / subj.max) * 100 : 0;
            return (
              <div key={subj.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Subject name"
                  value={subj.name}
                  onChange={(e) => updateSubject(subj.id, 'name', e.target.value)}
                />
                <input
                  type="number"
                  className="input-control"
                  placeholder="Obtained"
                  value={subj.obtained}
                  onChange={(e) => updateSubject(subj.id, 'obtained', Number(e.target.value))}
                />
                <input
                  type="number"
                  className="input-control"
                  placeholder="Max"
                  value={subj.max}
                  onChange={(e) => updateSubject(subj.id, 'max', Number(e.target.value))}
                />
                <button
                  className="btn-icon"
                  style={{ color: '#ef4444' }}
                  onClick={() => removeSubject(subj.id)}
                  disabled={subjects.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={addSubject}>
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Results Summary */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Overall Exam Score
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Percentage</div>
            <div className="result-value">{overallPercentage.toFixed(2)}%</div>
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: gradeColor + '20',
              color: gradeColor,
              border: `1px solid ${gradeColor}40`,
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              Grade: {grade}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marks Obtained</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalObtained}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Max Marks</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalMax}
              </div>
            </div>
          </div>

          {/* Highlights */}
          {topSubject && lowestSubject && (
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Highest Subject</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{topSubject.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{topSubject.obtained}/{topSubject.max}</div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Lowest Subject</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{lowestSubject.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lowestSubject.obtained}/{lowestSubject.max}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
