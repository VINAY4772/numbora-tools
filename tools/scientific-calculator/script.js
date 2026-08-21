function initScientificCalculator() {
  const display = document.getElementById('calc-display');
  const historyLine = document.getElementById('calc-history');
  const buttons = document.querySelectorAll('.calc-btn');
  const memButtons = document.querySelectorAll('.mem-btn');
  const memIndicator = document.getElementById('mem-indicator');
  const historyContainer = document.getElementById('history-container');
  const emptyHistory = document.getElementById('empty-history');
  const btnClearHistory = document.getElementById('btn-clear-history');
  const btnDeg = document.getElementById('mode-deg');
  const btnRad = document.getElementById('mode-rad');

  if (!display) return;

  let currentExpr = '0';
  let isNew = true;
  let angleMode = 'DEG'; // 'DEG' or 'RAD'
  let memoryValue = 0;
  let hasMemory = false;
  let historyList = [];

  // Factorial implementation
  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
      res *= i;
      if (!isFinite(res)) return Infinity;
    }
    return res;
  }

  function updateDisplay() {
    if (display) display.textContent = currentExpr;
    if (memIndicator) {
      memIndicator.style.display = hasMemory ? 'inline-block' : 'none';
    }
  }

  function setMode(mode) {
    angleMode = mode;
    if (btnDeg && btnRad) {
      if (mode === 'DEG') {
        btnDeg.classList.add('active');
        btnRad.classList.remove('active');
      } else {
        btnRad.classList.add('active');
        btnDeg.classList.remove('active');
      }
    }
  }

  if (btnDeg) btnDeg.onclick = () => setMode('DEG');
  if (btnRad) btnRad.onclick = () => setMode('RAD');

  // Memory functions
  memButtons.forEach(btn => {
    btn.onclick = () => {
      const type = btn.getAttribute('data-mem');
      const curNum = parseFloat(currentExpr) || 0;

      if (type === 'MC') {
        memoryValue = 0;
        hasMemory = false;
      } else if (type === 'MR') {
        if (hasMemory) {
          currentExpr = String(memoryValue);
          isNew = true;
        }
      } else if (type === 'MS') {
        memoryValue = curNum;
        hasMemory = true;
      } else if (type === 'M+') {
        memoryValue += curNum;
        hasMemory = true;
      } else if (type === 'M-') {
        memoryValue -= curNum;
        hasMemory = true;
      }
      updateDisplay();
    };
  });

  // History management
  function addHistoryItem(expr, result) {
    historyList.unshift({ expr, result, time: new Date().toLocaleTimeString() });
    if (historyList.length > 25) historyList.pop();
    renderHistory();
  }

  function renderHistory() {
    if (!historyContainer) return;
    if (historyList.length === 0) {
      historyContainer.innerHTML = '<div id="empty-history" style="font-size: 0.85rem; color: var(--text-muted); text-align: center; margin-top: 40px;">No calculations yet. Completed formulas will be saved here.</div>';
      return;
    }

    historyContainer.innerHTML = '';
    historyList.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-expr">${item.expr} =</div>
        <div class="history-res">${item.result}</div>
      `;
      div.onclick = () => {
        currentExpr = String(item.result);
        if (historyLine) historyLine.textContent = item.expr + ' =';
        isNew = true;
        updateDisplay();
      };
      historyContainer.appendChild(div);
    });
  }

  if (btnClearHistory) {
    btnClearHistory.onclick = () => {
      historyList = [];
      renderHistory();
    };
  }

  // Keypad click handler
  buttons.forEach(btn => {
    btn.onclick = () => {
      const val = btn.getAttribute('data-val');
      const action = btn.getAttribute('data-action');
      const fn = btn.getAttribute('data-fn');

      if (action === 'clear') {
        currentExpr = '0';
        if (historyLine) historyLine.textContent = '';
        isNew = true;
      } else if (action === 'backspace') {
        if (currentExpr.length > 1 && currentExpr !== 'Error' && currentExpr !== 'Syntax Error') {
          currentExpr = currentExpr.slice(0, -1);
        } else {
          currentExpr = '0';
          isNew = true;
        }
      } else if (action === 'equals') {
        evaluateMathExpression();
      } else if (fn) {
        handleFunction(fn);
      } else if (val) {
        if (isNew && !'+-×÷%^'.includes(val)) {
          currentExpr = val;
          isNew = false;
        } else {
          currentExpr = (currentExpr === '0' && !'+-×÷%^.'.includes(val)) ? val : currentExpr + val;
          isNew = false;
        }
      }
      updateDisplay();
    };
  });

  function handleFunction(fn) {
    if (fn === 'sin' || fn === 'cos' || fn === 'tan' || fn === 'asin' || fn === 'acos' || fn === 'atan' || fn === 'ln' || fn === 'log' || fn === 'sqrt' || fn === 'cbrt') {
      if (isNew || currentExpr === '0') {
        currentExpr = fn + '(';
        isNew = false;
      } else {
        currentExpr += fn + '(';
        isNew = false;
      }
    } else if (fn === 'pow') {
      currentExpr += '^';
      isNew = false;
    } else if (fn === 'sqr') {
      currentExpr += '^2';
      isNew = false;
    } else if (fn === 'fact') {
      currentExpr += '!';
      isNew = false;
    } else if (fn === 'recip') {
      currentExpr = '1/(' + currentExpr + ')';
      isNew = false;
    } else if (fn === 'abs') {
      currentExpr = 'abs(' + currentExpr + ')';
      isNew = false;
    } else if (fn === 'exp10') {
      currentExpr += '10^';
      isNew = false;
    } else if (fn === 'phi') {
      const phiVal = '1.6180339887';
      if (isNew || currentExpr === '0') currentExpr = phiVal;
      else currentExpr += phiVal;
      isNew = false;
    }
  }

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      appendChar(e.key);
    } else if (e.key === '+' || e.key === '-') {
      appendChar(e.key);
    } else if (e.key === '*') {
      appendChar('×');
    } else if (e.key === '/') {
      appendChar('÷');
    } else if (e.key === '.' || e.key === '(' || e.key === ')' || e.key === '^' || e.key === '%') {
      appendChar(e.key);
    } else if (e.key === 'Enter') {
      evaluateMathExpression();
    } else if (e.key === 'Backspace') {
      if (currentExpr.length > 1 && currentExpr !== 'Error' && currentExpr !== 'Syntax Error') {
        currentExpr = currentExpr.slice(0, -1);
      } else {
        currentExpr = '0';
        isNew = true;
      }
      updateDisplay();
    } else if (e.key === 'Escape') {
      currentExpr = '0';
      if (historyLine) historyLine.textContent = '';
      isNew = true;
      updateDisplay();
    }
  });

  function appendChar(ch) {
    if (isNew && !'+-×÷%^'.includes(ch)) {
      currentExpr = ch;
      isNew = false;
    } else {
      currentExpr = (currentExpr === '0' && !'+-×÷%^.'.includes(ch)) ? ch : currentExpr + ch;
      isNew = false;
    }
    updateDisplay();
  }

  function evaluateMathExpression() {
    const rawExpr = currentExpr;
    try {
      const res = safeEvaluate(currentExpr);
      if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) {
        currentExpr = 'Error';
        isNew = true;
      } else {
        const formattedRes = parseFloat(res.toFixed(10)).toString();
        if (historyLine) historyLine.textContent = rawExpr + ' =';
        addHistoryItem(rawExpr, formattedRes);
        currentExpr = formattedRes;
        isNew = true;
      }
    } catch (err) {
      currentExpr = 'Syntax Error';
      isNew = true;
    }
    updateDisplay();
  }

  function safeEvaluate(expr) {
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**');

    // Handle factorials e.g. 5! or (3+2)!
    sanitized = sanitized.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, (match, p1) => {
      return `factorial(${p1})`;
    });

    // Handle Trig with DEG / RAD angle conversion
    const isDeg = angleMode === 'DEG';
    const toRad = isDeg ? '(Math.PI / 180) * ' : '';
    const fromRad = isDeg ? '(180 / Math.PI) * ' : '';

    sanitized = sanitized
      .replace(/sin\(([^)]+)\)/g, `Math.sin(${toRad}($1))`)
      .replace(/cos\(([^)]+)\)/g, `Math.cos(${toRad}($1))`)
      .replace(/tan\(([^)]+)\)/g, `Math.tan(${toRad}($1))`)
      .replace(/asin\(([^)]+)\)/g, `(${fromRad}Math.asin($1))`)
      .replace(/acos\(([^)]+)\)/g, `(${fromRad}Math.acos($1))`)
      .replace(/atan\(([^)]+)\)/g, `(${fromRad}Math.atan($1))`)
      .replace(/sinh\(([^)]+)\)/g, 'Math.sinh($1)')
      .replace(/cosh\(([^)]+)\)/g, 'Math.cosh($1)')
      .replace(/tanh\(([^)]+)\)/g, 'Math.tanh($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');

    // Scope evaluation function
    const fn = new Function('factorial', `return (${sanitized});`);
    return fn(factorial);
  }

  updateDisplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScientificCalculator);
} else {
  initScientificCalculator();
}

window.addEventListener('load', initScientificCalculator);
