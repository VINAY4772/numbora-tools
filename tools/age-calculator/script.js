function initAgeCalculator() {
  const birthInput = document.getElementById('birth-date');
  const targetInput = document.getElementById('target-date');

  const ageYears = document.getElementById('age-years');
  const ageMonths = document.getElementById('age-months');
  const ageDays = document.getElementById('age-days');

  const nextBdayText = document.getElementById('next-bday-text');
  const nextBdayDay = document.getElementById('next-bday-day');
  const zodiacSign = document.getElementById('zodiac-sign');
  const chineseZodiac = document.getElementById('chinese-zodiac');

  const totMonths = document.getElementById('tot-months');
  const totWeeks = document.getElementById('tot-weeks');
  const totDays = document.getElementById('tot-days');
  const totHours = document.getElementById('tot-hours');
  const totMinutes = document.getElementById('tot-minutes');

  const btnToday = document.getElementById('btn-today');
  const btnClear = document.getElementById('btn-clear-age');

  if (!birthInput || !targetInput || !ageYears || !ageMonths || !ageDays) return;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  targetInput.value = todayStr;

  function getZodiac(month, day) {
    const signs = [
      { sign: '♑ Capricorn', m: 1, d: 19 },
      { sign: '♒ Aquarius', m: 2, d: 18 },
      { sign: '♓ Pisces', m: 3, d: 20 },
      { sign: '♈ Aries', m: 4, d: 19 },
      { sign: '♉ Taurus', m: 5, d: 20 },
      { sign: '♊ Gemini', m: 6, d: 20 },
      { sign: '♋ Cancer', m: 7, d: 22 },
      { sign: '♌ Leo', m: 8, d: 22 },
      { sign: '♍ Virgo', m: 9, d: 22 },
      { sign: '♎ Libra', m: 10, d: 22 },
      { sign: '♏ Scorpio', m: 11, d: 21 },
      { sign: '♐ Sagittarius', m: 12, d: 21 },
      { sign: '♑ Capricorn', m: 12, d: 31 }
    ];
    for (let s of signs) {
      if (month < s.m || (month === s.m && day <= s.d)) return s.sign;
    }
    return '♑ Capricorn';
  }

  function getChineseZodiac(year) {
    const animals = ['🐀 Rat', '🐂 Ox', '🐅 Tiger', '🐇 Rabbit', '🐉 Dragon', '🐍 Snake', '🐎 Horse', '🐐 Goat', '🐒 Monkey', '🐓 Rooster', '🐕 Dog', '🐖 Pig'];
    return animals[(year - 4) % 12] || '🐉 Dragon';
  }

  function resetZeros() {
    ageYears.textContent = '0';
    ageMonths.textContent = '0';
    ageDays.textContent = '0';
    if (nextBdayText) nextBdayText.textContent = 'In 0 days';
    if (nextBdayDay) nextBdayDay.textContent = '-';
    if (totMonths) totMonths.textContent = '0';
    if (totWeeks) totWeeks.textContent = '0';
    if (totDays) totDays.textContent = '0';
    if (totHours) totHours.textContent = '0';
    if (totMinutes) totMinutes.textContent = '0';
  }

  function calculateAge() {
    const bVal = birthInput.value;
    const tVal = targetInput.value || todayStr;

    if (!bVal) {
      resetZeros();
      return;
    }

    const birthDate = new Date(bVal + 'T00:00:00');
    const targetDate = new Date(tVal + 'T00:00:00');

    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime()) || birthDate > targetDate) {
      resetZeros();
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    ageYears.textContent = years;
    ageMonths.textContent = months;
    ageDays.textContent = days;

    // Total life statistics
    const diffMs = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 3600 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    if (totMonths) totMonths.textContent = totalMonths.toLocaleString();
    if (totWeeks) totWeeks.textContent = totalWeeks.toLocaleString();
    if (totDays) totDays.textContent = totalDays.toLocaleString();
    if (totHours) totHours.textContent = totalHours.toLocaleString();
    if (totMinutes) totMinutes.textContent = totalMinutes.toLocaleString();

    // Zodiac
    const bMonth = birthDate.getMonth() + 1;
    const bDay = birthDate.getDate();
    if (zodiacSign) zodiacSign.textContent = getZodiac(bMonth, bDay);
    if (chineseZodiac) chineseZodiac.textContent = getChineseZodiac(birthDate.getFullYear());

    // Next Birthday Countdown
    let nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < targetDate) {
      nextBday = new Date(targetDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const daysToBday = Math.ceil((nextBday.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (nextBdayText) {
      nextBdayText.textContent = daysToBday === 0 ? '🎉 TODAY IS YOUR BIRTHDAY!' : `In ${daysToBday} day${daysToBday === 1 ? '' : 's'}`;
    }
    if (nextBdayDay) {
      nextBdayDay.textContent = dayNames[nextBday.getDay()];
    }
  }

  birthInput.oninput = calculateAge;
  birthInput.onchange = calculateAge;
  targetInput.oninput = calculateAge;
  targetInput.onchange = calculateAge;

  if (btnToday) {
    btnToday.onclick = () => {
      targetInput.value = todayStr;
      resetZeros();
    };
  }

  if (btnClear) {
    btnClear.onclick = () => {
      birthInput.value = '';
      resetZeros();
    };
  }

  calculateAge();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAgeCalculator);
} else {
  initAgeCalculator();
}

window.addEventListener('load', initAgeCalculator);
