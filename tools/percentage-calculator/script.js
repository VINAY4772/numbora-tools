function initPercentageCalculator() {
  // Mode 1: What is X% of Y?
  const p1Val1 = document.getElementById('p1-val1');
  const p1Val2 = document.getElementById('p1-val2');
  const p1Res = document.getElementById('p1-res');
  const p1Formula = document.getElementById('p1-formula');

  function calcMode1() {
    const x = parseFloat(p1Val1?.value) || 0;
    const y = parseFloat(p1Val2?.value) || 0;
    const res = (x * y) / 100;
    if (p1Res) p1Res.textContent = parseFloat(res.toFixed(4)).toString();
    if (p1Formula) p1Formula.textContent = `(${x} × ${y}) ÷ 100 = ${parseFloat(res.toFixed(4))}`;
  }
  if (p1Val1) p1Val1.oninput = calcMode1;
  if (p1Val2) p1Val2.oninput = calcMode1;

  // Mode 2: X is what % of Y?
  const p2Val1 = document.getElementById('p2-val1');
  const p2Val2 = document.getElementById('p2-val2');
  const p2Res = document.getElementById('p2-res');
  const p2Formula = document.getElementById('p2-formula');

  function calcMode2() {
    const x = parseFloat(p2Val1?.value) || 0;
    const y = parseFloat(p2Val2?.value) || 0;
    if (y === 0) {
      if (p2Res) p2Res.textContent = 'Err (Y=0)';
      return;
    }
    const res = (x / y) * 100;
    if (p2Res) p2Res.textContent = parseFloat(res.toFixed(4)) + '%';
    if (p2Formula) p2Formula.textContent = `(${x} ÷ ${y}) × 100 = ${parseFloat(res.toFixed(4))}%`;
  }
  if (p2Val1) p2Val1.oninput = calcMode2;
  if (p2Val2) p2Val2.oninput = calcMode2;

  // Mode 3: % Increase / Decrease
  const p3Val1 = document.getElementById('p3-val1');
  const p3Val2 = document.getElementById('p3-val2');
  const p3Res = document.getElementById('p3-res');
  const p3Formula = document.getElementById('p3-formula');

  function calcMode3() {
    const v1 = parseFloat(p3Val1?.value) || 0;
    const v2 = parseFloat(p3Val2?.value) || 0;
    if (v1 === 0) {
      if (p3Res) p3Res.textContent = 'Err (V1=0)';
      return;
    }
    const diff = v2 - v1;
    const res = (diff / Math.abs(v1)) * 100;
    const sign = res > 0 ? '+' : '';
    if (p3Res) p3Res.textContent = `${sign}${parseFloat(res.toFixed(4))}%`;
    if (p3Formula) p3Formula.textContent = `((${v2} - ${v1}) ÷ |${v1}|) × 100 = ${sign}${parseFloat(res.toFixed(4))}%`;
  }
  if (p3Val1) p3Val1.oninput = calcMode3;
  if (p3Val2) p3Val2.oninput = calcMode3;

  // Mode 4: X is Y% of what?
  const p4Val1 = document.getElementById('p4-val1');
  const p4Val2 = document.getElementById('p4-val2');
  const p4Res = document.getElementById('p4-res');
  const p4Formula = document.getElementById('p4-formula');

  function calcMode4() {
    const x = parseFloat(p4Val1?.value) || 0;
    const y = parseFloat(p4Val2?.value) || 0;
    if (y === 0) {
      if (p4Res) p4Res.textContent = 'Err (% = 0)';
      return;
    }
    const res = (x / y) * 100;
    if (p4Res) p4Res.textContent = parseFloat(res.toFixed(4)).toString();
    if (p4Formula) p4Formula.textContent = `(${x} ÷ ${y}) × 100 = ${parseFloat(res.toFixed(4))}`;
  }
  if (p4Val1) p4Val1.oninput = calcMode4;
  if (p4Val2) p4Val2.oninput = calcMode4;

  // Mode 5: % Difference Between Two Values
  const p5Val1 = document.getElementById('p5-val1');
  const p5Val2 = document.getElementById('p5-val2');
  const p5Res = document.getElementById('p5-res');
  const p5Formula = document.getElementById('p5-formula');

  function calcMode5() {
    const a = parseFloat(p5Val1?.value) || 0;
    const b = parseFloat(p5Val2?.value) || 0;
    const avg = (a + b) / 2;
    if (avg === 0) {
      if (p5Res) p5Res.textContent = '0%';
      return;
    }
    const res = (Math.abs(a - b) / Math.abs(avg)) * 100;
    if (p5Res) p5Res.textContent = parseFloat(res.toFixed(4)) + '%';
    if (p5Formula) p5Formula.textContent = `|${a} - ${b}| ÷ ((${a} + ${b}) / 2) × 100 = ${parseFloat(res.toFixed(4))}%`;
  }
  if (p5Val1) p5Val1.oninput = calcMode5;
  if (p5Val2) p5Val2.oninput = calcMode5;

  
  
  
  
  
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPercentageCalculator);
} else {
  initPercentageCalculator();
}

window.addEventListener('load', initPercentageCalculator);

  if (p1Res) p1Res.textContent = '0';
  if (p2Res) p2Res.textContent = '0%';
  if (p3Res) p3Res.textContent = '0%';
  if (p4Res) p4Res.textContent = '0';
  if (p5Res) p5Res.textContent = '0%';
