import React, { useState } from 'react';
import { CheckSquare, AlertTriangle, PartyPopper, RotateCcw, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AttendanceCalculator({ onCopyToast }) {
  const [attended, setAttended] = useState(48);
  const [totalClasses, setTotalClasses] = useState(60);
  const [targetPct, setTargetPct] = useState(75);
  const [copied, setCopied] = useState(false);

  const currentPct = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;

  // Calculation for classes needed / bunkable
  let classesNeeded = 0;
  let classesBunkable = 0;

  if (currentPct < targetPct) {
    // Formula for classes needed:
    // (attended + N) / (totalClasses + N) >= targetPct / 100
    // attended + N >= (targetPct / 100) * totalClasses + (targetPct / 100) * N
    // N * (1 - targetPct / 100) >= (targetPct / 100) * totalClasses - attended
    // N = ceil( (targetPct * totalClasses - 100 * attended) / (100 - targetPct) )
    const num = (targetPct * totalClasses) - (100 * attended);
    const den = 100 - targetPct;
    classesNeeded = den > 0 ? Math.ceil(num / den) : 0;
  } else {
    // Formula for classes bunkable:
    // attended / (totalClasses + B) >= targetPct / 100
    // 100 * attended >= targetPct * (totalClasses + B)
    // B = floor( (100 * attended - targetPct * totalClasses) / targetPct )
    const num = (100 * attended) - (targetPct * totalClasses);
    classesBunkable = targetPct > 0 ? Math.floor(num / targetPct) : 0;
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setAttended(48);
    setTotalClasses(60);
    setTargetPct(75);
  };

  const handleCopy = () => {
    const text = `Attendance Report: ${currentPct.toFixed(1)}% (${attended}/${totalClasses} classes). Target: ${targetPct}%. ${currentPct >= targetPct ? `Can skip ${classesBunkable} classes.` : `Must attend ${classesNeeded} upcoming classes.`}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('Attendance status copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Controls */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <CheckSquare size={20} color="var(--accent-secondary)" /> Attendance Details
          </h3>
          <button className="btn-icon" onClick={handleReset} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="input-group">
          <label className="input-label">Classes Attended (Present)</label>
          <input
            type="number"
            className="input-control"
            min="0"
            value={attended}
            onChange={(e) => setAttended(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Total Classes Held</label>
          <input
            type="number"
            className="input-control"
            min="1"
            value={totalClasses}
            onChange={(e) => setTotalClasses(Math.max(1, Number(e.target.value)))}
          />
        </div>

        {/* Target Percentage slider */}
        <div className="input-group" style={{ marginTop: '16px' }}>
          <div className="input-label">
            <span>Target Required Percentage</span>
            <strong style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>{targetPct}%</strong>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="1"
            value={targetPct}
            onChange={(e) => setTargetPct(Number(e.target.value))}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[65, 75, 80, 85].map(val => (
              <button
                key={val}
                onClick={() => setTargetPct(val)}
                style={{
                  flex: 1,
                  padding: '4px',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: targetPct === val ? 'var(--accent-secondary)' : 'var(--bg-input)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Current Status
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Attendance</div>
            <div
              className="result-value"
              style={{
                background: currentPct >= targetPct ? 'var(--gradient-emerald)' : 'var(--gradient-sunset)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {currentPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {attended} out of {totalClasses} classes attended
            </div>
          </div>

          {/* Actionable Insights Box */}
          <div style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: currentPct >= targetPct
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)',
            border: `1px solid ${currentPct >= targetPct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {currentPct >= targetPct ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <PartyPopper size={20} /> Safe Zone!
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  You can safely skip / bunk up to <strong style={{ fontSize: '1.3rem', color: '#10b981' }}>{classesBunkable}</strong> upcoming classes while maintaining at least {targetPct}% attendance.
                </p>
                <button className="btn btn-success" style={{ marginTop: '12px', padding: '6px 14px', fontSize: '0.85rem' }} onClick={triggerConfetti}>
                  Celebrate 🎉
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <AlertTriangle size={20} /> Shortage Warning!
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  You must attend the next <strong style={{ fontSize: '1.3rem', color: '#ef4444' }}>{classesNeeded}</strong> consecutive classes without missing to reach your target of {targetPct}%.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
