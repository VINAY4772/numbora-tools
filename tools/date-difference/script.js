function initDateDifferenceCalculator() {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  const diffYrs = document.getElementById('diff-yrs');
  const diffMos = document.getElementById('diff-mos');
  const diffDays = document.getElementById('diff-days');
  const totDays = document.getElementById('tot-days');
  const totWeeks = document.getElementById('tot-weeks');

  const btnToday = document.getElementById('btn-today');
  const btnClear = document.getElementById('btn-clear-date');

  if (!startDateInput || !endDateInput || !diffYrs || !diffMos || !diffDays) return;

  function resetZeros() {
    diffYrs.textContent = '0';
    diffMos.textContent = '0';
    diffDays.textContent = '0';
    if (totDays) totDays.textContent = '0';
    if (totWeeks) totWeeks.textContent = '0';
  }

  function calculateDateDifference() {
    const sVal = startDateInput.value;
    const eVal = endDateInput.value;

    if (!sVal || !eVal) {
      resetZeros();
      return;
    }

    let d1 = new Date(sVal + 'T00:00:00');
    let d2 = new Date(eVal + 'T00:00:00');

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      resetZeros();
      return;
    }

    // Handle reversed dates gracefully
    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 3600 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    diffYrs.textContent = years;
    diffMos.textContent = months;
    diffDays.textContent = days;
    if (totDays) totDays.textContent = totalDays.toLocaleString();
    if (totWeeks) totWeeks.textContent = totalWeeks.toLocaleString();
  }

  startDateInput.oninput = calculateDateDifference;
  startDateInput.onchange = calculateDateDifference;
  endDateInput.oninput = calculateDateDifference;
  endDateInput.onchange = calculateDateDifference;

  if (btnToday) {
    btnToday.onclick = () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (!startDateInput.value) {
        startDateInput.value = todayStr;
      } else {
        endDateInput.value = todayStr;
      }
      calculateDateDifference();
    };
  }

  if (btnClear) {
    btnClear.onclick = () => {
      startDateInput.value = '';
      endDateInput.value = '';
      resetZeros();
    };
  }

  // By default show all zeros
  resetZeros();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDateDifferenceCalculator);
} else {
  initDateDifferenceCalculator();
}

window.addEventListener('load', initDateDifferenceCalculator);
