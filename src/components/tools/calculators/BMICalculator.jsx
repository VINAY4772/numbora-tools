import React, { useState } from 'react';
import { Activity, Info, RotateCcw, Copy, Check } from 'lucide-react';

export default function BMICalculator({ onCopyToast }) {
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' | 'imperial'
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(172);

  // Imperial state
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(8);

  const [copied, setCopied] = useState(false);

  // Calculate BMI
  let bmi = 0;
  let healthyMinKg = 0;
  let healthyMaxKg = 0;

  if (unitSystem === 'metric') {
    const heightM = heightCm / 100;
    if (heightM > 0) {
      bmi = weightKg / (heightM * heightM);
      healthyMinKg = 18.5 * (heightM * heightM);
      healthyMaxKg = 24.9 * (heightM * heightM);
    }
  } else {
    const totalInches = (heightFt * 12) + Number(heightIn);
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
      const minLbs = (18.5 * (totalInches * totalInches)) / 703;
      const maxLbs = (24.9 * (totalInches * totalInches)) / 703;
      healthyMinKg = minLbs;
      healthyMaxKg = maxLbs;
    }
  }

  const bmiValue = bmi > 0 ? bmi.toFixed(1) : '0.0';

  // Category determination
  let category = 'Normal';
  let categoryColor = '#10b981';
  let meterPercentage = 50;
  let adviceText = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3b82f6';
    meterPercentage = Math.min(Math.max((bmi / 18.5) * 25, 5), 24);
    adviceText = 'Your BMI suggests you are underweight. Consider consulting a nutritionist for a balanced diet plan to gain healthy weight.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal weight';
    categoryColor = '#10b981';
    meterPercentage = 25 + ((bmi - 18.5) / 6.4) * 25;
    adviceText = 'Great job! Your BMI falls within the healthy body weight range. Maintain a balanced diet and regular exercise routine.';
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = '#f59e0b';
    meterPercentage = 50 + ((bmi - 25) / 4.9) * 25;
    adviceText = 'Your BMI indicates you are slightly overweight. Moderate exercise and minor dietary adjustments can help reach target weight.';
  } else {
    category = 'Obese';
    categoryColor = '#ef4444';
    meterPercentage = Math.min(75 + ((bmi - 30) / 10) * 25, 95);
    adviceText = 'Your BMI falls into the obesity category. Staying active, drinking water, and consulting a healthcare professional is recommended.';
  }

  const handleReset = () => {
    setUnitSystem('metric');
    setWeightKg(70);
    setHeightCm(172);
    setWeightLbs(154);
    setHeightFt(5);
    setHeightIn(8);
  };

  const handleCopy = () => {
    const text = `BMI Report: ${bmiValue} (${category}). Height: ${unitSystem === 'metric' ? heightCm + 'cm' : heightFt + 'ft ' + heightIn + 'in'}, Weight: ${unitSystem === 'metric' ? weightKg + 'kg' : weightLbs + 'lbs'}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('BMI results copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Controls Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <Activity size={20} color="var(--accent-primary)" /> Units & Parameters
          </h3>
          <button className="btn-icon" onClick={handleReset} title="Reset values">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Unit Selector Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setUnitSystem('metric')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: unitSystem === 'metric' ? 'var(--gradient-primary)' : 'transparent',
              color: unitSystem === 'metric' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Metric (kg, cm)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: unitSystem === 'imperial' ? 'var(--gradient-primary)' : 'transparent',
              color: unitSystem === 'imperial' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Imperial (lbs, ft)
          </button>
        </div>

        {unitSystem === 'metric' ? (
          <>
            {/* Height Slider */}
            <div className="input-group">
              <div className="input-label">
                <span>Height</span>
                <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{heightCm} cm</strong>
              </div>
              <input
                type="range"
                min="100"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
              />
              <input
                type="number"
                className="input-control"
                style={{ marginTop: '8px' }}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
              />
            </div>

            {/* Weight Slider */}
            <div className="input-group" style={{ marginTop: '20px' }}>
              <div className="input-label">
                <span>Weight</span>
                <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{weightKg} kg</strong>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
              />
              <input
                type="number"
                className="input-control"
                style={{ marginTop: '8px' }}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
              />
            </div>
          </>
        ) : (
          <>
            {/* Feet & Inches */}
            <div className="input-group">
              <div className="input-label">Height (Feet & Inches)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Feet</span>
                  <input
                    type="number"
                    className="input-control"
                    min="3"
                    max="8"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inches</span>
                  <input
                    type="number"
                    className="input-control"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Weight Lbs */}
            <div className="input-group">
              <div className="input-label">
                <span>Weight</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{weightLbs} lbs</strong>
              </div>
              <input
                type="range"
                min="60"
                max="450"
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
              />
              <input
                type="number"
                className="input-control"
                style={{ marginTop: '8px' }}
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>

      {/* Output & Analysis Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Calculated BMI Result
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Body Mass Index</div>
            <div className="result-value">{bmiValue}</div>
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: categoryColor + '20',
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {category}
            </div>
          </div>

          {/* BMI Scale Meter */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (&gt;30)</span>
            </div>
            <div style={{ height: '12px', borderRadius: '6px', background: 'linear-gradient(to right, #3b82f6 0%, #10b981 35%, #f59e0b 70%, #ef4444 100%)', position: 'relative' }}>
              {/* Meter Cursor Pointer */}
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: `${meterPercentage}%`,
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ffffff',
                border: `3px solid ${categoryColor}`,
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>
        </div>

        {/* Advice & Healthy Range */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            <Info size={16} color="var(--accent-secondary)" /> Recommendations
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{adviceText}</p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ideal Healthy Weight Range for your height: <strong>
              {unitSystem === 'metric'
                ? `${healthyMinKg.toFixed(1)} kg - ${healthyMaxKg.toFixed(1)} kg`
                : `${healthyMinKg.toFixed(1)} lbs - ${healthyMaxKg.toFixed(1)} lbs`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
