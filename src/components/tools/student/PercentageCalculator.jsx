import React, { useState } from 'react';
import { Percent, ArrowRightLeft, TrendingUp, Award, Copy, Check, RotateCcw } from 'lucide-react';

export default function PercentageCalculator({ onCopyToast }) {
  const [activeTab, setActiveTab] = useState('of'); // 'of' | 'isWhat' | 'change' | 'marks'
  const [copied, setCopied] = useState(false);

  // Tab 1: X% of Y
  const [val1Of, setVal1Of] = useState(15);
  const [val2Of, setVal2Of] = useState(250);

  // Tab 2: X is what % of Y
  const [val1Is, setVal1Is] = useState(45);
  const [val2Is, setVal2Is] = useState(180);

  // Tab 3: % Change
  const [fromVal, setFromVal] = useState(100);
  const [toVal, setToVal] = useState(140);

  // Tab 4: Marks
  const [obtainedMarks, setObtainedMarks] = useState(425);
  const [totalMarks, setTotalMarks] = useState(500);

  // Results
  const resultOf = (val1Of * val2Of) / 100;
  const resultIsWhat = val2Is !== 0 ? (val1Is / val2Is) * 100 : 0;
  const changeDiff = toVal - fromVal;
  const resultChangePct = fromVal !== 0 ? (changeDiff / Math.abs(fromVal)) * 100 : 0;
  const resultMarksPct = totalMarks !== 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('Result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Mode Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <button
          onClick={() => setActiveTab('of')}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: activeTab === 'of' ? 'var(--gradient-secondary)' : 'var(--bg-card)',
            color: activeTab === 'of' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '8px'
          }}
        >
          <Percent size={18} /> X% of Y
        </button>
        <button
          onClick={() => setActiveTab('isWhat')}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: activeTab === 'isWhat' ? 'var(--gradient-secondary)' : 'var(--bg-card)',
            color: activeTab === 'isWhat' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '8px'
          }}
        >
          <ArrowRightLeft size={18} /> X is What % of Y
        </button>
        <button
          onClick={() => setActiveTab('change')}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: activeTab === 'change' ? 'var(--gradient-secondary)' : 'var(--bg-card)',
            color: activeTab === 'change' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '8px'
          }}
        >
          <TrendingUp size={18} /> % Change (Inc/Dec)
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: activeTab === 'marks' ? 'var(--gradient-secondary)' : 'var(--bg-card)',
            color: activeTab === 'marks' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '8px'
          }}
        >
          <Award size={18} /> Marks to %
        </button>
      </div>

      {/* Main Tab Workspace */}
      <div className="glass-card" style={{ padding: '32px' }}>
        {activeTab === 'of' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '16px' }}>Calculate Percentage of Value</h3>
              <div className="input-group">
                <label className="input-label">What is</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-control"
                    value={val1Of}
                    onChange={(e) => setVal1Of(Number(e.target.value))}
                  />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>%</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">of value</label>
                <input
                  type="number"
                  className="input-control"
                  value={val2Of}
                  onChange={(e) => setVal2Of(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="result-box">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calculated Result</div>
              <div className="result-value">{resultOf.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {val1Of}% of {val2Of} = {resultOf.toFixed(2)}
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => handleCopy(`${val1Of}% of ${val2Of} = ${resultOf.toFixed(2)}`)}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'isWhat' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '16px' }}>Calculate What Percentage X is of Y</h3>
              <div className="input-group">
                <label className="input-label">Value X</label>
                <input
                  type="number"
                  className="input-control"
                  value={val1Is}
                  onChange={(e) => setVal1Is(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">is what percentage of Y?</label>
                <input
                  type="number"
                  className="input-control"
                  value={val2Is}
                  onChange={(e) => setVal2Is(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="result-box">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Percentage Result</div>
              <div className="result-value">{resultIsWhat.toFixed(2)}%</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {val1Is} is {resultIsWhat.toFixed(2)}% of {val2Is}
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => handleCopy(`${val1Is} is ${resultIsWhat.toFixed(2)}% of ${val2Is}`)}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'change' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '16px' }}>Calculate Percentage Difference</h3>
              <div className="input-group">
                <label className="input-label">Initial Value (From)</label>
                <input
                  type="number"
                  className="input-control"
                  value={fromVal}
                  onChange={(e) => setFromVal(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Final Value (To)</label>
                <input
                  type="number"
                  className="input-control"
                  value={toVal}
                  onChange={(e) => setToVal(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="result-box">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {resultChangePct >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}
              </div>
              <div
                className="result-value"
                style={{
                  background: resultChangePct >= 0 ? 'var(--gradient-emerald)' : 'var(--gradient-sunset)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {resultChangePct >= 0 ? '+' : ''}{resultChangePct.toFixed(2)}%
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Difference: {changeDiff >= 0 ? '+' : ''}{changeDiff} ({fromVal} → {toVal})
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => handleCopy(`Change from ${fromVal} to ${toVal}: ${resultChangePct >= 0 ? '+' : ''}${resultChangePct.toFixed(2)}%`)}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'marks' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '16px' }}>Student Marks to Percentage</h3>
              <div className="input-group">
                <label className="input-label">Marks Obtained</label>
                <input
                  type="number"
                  className="input-control"
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Total Maximum Marks</label>
                <input
                  type="number"
                  className="input-control"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="result-box">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Overall Score Percentage</div>
              <div className="result-value">{resultMarksPct.toFixed(2)}%</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Score: {obtainedMarks} / {totalMarks}
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => handleCopy(`Score: ${obtainedMarks} / ${totalMarks} = ${resultMarksPct.toFixed(2)}%`)}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
