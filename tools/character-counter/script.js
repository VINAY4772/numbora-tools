(function() {
  function initCounter() {
    const textarea = document.getElementById('char-input');

    const cntTotal = document.getElementById('cnt-total');
    const cntNoSpaces = document.getElementById('cnt-nospaces');
    const cntWords = document.getElementById('cnt-words');
    const cntLetters = document.getElementById('cnt-letters');
    const cntDigits = document.getElementById('cnt-digits');
    const cntSpaces = document.getElementById('cnt-spaces');
    const cntSymbols = document.getElementById('cnt-symbols');
    const cntLines = document.getElementById('cnt-lines');

    const digitsContainer = document.getElementById('digits-breakdown');
    const freqContainer = document.getElementById('freq-table-body');

    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');

    function getRawText() {
      if (!textarea) return '';
      return textarea.value || '';
    }

    function analyzeText() {
      if (!textarea) return;
      const text = getRawText();

      const total = text.length;
      const noSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
      const letters = (text.match(/[a-zA-Z]/g) || []).length;
      const digits = (text.match(/[0-9]/g) || []).length;
      const spaces = (text.match(/\s/g) || []).length;
      const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
      const lines = text ? text.split('\n').length : 0;

      if (cntTotal) cntTotal.textContent = total.toLocaleString();
      if (cntNoSpaces) cntNoSpaces.textContent = noSpaces.toLocaleString();
      if (cntWords) cntWords.textContent = words.toLocaleString();
      if (cntLetters) cntLetters.textContent = letters.toLocaleString();
      if (cntDigits) cntDigits.textContent = digits.toLocaleString();
      if (cntSpaces) cntSpaces.textContent = spaces.toLocaleString();
      if (cntSymbols) cntSymbols.textContent = symbols.toLocaleString();
      if (cntLines) cntLines.textContent = lines.toLocaleString();

      // 1. Digit Breakdown (0-9)
      if (digitsContainer) {
        digitsContainer.innerHTML = '';
        const digitCounts = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
        let hasDigits = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char >= '0' && char <= '9') {
            digitCounts[char]++;
            hasDigits = true;
          }
        }

        if (!hasDigits) {
          digitsContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.88rem;">No digits (0-9) found in text.</span>';
        } else {
          Object.keys(digitCounts).forEach(digit => {
            const count = digitCounts[digit];
            if (count > 0) {
              const badge = document.createElement('div');
              badge.style.cssText = 'padding: 6px 14px; border-radius: var(--radius-full); background: rgba(217, 119, 6, 0.12); color: var(--accent-amber); border: 1px solid rgba(217, 119, 6, 0.3); font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;';
              badge.innerHTML = `<span>Digit <strong>${digit}</strong></span> <span style="background: var(--accent-amber); color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 0.78rem;">${count}×</span>`;
              digitsContainer.appendChild(badge);
            }
          });
        }
      }

      // 2. Character & Symbol Frequency Breakdown
      if (freqContainer) {
        freqContainer.innerHTML = '';
        const freqMap = {};

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === ' ') continue;
          const key = char.toLowerCase();
          freqMap[key] = (freqMap[key] || 0) + 1;
        }

        const sortedChars = Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);

        if (sortedChars.length === 0) {
          freqContainer.innerHTML = '<tr><td colspan="3" style="padding: 12px; text-align: center; color: var(--text-muted);">Type text to see character frequency...</td></tr>';
        } else {
          sortedChars.slice(0, 15).forEach(char => {
            const count = freqMap[char];
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            const displayChar = char === '\n' ? '↵ (Newline)' : char;

            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid var(--border-color);';
            row.innerHTML = `
              <td style="padding: 8px 12px; font-weight: 700; font-family: monospace; font-size: 1rem; color: var(--primary);">'${displayChar}'</td>
              <td style="padding: 8px 12px; font-weight: 700; color: var(--text-main);">${count} ${count === 1 ? 'time' : 'times'}</td>
              <td style="padding: 8px 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="flex: 1; background: var(--bg-input); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color);">
                    <div style="width: ${pct}%; background: var(--primary); height: 100%;"></div>
                  </div>
                  <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); min-width: 40px; text-align: right;">${pct}%</span>
                </div>
              </td>
            `;
            freqContainer.appendChild(row);
          });
        }
      }
    }

    if (textarea) {
      textarea.oninput = analyzeText;
      textarea.onkeyup = analyzeText;
      textarea.onkeydown = analyzeText;
      textarea.onchange = analyzeText;
      textarea.onfocus = analyzeText;
      textarea.onblur = analyzeText;
      textarea.onpaste = () => setTimeout(analyzeText, 10);
    }

    if (btnCopy) {
      btnCopy.onclick = (e) => {
        if (e) e.preventDefault();
        const textToCopy = getRawText();
        if (textToCopy && typeof copyToClipboard === 'function') {
          copyToClipboard(textToCopy, 'Character text copied to clipboard! 📋');
        }
      };
    }

    if (btnClear) {
      btnClear.onclick = (e) => {
        if (e) e.preventDefault();
        if (textarea) {
          textarea.value = '';
          textarea.textContent = '';
          analyzeText();
        }
      };
    }

    // Initial execution + continuous interval polling backup
    analyzeText();
    setInterval(analyzeText, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounter);
  } else {
    initCounter();
  }
  window.addEventListener('load', initCounter);
})();
