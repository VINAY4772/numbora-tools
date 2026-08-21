function initCountdownTimer() {
  const targetInput = document.getElementById('target-datetime');

  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const btnReset = document.getElementById('btn-reset');

  const cntDays = document.getElementById('cnt-days');
  const cntHours = document.getElementById('cnt-hours');
  const cntMins = document.getElementById('cnt-mins');
  const cntSecs = document.getElementById('cnt-secs');
  const statusMsg = document.getElementById('timer-status-msg');
  const progressPct = document.getElementById('progress-pct');
  const progressBarFill = document.getElementById('progress-bar-fill');

  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!targetInput || !cntDays || !cntHours || !cntMins || !cntSecs) return;

  let timerId = null;
  let isRunning = false;
  let startTimeMs = null;

  // Helper to format Date for datetime-local input (YYYY-MM-DDTHH:mm)
  function formatForInput(date) {
    const pad = num => String(num).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function resetDisplayToZero() {
    pauseTimer();
    targetInput.value = '';
    cntDays.textContent = '00';
    cntHours.textContent = '00';
    cntMins.textContent = '00';
    cntSecs.textContent = '00';
    if (progressPct) progressPct.textContent = '0%';
    if (progressBarFill) progressBarFill.style.width = '0%';
    if (statusMsg) {
      statusMsg.textContent = 'Select a target date/time or choose a preset to start countdown.';
      statusMsg.style.color = 'var(--text-muted)';
    }
  }

  function updateTimer() {
    const val = targetInput.value;
    if (!val) {
      cntDays.textContent = '00';
      cntHours.textContent = '00';
      cntMins.textContent = '00';
      cntSecs.textContent = '00';
      if (progressPct) progressPct.textContent = '0%';
      if (progressBarFill) progressBarFill.style.width = '0%';
      if (statusMsg) {
        statusMsg.textContent = 'Select a target date/time or choose a preset to start countdown.';
        statusMsg.style.color = 'var(--text-muted)';
      }
      return;
    }

    const targetDate = new Date(val);
    const currentDate = new Date();
    const diffMs = targetDate.getTime() - currentDate.getTime();

    if (isNaN(diffMs)) {
      if (statusMsg) statusMsg.textContent = 'Invalid date selected.';
      return;
    }

    // Progress Bar Calculation
    if (startTimeMs && targetDate.getTime() > startTimeMs) {
      const totalDuration = targetDate.getTime() - startTimeMs;
      const elapsed = currentDate.getTime() - startTimeMs;
      let pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      if (progressPct) progressPct.textContent = `${pct.toFixed(0)}%`;
      if (progressBarFill) progressBarFill.style.width = `${pct}%`;
    }

    if (diffMs <= 0) {
      pauseTimer();
      cntDays.textContent = '00';
      cntHours.textContent = '00';
      cntMins.textContent = '00';
      cntSecs.textContent = '00';
      if (progressPct) progressPct.textContent = '100%';
      if (progressBarFill) progressBarFill.style.width = '100%';
      if (statusMsg) {
        statusMsg.textContent = '🎉 Countdown Completed! Event Reached!';
        statusMsg.style.color = 'var(--accent-rose)';
      }
      return;
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    cntDays.textContent = String(days).padStart(2, '0');
    cntHours.textContent = String(hours).padStart(2, '0');
    cntMins.textContent = String(mins).padStart(2, '0');
    cntSecs.textContent = String(secs).padStart(2, '0');

    if (statusMsg) {
      statusMsg.textContent = '⚡ Timer active & ticking down live';
      statusMsg.style.color = 'var(--primary)';
    }
  }

  function startTimer() {
    if (!targetInput.value) {
      if (statusMsg) {
        statusMsg.textContent = '⚠️ Please select a target date/time first or click a preset button!';
        statusMsg.style.color = 'var(--accent-amber)';
      }
      return;
    }
    if (isRunning) return;
    isRunning = true;
    if (!startTimeMs) startTimeMs = Date.now();
    updateTimer();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    if (timerId) clearInterval(timerId);
    if (statusMsg && targetInput.value) {
      statusMsg.textContent = '⏸ Timer paused';
      statusMsg.style.color = 'var(--accent-amber)';
    }
  }

  function resetTimer() {
    startTimeMs = null;
    resetDisplayToZero();
  }

  if (btnStart) btnStart.onclick = startTimer;
  if (btnPause) btnPause.onclick = pauseTimer;
  if (btnReset) btnReset.onclick = resetTimer;

  if (targetInput) {
    targetInput.onchange = () => {
      startTimeMs = Date.now();
      updateTimer();
      startTimer();
    };
  }

  // Handle Preset Quick Event Buttons
  if (presetBtns) {
    presetBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        const now = new Date();
        let addMs = 0;

        if (btn.hasAttribute('data-mins')) {
          addMs = parseInt(btn.getAttribute('data-mins'), 10) * 60 * 1000;
        } else if (btn.hasAttribute('data-hours')) {
          addMs = parseInt(btn.getAttribute('data-hours'), 10) * 3600 * 1000;
        } else if (btn.hasAttribute('data-days')) {
          addMs = parseInt(btn.getAttribute('data-days'), 10) * 24 * 3600 * 1000;
        } else if (btn.getAttribute('data-event') === 'newyear') {
          const nextYear = now.getFullYear() + 1;
          const newYearDate = new Date(`${nextYear}-01-01T00:00:00`);
          addMs = newYearDate.getTime() - now.getTime();
        }

        if (addMs > 0) {
          const target = new Date(now.getTime() + addMs);
          targetInput.value = formatForInput(target);
          startTimeMs = Date.now();
          startTimer();
        }
      };
    });
  }

  // Default state: all zeros, blank input
  resetDisplayToZero();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdownTimer);
} else {
  initCountdownTimer();
}

window.addEventListener('load', initCountdownTimer);
