import React, { useState } from 'react';
import { DollarSign, PieChart, Table, RotateCcw, Copy, Check } from 'lucide-react';

export default function EMICalculator({ onCopyToast }) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [tenureType, setTenureType] = useState('years'); // 'years' | 'months'
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);

  const months = tenureType === 'years' ? tenureYears * 12 : tenureYears;
  const monthlyRate = interestRate / 12 / 100;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (loanAmount > 0 && months > 0) {
    if (monthlyRate === 0) {
      emi = loanAmount / months;
      totalPayment = loanAmount;
      totalInterest = 0;
    } else {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      totalPayment = emi * months;
      totalInterest = totalPayment - loanAmount;
    }
  }

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  // Generate Year-by-Year Amortization Schedule
  const amortizationSchedule = [];
  let balance = loanAmount;
  const yearlyCount = Math.ceil(months / 12);

  for (let year = 1; year <= yearlyCount; year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const currentInterest = balance * monthlyRate;
      const currentPrincipal = emi - currentInterest;
      yearInterest += currentInterest;
      yearPrincipal += Math.min(currentPrincipal, balance);
      balance -= currentPrincipal;
    }

    amortizationSchedule.push({
      year,
      principal: yearPrincipal,
      interest: yearInterest,
      totalPaid: yearPrincipal + yearInterest,
      balance: Math.max(0, balance)
    });
  }

  const handleReset = () => {
    setLoanAmount(500000);
    setInterestRate(8.5);
    setTenureYears(5);
    setTenureType('years');
  };

  const handleCopy = () => {
    const text = `Loan EMI Report: Amount ${currencySymbol}${loanAmount.toLocaleString()}, Interest ${interestRate}%, Tenure ${months} months. Monthly EMI: ${currencySymbol}${Math.round(emi).toLocaleString()}, Total Interest: ${currencySymbol}${Math.round(totalInterest).toLocaleString()}, Total Payment: ${currencySymbol}${Math.round(totalPayment).toLocaleString()}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('EMI breakdown copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Controls Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <DollarSign size={20} color="var(--accent-primary)" /> Loan Parameters
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="input-control"
                style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
              <button className="btn-icon" onClick={handleReset} title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Loan Amount Slider */}
          <div className="input-group">
            <div className="input-label">
              <span>Loan Amount</span>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                {currencySymbol}{loanAmount.toLocaleString()}
              </strong>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <input
              type="number"
              className="input-control"
              style={{ marginTop: '8px' }}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>

          {/* Interest Rate Slider */}
          <div className="input-group" style={{ marginTop: '16px' }}>
            <div className="input-label">
              <span>Annual Interest Rate (%)</span>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{interestRate}%</strong>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <input
              type="number"
              className="input-control"
              style={{ marginTop: '8px' }}
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          {/* Loan Tenure Slider & Toggle */}
          <div className="input-group" style={{ marginTop: '16px' }}>
            <div className="input-label">
              <span>Loan Tenure</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setTenureType('years')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: tenureType === 'years' ? 'var(--accent-primary)' : 'var(--bg-input)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Yr
                </button>
                <button
                  onClick={() => setTenureType('months')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: tenureType === 'months' ? 'var(--accent-primary)' : 'var(--bg-input)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Mo
                </button>
              </div>
            </div>
            <input
              type="range"
              min={tenureType === 'years' ? 1 : 1}
              max={tenureType === 'years' ? 30 : 360}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {months} Total Months
              </span>
              <strong style={{ color: 'var(--accent-primary)' }}>
                {tenureYears} {tenureType}
              </strong>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Monthly Repayment
              </span>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="result-box">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Equated Monthly Installment (EMI)</div>
              <div className="result-value">
                {currencySymbol}{Math.round(emi).toLocaleString()}
              </div>
            </div>

            {/* Visual Donut / Bar Breakdown */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ height: '14px', borderRadius: '7px', display: 'flex', overflow: 'hidden', background: 'var(--bg-input)' }}>
                <div style={{ width: `${principalRatio}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
                <div style={{ width: `${interestRatio}%`, background: 'var(--accent-pink)', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    Principal Loan Amount
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {currencySymbol}{loanAmount.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-pink)' }} />
                    Total Interest Payable
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-pink)', marginTop: '4px' }}>
                    {currencySymbol}{Math.round(totalInterest).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount Payable: </span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {currencySymbol}{Math.round(totalPayment).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={() => setShowTable(!showTable)}
          >
            <Table size={16} /> {showTable ? 'Hide Amortization Schedule' : 'View Year-by-Year Schedule'}
          </button>
        </div>
      </div>

      {/* Amortization Table */}
      {showTable && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="var(--accent-primary)" /> Yearly Payment Breakdown
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Year</th>
                  <th style={{ padding: '12px' }}>Principal Paid</th>
                  <th style={{ padding: '12px' }}>Interest Paid</th>
                  <th style={{ padding: '12px' }}>Total Paid</th>
                  <th style={{ padding: '12px' }}>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row) => (
                  <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>Year {row.year}</td>
                    <td style={{ padding: '12px', color: 'var(--accent-primary)' }}>{currencySymbol}{Math.round(row.principal).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--accent-pink)' }}>{currencySymbol}{Math.round(row.interest).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{currencySymbol}{Math.round(row.totalPaid).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{currencySymbol}{Math.round(row.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
