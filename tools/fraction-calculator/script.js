function initFractionCalculator() {
  // Tab Switcher
  const tabBtns = document.querySelectorAll('.frac-tab-btn');
  const tabContents = document.querySelectorAll('.frac-tab-content');

  if (tabBtns) {
    tabBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-secondary');
        });
        btn.classList.add('btn-primary', 'active');
        btn.classList.remove('btn-secondary');

        tabContents.forEach(tc => {
          tc.style.display = tc.id === `tab-${targetTab}` ? 'block' : 'none';
        });
      };
    });
  }

  // Math Utilities
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  // --- TAB 1: Arithmetic & Mixed Numbers ---
  const w1 = document.getElementById('whole1');
  const n1 = document.getElementById('num1');
  const d1 = document.getElementById('den1');
  const op = document.getElementById('operator');
  const w2 = document.getElementById('whole2');
  const n2 = document.getElementById('num2');
  const d2 = document.getElementById('den2');

  const errorMsg = document.getElementById('error-msg');
  const resSimpl = document.getElementById('res-simpl');
  const resMixed = document.getElementById('res-mixed');
  const resDec = document.getElementById('res-dec');
  const resPct = document.getElementById('res-pct');
  const stepSol = document.getElementById('step-solution');

  const btnSample1 = document.getElementById('btn-sample-1');
  const btnSample2 = document.getElementById('btn-sample-2');
  const btnSample3 = document.getElementById('btn-sample-3');

  function calculateArithmetic() {
    if (errorMsg) errorMsg.style.display = 'none';

    let whole1 = parseInt(w1?.value) || 0;
    let num1 = parseInt(n1?.value) || 0;
    let den1 = parseInt(d1?.value) || 1;

    const operator = op?.value || '+';

    let whole2 = parseInt(w2?.value) || 0;
    let num2 = parseInt(n2?.value) || 0;
    let den2 = parseInt(d2?.value) || 1;

    if (den1 === 0 || den2 === 0) {
      showError('Denominator cannot be zero.');
      return;
    }

    // Convert mixed numbers to improper fractions
    if (whole1 < 0) num1 = (whole1 * den1) - num1;
    else num1 = (whole1 * den1) + num1;

    if (whole2 < 0) num2 = (whole2 * den2) - num2;
    else num2 = (whole2 * den2) + num2;

    let resNum = 0;
    let resDen = 1;
    let stepText = '';

    if (operator === '+') {
      const commonDen = lcm(den1, den2);
      const scaledNum1 = num1 * (commonDen / den1);
      const scaledNum2 = num2 * (commonDen / den2);
      resNum = scaledNum1 + scaledNum2;
      resDen = commonDen;
      stepText = `${num1}/${den1} + ${num2}/${den2} = (${scaledNum1} + ${scaledNum2}) / ${commonDen} = ${resNum}/${resDen}`;
    } else if (operator === '-') {
      const commonDen = lcm(den1, den2);
      const scaledNum1 = num1 * (commonDen / den1);
      const scaledNum2 = num2 * (commonDen / den2);
      resNum = scaledNum1 - scaledNum2;
      resDen = commonDen;
      stepText = `${num1}/${den1} - ${num2}/${den2} = (${scaledNum1} - ${scaledNum2}) / ${commonDen} = ${resNum}/${resDen}`;
    } else if (operator === '*') {
      resNum = num1 * num2;
      resDen = den1 * den2;
      stepText = `${num1}/${den1} × ${num2}/${den2} = (${num1} × ${num2}) / (${den1} × ${den2}) = ${resNum}/${resDen}`;
    } else if (operator === '/') {
      if (num2 === 0) {
        showError('Division by zero fraction is undefined.');
        return;
      }
      resNum = num1 * den2;
      resDen = den1 * num2;
      stepText = `${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2} = ${resNum}/${resDen}`;
    }

    // Normalize signs
    if (resDen < 0) {
      resNum = -resNum;
      resDen = -resDen;
    }

    const common = gcd(resNum, resDen);
    const simpNum = resNum / common;
    const simpDen = resDen / common;
    const decimal = resDen !== 0 ? (resNum / resDen) : 0;

    // Mixed number format
    let mixedStr = '';
    const wholePart = Math.trunc(simpNum / simpDen);
    const remNum = Math.abs(simpNum % simpDen);

    if (wholePart !== 0 && remNum !== 0 && simpDen > 1) {
      mixedStr = `${wholePart} ${remNum}/${simpDen}`;
    } else if (simpDen === 1) {
      mixedStr = `${simpNum}`;
    } else {
      mixedStr = `${simpNum}/${simpDen}`;
    }

    if (resSimpl) resSimpl.textContent = simpDen === 1 ? `${simpNum}` : `${simpNum} / ${simpDen}`;
    if (resMixed) resMixed.textContent = mixedStr;
    if (resDec) resDec.textContent = decimal.toFixed(4);
    if (resPct) resPct.textContent = (decimal * 100).toFixed(2) + '%';

    if (stepSol) {
      stepSol.innerHTML = `${stepText}<br/><strong>Reduced:</strong> ${simpDen === 1 ? simpNum : `${simpNum}/${simpDen}`} (${mixedStr})`;
    }
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }
    if (resSimpl) resSimpl.textContent = 'Err';
    if (resMixed) resMixed.textContent = 'Err';
    if (resDec) resDec.textContent = 'Err';
    if (resPct) resPct.textContent = 'Err';
    if (stepSol) stepSol.textContent = msg;
  }

  [w1, n1, d1, op, w2, n2, d2].forEach(el => {
    if (el) {
      el.oninput = calculateArithmetic;
      el.onchange = calculateArithmetic;
    }
  });

  if (btnSample1) {
    btnSample1.onclick = () => {
      if (w1) w1.value = '';
      if (n1) n1.value = '1';
      if (d1) d1.value = '2';
      if (op) op.value = '+';
      if (w2) w2.value = '';
      if (n2) n2.value = '1';
      if (d2) d2.value = '3';
      
  if (resSimpl) resSimpl.textContent = '0';
  if (resMixed) resMixed.textContent = '0';
  if (resDec) resDec.textContent = '0.0000';
  if (resPct) resPct.textContent = '0%';
  if (stepSol) stepSol.textContent = 'Enter fractions to calculate step-by-step solution';

    };
  }

  if (btnSample2) {
    btnSample2.onclick = () => {
      if (w1) w1.value = '';
      if (n1) n1.value = '3';
      if (d1) d1.value = '4';
      if (op) op.value = '*';
      if (w2) w2.value = '';
      if (n2) n2.value = '2';
      if (d2) d2.value = '5';
      calculateArithmetic();
    };
  }

  if (btnSample3) {
    btnSample3.onclick = () => {
      if (w1) w1.value = '1';
      if (n1) n1.value = '1';
      if (d1) d1.value = '2';
      if (op) op.value = '/';
      if (w2) w2.value = '';
      if (n2) n2.value = '3';
      if (d2) d2.value = '4';
      calculateArithmetic();
    };
  }

  // --- TAB 2: Fraction Simplifier / Reducer ---
  const simpNum = document.getElementById('simp-num');
  const simpDen = document.getElementById('simp-den');
  const simpResult = document.getElementById('simp-result');
  const simpSteps = document.getElementById('simp-steps');

  function calculateSimplify() {
    const num = parseInt(simpNum?.value) || 0;
    const den = parseInt(simpDen?.value) || 1;

    if (den === 0) {
      if (simpResult) simpResult.textContent = 'Err (Den = 0)';
      if (simpSteps) simpSteps.textContent = 'Denominator cannot be 0.';
      return;
    }

    const common = gcd(num, den);
    const rNum = num / common;
    const rDen = den / common;

    if (simpResult) simpResult.textContent = rDen === 1 ? `${rNum}` : `${rNum} / ${rDen}`;
    if (simpSteps) {
      simpSteps.innerHTML = `Greatest Common Divisor GCD(${num}, ${den}) = ${common}<br/>Numerator: ${num} ÷ ${common} = ${rNum}<br/>Denominator: ${den} ÷ ${common} = ${rDen}<br/><strong>Simplified Form: ${rDen === 1 ? rNum : `${rNum}/${rDen}`}</strong>`;
    }
  }

  if (simpNum) simpNum.oninput = calculateSimplify;
  if (simpDen) simpDen.oninput = calculateSimplify;

  // --- TAB 3: Decimal to Fraction Converter ---
  const decInput = document.getElementById('dec-input');
  const decToFracRes = document.getElementById('dec-to-frac-res');
  const decConvSteps = document.getElementById('dec-conv-steps');

  function calculateDecToFrac() {
    const valStr = decInput?.value || '0';
    const val = parseFloat(valStr);

    if (isNaN(val)) {
      if (decToFracRes) decToFracRes.textContent = '0';
      return;
    }

    const decimalPlaces = (valStr.split('.')[1] || '').length;
    const den = Math.pow(10, decimalPlaces);
    const num = Math.round(val * den);

    const common = gcd(num, den);
    const sNum = num / common;
    const sDen = den / common;

    if (decToFracRes) decToFracRes.textContent = sDen === 1 ? `${sNum}` : `${sNum} / ${sDen}`;
    if (decConvSteps) {
      decConvSteps.innerHTML = `${val} = ${num} / ${den}<br/>Dividing numerator & denominator by GCD(${num}, ${den}) = ${common}:<br/><strong>${val} = ${sDen === 1 ? sNum : `${sNum} / ${sDen}`}</strong>`;
    }
  }

  if (decInput) decInput.oninput = calculateDecToFrac;

  // --- TAB 4: Compare Two Fractions ---
  const compNum1 = document.getElementById('comp-num1');
  const compDen1 = document.getElementById('comp-den1');
  const compNum2 = document.getElementById('comp-num2');
  const compDen2 = document.getElementById('comp-den2');
  const compSymbol = document.getElementById('comp-symbol');
  const compVerdict = document.getElementById('comp-verdict');
  const compSteps = document.getElementById('comp-steps');

  function calculateComparison() {
    const n1 = parseInt(compNum1?.value) || 0;
    const d1 = parseInt(compDen1?.value) || 1;
    const n2 = parseInt(compNum2?.value) || 0;
    const d2 = parseInt(compDen2?.value) || 1;

    if (d1 === 0 || d2 === 0) {
      if (compVerdict) compVerdict.textContent = 'Denominator cannot be zero.';
      return;
    }

    const commonDen = lcm(d1, d2);
    const scaled1 = n1 * (commonDen / d1);
    const scaled2 = n2 * (commonDen / d2);

    let symbol = '=';
    let verdict = `${n1}/${d1} is EQUAL to ${n2}/${d2}`;

    if (scaled1 > scaled2) {
      symbol = '>';
      verdict = `${n1}/${d1} is GREATER than ${n2}/${d2}`;
    } else if (scaled1 < scaled2) {
      symbol = '<';
      verdict = `${n1}/${d1} is LESS than ${n2}/${d2}`;
    }

    if (compSymbol) compSymbol.textContent = symbol;
    if (compVerdict) compVerdict.textContent = verdict;
    if (compSteps) {
      compSteps.innerHTML = `Convert to common denominator (${commonDen}):<br/>${n1}/${d1} = ${scaled1}/${commonDen} (${(n1/d1).toFixed(4)})<br/>${n2}/${d2} = ${scaled2}/${commonDen} (${(n2/d2).toFixed(4)})<br/>Since ${scaled1} ${symbol} ${scaled2} &rarr; <strong>${n1}/${d1} ${symbol} ${n2}/${d2}</strong>`;
    }
  }

  [compNum1, compDen1, compNum2, compDen2].forEach(el => {
    if (el) el.oninput = calculateComparison;
  });

  // Initialize all calculations
  calculateArithmetic();
  calculateSimplify();
  calculateDecToFrac();
  calculateComparison();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFractionCalculator);
} else {
  initFractionCalculator();
}

window.addEventListener('load', initFractionCalculator);
