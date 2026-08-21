function initTimeDurationCalculator() {
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');

  const durHours = document.getElementById('dur-hours');
  const durMins = document.getElementById('dur-mins');
  const durSecs = document.getElementById('dur-secs');
  const totMins = document.getElementById('tot-mins');
  const totSecs = document.getElementById('tot-secs');

  const btnNow = document.getElementById('btn-now');
  const btnClear = document.getElementById('btn-clear-time');

  if (!startTimeInput || !endTimeInput || !durHours || !durMins) return;

  function resetZeros() {
    durHours.textContent = '0';
    durMins.textContent = '0';
    if (durSecs) durSecs.textContent = '0';
    if (totMins) totMins.textContent = '0';
    if (totSecs) totSecs.textContent = '0';
  }

  function calculateTimeDuration() {
    const t1 = startTimeInput.value;
    const t2 = endTimeInput.value;

    if (!t1 || !t2) {
      resetZeros();
      return;
    }

    const p1 = t1.split(':').map(Number);
    const p2 = t2.split(':').map(Number);

    const h1 = p1[0] || 0;
    const m1 = p1[1] || 0;
    const s1 = p1[2] || 0;

    const h2 = p2[0] || 0;
    const m2 = p2[1] || 0;
    const s2 = p2[2] || 0;

    let startSecs = (h1 * 3600) + (m1 * 60) + s1;
    let endSecs = (h2 * 3600) + (m2 * 60) + s2;

    // Midnight crossover handling (e.g. 23:00 to 02:00)
    if (endSecs < startSecs) {
      endSecs += (24 * 3600);
    }

    const diffSecs = endSecs - startSecs;
    const totalMins = Math.floor(diffSecs / 60);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const secs = diffSecs % 60;

    durHours.textContent = hours;
    durMins.textContent = mins;
    if (durSecs) durSecs.textContent = secs;
    if (totMins) totMins.textContent = totalMins.toLocaleString();
    if (totSecs) totSecs.textContent = diffSecs.toLocaleString();
  }

  startTimeInput.oninput = calculateTimeDuration;
  startTimeInput.onchange = calculateTimeDuration;
  endTimeInput.oninput = calculateTimeDuration;
  endTimeInput.onchange = calculateTimeDuration;

  if (btnNow) {
    btnNow.onclick = () => {
      const now = new Date();
      const pad = num => String(num).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      if (!startTimeInput.value) {
        startTimeInput.value = timeStr;
      } else {
        endTimeInput.value = timeStr;
      }
      calculateTimeDuration();
    };
  }

  if (btnClear) {
    btnClear.onclick = () => {
      startTimeInput.value = '';
      endTimeInput.value = '';
      resetZeros();
    };
  }

  // By default show all zeros
  resetZeros();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeDurationCalculator);
} else {
  initTimeDurationCalculator();
}

window.addEventListener('load', initTimeDurationCalculator);
