function initGSTCalculator() {
  const modeAdd = document.getElementById('mode-add');
  const modeRemove = document.getElementById('mode-remove');
  const amountInput = document.getElementById('amount');
  const gstRateInput = document.getElementById('gst-rate');
  const amountLabel = document.getElementById('amount-label');

  const resGross = document.getElementById('res-gross');
  const resNet = document.getElementById('res-net');
  const resGst = document.getElementById('res-gst');
  const resCgst = document.getElementById('res-cgst');
  const resSgst = document.getElementById('res-sgst');
  const resIgst = document.getElementById('res-igst');

  const presetBtns = document.querySelectorAll('.preset-btn');

  let currentMode = 'add'; // 'add' (exclusive) or 'remove' (inclusive)

  function fmt(val) {
    return '₹' + (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateGST() {
    const rawAmt = parseFloat(amountInput?.value) || 0;
    const rate = (parseFloat(gstRateInput?.value) || 0) / 100;

    let netPrice = 0;
    let gstTax = 0;
    let grossPrice = 0;

    if (currentMode === 'add') {
      // Exclusive: Add GST
      netPrice = rawAmt;
      gstTax = netPrice * rate;
      grossPrice = netPrice + gstTax;
    } else {
      // Inclusive: Extract GST
      grossPrice = rawAmt;
      netPrice = grossPrice / (1 + rate);
      gstTax = grossPrice - netPrice;
    }

    const halfTax = gstTax / 2;

    if (resGross) resGross.textContent = fmt(grossPrice);
    if (resNet) resNet.textContent = fmt(netPrice);
    if (resGst) resGst.textContent = fmt(gstTax);
    if (resCgst) resCgst.textContent = fmt(halfTax);
    if (resSgst) resSgst.textContent = fmt(halfTax);
    if (resIgst) resIgst.textContent = fmt(gstTax);
  }

  if (modeAdd && modeRemove) {
    modeAdd.onclick = () => {
      currentMode = 'add';
      modeAdd.classList.add('btn-primary');
      modeAdd.classList.remove('btn-secondary');
      modeRemove.classList.remove('btn-primary');
      modeRemove.classList.add('btn-secondary');
      if (amountLabel) amountLabel.textContent = 'Base Net Price (₹ / $)';
      
  if (resGross) resGross.textContent = '₹0.00';
  if (resNet) resNet.textContent = '₹0.00';
  if (resGst) resGst.textContent = '₹0.00';
  if (resCgst) resCgst.textContent = '₹0.00';
  if (resSgst) resSgst.textContent = '₹0.00';
  if (resIgst) resIgst.textContent = '₹0.00';

    };

    modeRemove.onclick = () => {
      currentMode = 'remove';
      modeRemove.classList.add('btn-primary');
      modeRemove.classList.remove('btn-secondary');
      modeAdd.classList.remove('btn-primary');
      modeAdd.classList.add('btn-secondary');
      if (amountLabel) amountLabel.textContent = 'Total MRP / Gross Price (₹ / $)';
      calculateGST();
    };
  }

  if (presetBtns) {
    presetBtns.forEach(btn => {
      btn.onclick = () => {
        const rate = btn.getAttribute('data-rate');
        if (rate && gstRateInput) {
          gstRateInput.value = rate;
          presetBtns.forEach(b => {
            b.classList.remove('btn-primary', 'active');
            b.classList.add('btn-secondary');
          });
          btn.classList.add('btn-primary', 'active');
          btn.classList.remove('btn-secondary');
          calculateGST();
        }
      };
    });
  }

  [amountInput, gstRateInput].forEach(el => {
    if (el) {
      el.oninput = calculateGST;
      el.onchange = calculateGST;
    }
  });

  calculateGST();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSTCalculator);
} else {
  initGSTCalculator();
}

window.addEventListener('load', initGSTCalculator);
