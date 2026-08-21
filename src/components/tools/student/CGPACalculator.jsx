import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw, Copy, Check, Target } from 'lucide-react';

export default function CGPACalculator({ onCopyToast }) {
  const [scale, setScale] = useState(10); // 10 point scale or 4 point scale
  const [formulaMultiplier, setFormulaMultiplier] = useState(9.5); // 9.5 or 10
  const [copied, setCopied] = useState(false);

  const initialCourses = [
    { id: 1, name: 'Subject 1', credits: 4, gradePoint: 10 },
    { id: 2, name: 'Subject 2', credits: 3, gradePoint: 9 },
    { id: 3, name: 'Subject 3', credits: 4, gradePoint: 8 },
    { id: 4, name: 'Subject 4', credits: 3, gradePoint: 9 }
  ];

  const [courses, setCourses] = useState(initialCourses);

  // Target GPA Predictor State
  const [targetCGPA, setTargetCGPA] = useState(8.5);
  const [nextSemCredits, setNextSemCredits] = useState(20);

  const gradeOptions10 = [
    { label: 'O (Outstanding) - 10', value: 10 },
    { label: 'A+ (Excellent) - 9', value: 9 },
    { label: 'A (Very Good) - 8', value: 8 },
    { label: 'B+ (Good) - 7', value: 7 },
    { label: 'B (Above Avg) - 6', value: 6 },
    { label: 'C (Average) - 5', value: 5 },
    { label: 'P (Pass) - 4', value: 4 },
    { label: 'F (Fail) - 0', value: 0 }
  ];

  const gradeOptions4 = [
    { label: 'A (4.0)', value: 4.0 },
    { label: 'A- (3.7)', value: 3.7 },
    { label: 'B+ (3.3)', value: 3.3 },
    { label: 'B (3.0)', value: 3.0 },
    { label: 'B- (2.7)', value: 2.7 },
    { label: 'C+ (2.3)', value: 2.3 },
    { label: 'C (2.0)', value: 2.0 },
    { label: 'F (0.0)', value: 0.0 }
  ];

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: `Subject ${newId}`, credits: 3, gradePoint: scale === 10 ? 8 : 3 }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Calculations
  const totalCredits = courses.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  const totalPoints = courses.reduce((sum, c) => sum + (Number(c.credits || 0) * Number(c.gradePoint || 0)), 0);
  const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const percentage = (cgpa * formulaMultiplier).toFixed(2);

  // Grade classification
  let honors = 'First Class with Distinction';
  let honorsColor = '#10b981';
  if (scale === 10) {
    if (cgpa < 5) { honors = 'Needs Improvement'; honorsColor = '#ef4444'; }
    else if (cgpa < 6.5) { honors = 'Second Class'; honorsColor = '#f59e0b'; }
    else if (cgpa < 7.5) { honors = 'First Class'; honorsColor = '#3b82f6'; }
    else { honors = 'First Class with Distinction'; honorsColor = '#10b981'; }
  } else {
    if (cgpa < 2.0) { honors = 'Below Average'; honorsColor = '#ef4444'; }
    else if (cgpa < 3.0) { honors = 'Good Standing'; honorsColor = '#f59e0b'; }
    else if (cgpa < 3.5) { honors = 'Dean\'s List'; honorsColor = '#3b82f6'; }
    else { honors = 'Summa Cum Laude / High Distinction'; honorsColor = '#10b981'; }
  }

  // Required GPA for target CGPA
  // ( (currentTotalPoints + requiredGPA * nextSemCredits) / (totalCredits + nextSemCredits) ) = targetCGPA
  const requiredPoints = (targetCGPA * (totalCredits + nextSemCredits)) - totalPoints;
  const requiredGPA = nextSemCredits > 0 ? requiredPoints / nextSemCredits : 0;

  const handleReset = () => {
    setCourses(initialCourses);
  };

  const handleCopy = () => {
    const text = `Academic Report: CGPA ${cgpa.toFixed(2)} / ${scale}. Equivalent Percentage: ${percentage}%. Classification: ${honors}. Total Credits: ${totalCredits}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('CGPA report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Dynamic Courses Input Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <GraduationCap size={20} color="var(--accent-secondary)" /> Course & Grade Entry
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="input-control"
              style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            >
              <option value={10}>10.0 Scale</option>
              <option value={4}>4.0 Scale</option>
            </select>
            <button className="btn-icon" onClick={handleReset} title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.map((course, idx) => (
            <div key={course.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 40px', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="input-control"
                placeholder="Course name"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
              />
              <input
                type="number"
                className="input-control"
                placeholder="Credits"
                min="1"
                max="10"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
              />
              <select
                className="input-control"
                value={course.gradePoint}
                onChange={(e) => updateCourse(course.id, 'gradePoint', Number(e.target.value))}
              >
                {(scale === 10 ? gradeOptions10 : gradeOptions4).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                className="btn-icon"
                style={{ color: '#ef4444' }}
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={addCourse}>
          <Plus size={16} /> Add Subject / Course
        </button>

        {/* Target GPA Predictor Section */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
            <Target size={16} /> Target CGPA Predictor
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">Desired CGPA</label>
              <input
                type="number"
                className="input-control"
                step="0.1"
                max={scale}
                value={targetCGPA}
                onChange={(e) => setTargetCGPA(Number(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Next Sem Credits</label>
              <input
                type="number"
                className="input-control"
                value={nextSemCredits}
                onChange={(e) => setNextSemCredits(Number(e.target.value))}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
            To reach <strong>{targetCGPA}</strong> CGPA, you need a minimum GPA of:{' '}
            <strong style={{ color: requiredGPA <= scale ? 'var(--accent-tertiary)' : '#ef4444' }}>
              {requiredGPA <= 0 ? '0.00' : requiredGPA > scale ? `Impossible (${requiredGPA.toFixed(2)})` : requiredGPA.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Academic Performance Summary
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cumulative Grade Point Average</div>
            <div className="result-value">
              {cgpa.toFixed(2)} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {scale}.0</span>
            </div>
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: honorsColor + '20',
              color: honorsColor,
              border: `1px solid ${honorsColor}40`,
              fontWeight: 700,
              fontSize: '0.95rem'
            }}>
              {honors}
            </div>
          </div>

          {/* Percentage Equivalent Card */}
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Equivalent Percentage</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.75rem' }}>
                <span>Formula: </span>
                <button
                  onClick={() => setFormulaMultiplier(9.5)}
                  style={{ padding: '2px 6px', borderRadius: '4px', border: 'none', background: formulaMultiplier === 9.5 ? 'var(--accent-secondary)' : 'transparent', color: '#fff' }}
                >
                  CGPA × 9.5
                </button>
                <button
                  onClick={() => setFormulaMultiplier(10)}
                  style={{ padding: '2px 6px', borderRadius: '4px', border: 'none', background: formulaMultiplier === 10 ? 'var(--accent-secondary)' : 'transparent', color: '#fff' }}
                >
                  CGPA × 10
                </button>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
              {percentage}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Credits</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalCredits}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Grade Points</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalPoints.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
