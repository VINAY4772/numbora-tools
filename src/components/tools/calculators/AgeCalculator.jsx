import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

export default function AgeCalculator({ onCopyToast }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(todayStr);
  const [copied, setCopied] = useState(false);
  const [nowTime, setNowTime] = useState(new Date());

  // Live ticker for exact hours/minutes/seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const birth = new Date(birthDate + 'T00:00:00');
  const target = targetDate === todayStr ? nowTime : new Date(targetDate + 'T23:59:59');

  let years = 0, months = 0, days = 0;
  let totalDays = 0, totalHours = 0, totalMinutes = 0, totalSeconds = 0;
  let totalMonths = 0, totalWeeks = 0;
  let nextBirthdayCountdown = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  let zodiacSign = '';

  if (!isNaN(birth.getTime()) && !isNaN(target.getTime()) && target >= birth) {
    const diffMs = target.getTime() - birth.getTime();

    totalSeconds = Math.floor(diffMs / 1000);
    totalMinutes = Math.floor(totalSeconds / 60);
    totalHours = Math.floor(totalMinutes / 60);
    totalDays = Math.floor(totalHours / 24);
    totalWeeks = Math.floor(totalDays / 7);

    // Exact years, months, days calculation
    let bDate = new Date(birth);
    let tDate = new Date(target);

    years = tDate.getFullYear() - bDate.getFullYear();
    months = tDate.getMonth() - bDate.getMonth();
    days = tDate.getDate() - bDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(tDate.getFullYear(), tDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    totalMonths = (years * 12) + months;

    // Next Birthday calculation
    const currentYear = nowTime.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < nowTime) {
      nextBday.setFullYear(currentYear + 1);
    }
    const bdayDiffMs = nextBday.getTime() - nowTime.getTime();
    if (bdayDiffMs > 0) {
      const bdayTotalSec = Math.floor(bdayDiffMs / 1000);
      const bdayDays = Math.floor(bdayTotalSec / (3600 * 24));
      const bdayMonths = Math.floor(bdayDays / 30.4375);
      const remDays = Math.floor(bdayDays % 30.4375);
      const remHours = Math.floor((bdayTotalSec % (3600 * 24)) / 3600);
      const remMins = Math.floor((bdayTotalSec % 3600) / 60);
      const remSecs = bdayTotalSec % 60;

      nextBirthdayCountdown = {
        months: bdayMonths,
        days: remDays,
        hours: remHours,
        minutes: remMins,
        seconds: remSecs
      };
    }

    // Zodiac Sign Determination
    const m = birth.getMonth() + 1;
    const d = birth.getDate();
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiacSign = 'Aries ♈';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiacSign = 'Taurus ♉';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiacSign = 'Gemini ♊';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiacSign = 'Cancer ♋';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiacSign = 'Leo ♌';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiacSign = 'Virgo ♍';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiacSign = 'Libra ♎';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiacSign = 'Scorpio ♏';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiacSign = 'Sagittarius ♐';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiacSign = 'Capricorn ♑';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiacSign = 'Aquarius ♒';
    else zodiacSign = 'Pisces ♓';
  }

  const handleCopy = () => {
    const text = `Exact Age: ${years} Years, ${months} Months, ${days} Days. (${totalDays.toLocaleString()} total days). Zodiac: ${zodiacSign}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopyToast) onCopyToast('Age breakdown copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBirthDate('2000-01-15');
    setTargetDate(todayStr);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Input controls */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <Calendar size={20} color="var(--accent-primary)" /> Select Dates
          </h3>
          <button className="btn-icon" onClick={handleReset} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="input-group">
          <label className="input-label">Date of Birth</label>
          <input
            type="date"
            className="input-control"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <div className="input-group" style={{ marginTop: '16px' }}>
          <div className="input-label">
            <span>Age at Date</span>
            {targetDate === todayStr && <span className="badge badge-calculator" style={{ fontSize: '0.65rem' }}>Today</span>}
          </div>
          <input
            type="date"
            className="input-control"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        {/* Zodiac Sign Card */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Astrological Sign</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{zodiacSign}</div>
          </div>
          <Sparkles size={24} color="var(--accent-pink)" />
        </div>
      </div>

      {/* Results Display */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Calculated Exact Age
            </span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="result-box">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You are currently</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '8px 0', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {years} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', WebkitTextFillColor: 'var(--text-secondary)' }}>yrs</span>{' '}
              {months} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', WebkitTextFillColor: 'var(--text-secondary)' }}>mos</span>{' '}
              {days} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', WebkitTextFillColor: 'var(--text-secondary)' }}>days</span>
            </div>
          </div>

          {/* Time Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Months</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalMonths.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Weeks</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalWeeks.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Days</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalDays.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Hours</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalHours.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Next Birthday Live Countdown */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '8px' }}>
            <Clock size={16} /> Countdown to Next Birthday
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{nextBirthdayCountdown.months}</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Months</div>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{nextBirthdayCountdown.days}</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{nextBirthdayCountdown.hours}</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hours</div>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{nextBirthdayCountdown.minutes}</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mins</div>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{nextBirthdayCountdown.seconds}</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
