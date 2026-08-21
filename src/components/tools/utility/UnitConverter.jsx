import React, { useState } from 'react';
import { Repeat, ArrowRightLeft, Copy, Check, RotateCcw } from 'lucide-react';

const UNIT_CONVERSIONS = {
  length: {
    title: 'Length',
    base: 'meter',
    units: {
      meter: { label: 'Meter (m)', ratio: 1 },
      kilometer: { label: 'Kilometer (km)', ratio: 1000 },
      centimeter: { label: 'Centimeter (cm)', ratio: 0.01 },
      millimeter: { label: 'Millimeter (mm)', ratio: 0.001 },
      mile: { label: 'Mile (mi)', ratio: 1609.344 },
      yard: { label: 'Yard (yd)', ratio: 0.9144 },
      foot: { label: 'Foot (ft)', ratio: 0.3048 },
      inch: { label: 'Inch (in)', ratio: 0.0254 }
    }
  },
  weight: {
    title: 'Weight / Mass',
    base: 'kilogram',
    units: {
      kilogram: { label: 'Kilogram (kg)', ratio: 1 },
      gram: { label: 'Gram (g)', ratio: 0.001 },
      milligram: { label: 'Milligram (mg)', ratio: 0.000001 },
      pound: { label: 'Pound (lb)', ratio: 0.45359237 },
      ounce: { label: 'Ounce (oz)', ratio: 0.028349523125 },
      metric_ton: { label: 'Metric Ton (t)', ratio: 1000 }
    }
  },
  temperature: {
    title: 'Temperature',
    custom: true, // Special handling for C, F, K
    units: {
      celsius: { label: 'Celsius (°C)' },
      fahrenheit: { label: 'Fahrenheit (°F)' },
      kelvin: { label: 'Kelvin (K)' }
    }
  },
  area: {
    title: 'Area',
    base: 'sq_meter',
    units: {
      sq_meter: { label: 'Square Meter (m²)', ratio: 1 },
      sq_km: { label: 'Square Kilometer (km²)', ratio: 1000000 },
      sq_foot: { label: 'Square Foot (ft²)', ratio: 0.092903 },
      sq_mile: { label: 'Square Mile (mi²)', ratio: 2589988.11 },
      acre: { label: 'Acre (ac)', ratio: 4046.85642 },
      hectare: { label: 'Hectare (ha)', ratio: 10000 }
    }
  },
  speed: {
    title: 'Speed',
    base: 'mps',
    units: {
      mps: { label: 'Meters per sec (m/s)', ratio: 1 },
      kph: { label: 'Kilometers per hr (km/h)', ratio: 0.277778 },
      mph: { label: 'Miles per hr (mph)', ratio: 0.44704 },
      knot: { label: 'Knot (kn)', ratio: 0.514444 }
    }
  },
  volume: {
    title: 'Volume',
    base: 'liter',
    units: {
      liter: { label: 'Liter (L)', ratio: 1 },
      milliliter: { label: 'Milliliter (mL)', ratio: 0.001 },
      cubic_meter: { label: 'Cubic Meter (m³)', ratio: 1000 },
      gallon_us: { label: 'Gallon (US gal)', ratio: 3.78541 }
    }
  },
  time: {
    title: 'Time',
    base: 'second',
    units: {
      second: { label: 'Second (s)', ratio: 1 },
      minute: { label: 'Minute (min)', ratio: 60 },
      hour: { label: 'Hour (h)', ratio: 3600 },
      day: { label: 'Day (d)', ratio: 86400 },
      week: { label: 'Week (wk)', ratio: 604800 },
      year: { label: 'Year (yr)', ratio: 31536000 }
    }
  },
  data: {
    title: 'Digital Storage',
    base: 'byte',
    units: {
      byte: { label: 'Byte (B)', ratio: 1 },
      kilobyte: { label: 'Kilobyte (KB)', ratio: 1024 },
      megabyte: { label: 'Megabyte (MB)', ratio: 1048576 },
      gigabyte: { label: 'Gigabyte (GB)', ratio: 1073741824 },
      terabyte: { label: 'Terabyte (TB)', ratio: 1099511627776 }
    }
  }
};

export default function UnitConverter({ onCopyToast }) {
  const [categoryKey, setCategoryKey] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [inputValue, setInputValue] = useState(1);
  const [copied, setCopied] = useState(false);

  const category = UNIT_CONVERSIONS[categoryKey];

  // Temperature converter helper
  const convertTemperature = (val, from, to) => {
    let c = val;
    if (from === 'fahrenheit') c = (val - 32) * (5 / 9);
    else if (from === 'kelvin') c = val - 273.15;

    if (to === 'celsius') return c;
    if (to === 'fahrenheit') return (c * 9 / 5) + 32;
    if (to === 'kelvin') return c + 273.15;
    return c;
  };

  let outputValue = 0;
  if (categoryKey === 'temperature') {
    outputValue = convertTemperature(inputValue, fromUnit, toUnit);
  } else {
    const fromRatio = category.units[fromUnit]?.ratio || 1;
    const toRatio = category.units[toUnit]?.ratio || 1;
    const baseVal = inputValue * fromRatio;
    outputValue = baseVal / toRatio;
  }

  const handleCategoryChange = (key) => {
    setCategoryKey(key);
    const unitKeys = Object.keys(UNIT_CONVERSIONS[key].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setInputValue(1);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    const text = `${inputValue} ${category.units[fromUnit].label} = ${outputValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${category.units[toUnit].label}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('Conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {Object.keys(UNIT_CONVERSIONS).map((key) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: categoryKey === key ? 'var(--gradient-emerald)' : 'var(--bg-card)',
              color: categoryKey === key ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {UNIT_CONVERSIONS[key].title}
          </button>
        ))}
      </div>

      {/* Main Converter Grid */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Source Input */}
          <div className="input-group">
            <label className="input-label">From Unit</label>
            <select
              className="input-control"
              style={{ marginBottom: '12px' }}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {Object.keys(category.units).map((uKey) => (
                <option key={uKey} value={uKey}>{category.units[uKey].label}</option>
              ))}
            </select>
            <input
              type="number"
              className="input-control"
              style={{ fontSize: '1.2rem', fontWeight: 700 }}
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
            />
          </div>

          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-icon" style={{ width: '48px', height: '48px' }} onClick={handleSwap} title="Swap Units">
              <ArrowRightLeft size={20} />
            </button>
          </div>

          {/* Target Output */}
          <div className="input-group">
            <label className="input-label">To Unit</label>
            <select
              className="input-control"
              style={{ marginBottom: '12px' }}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {Object.keys(category.units).map((uKey) => (
                <option key={uKey} value={uKey}>{category.units[uKey].label}</option>
              ))}
            </select>
            <div className="input-control" style={{ fontSize: '1.2rem', fontWeight: 700, background: 'var(--bg-card)', color: 'var(--accent-tertiary)' }}>
              {outputValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Conversion'}
          </button>
        </div>
      </div>

      {/* Comparison Grid Table across all units */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Equivalent values for {inputValue} {category.units[fromUnit]?.label}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.keys(category.units).map((uKey) => {
            let val = 0;
            if (categoryKey === 'temperature') {
              val = convertTemperature(inputValue, fromUnit, uKey);
            } else {
              const fromRatio = category.units[fromUnit]?.ratio || 1;
              const toRatio = category.units[uKey]?.ratio || 1;
              val = (inputValue * fromRatio) / toRatio;
            }

            return (
              <div key={uKey} style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{category.units[uKey].label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {val.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
