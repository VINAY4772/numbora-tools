function initDiscountCalculator() {
  const priceInput = document.getElementById('price');
  const d1Input = document.getElementById('discount1');
  const d2Input = document.getElementById('discount2');
  const taxRateInput = document.getElementById('tax-rate');

  const resFinal = document.getElementById('res-final');
  const resSavings = document.getElementById('res-savings');
  const resTaxAmt = document.getElementById('res-tax-amt');
  const breakdownBox = document.getElementById('disc-breakdown-box');

  const presetBtns = document.querySelectorAll('.preset-disc-btn');

  function fmt(val) {
    return '$' + (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateDiscount() {
    const origPrice = parseFloat(priceInput?.value) || 0;
    const d1 = (parseFloat(d1Input?.value) || 0) / 100;
    const d2 = (parseFloat(d2Input?.value) || 0) / 100;
    const taxRate = (parseFloat(taxRateInput?.value) || 0) / 100;

    // First discount
    const priceAfterD1 = origPrice * (1 - d1);

    // Second stacked discount
    const priceAfterD2 = priceAfterD1 * (1 - d2);

    // Total savings before tax
    const totalSavingsBeforeTax = origPrice - priceAfterD2;
    const effSavingsPct = origPrice > 0 ? (totalSavingsBeforeTax / origPrice) * 100 : 0;

    // Tax amount
    const taxAmount = priceAfterD2 * taxRate;
    const finalPayable = priceAfterD2 + taxAmount;

    if (resFinal) resFinal.textContent = fmt(finalPayable);
    if (resSavings) resSavings.textContent = `${fmt(totalSavingsBeforeTax)} (${effSavingsPct.toFixed(1)}%)`;
    if (resTaxAmt) resTaxAmt.textContent = fmt(taxAmount);

    if (breakdownBox) {
      breakdownBox.innerHTML = `
        <strong>Breakdown:</strong><br/>
        Original Price: ${fmt(origPrice)}<br/>
        After Primary Discount (${(d1 * 100).toFixed(0)}%): ${fmt(priceAfterD1)}<br/>
        After Extra Coupon (${(d2 * 100).toFixed(0)}%): ${fmt(priceAfterD2)}<br/>
        Sales Tax (${(taxRate * 100).toFixed(1)}%): +${fmt(taxAmount)}<br/>
        <strong>Final Total: ${fmt(finalPayable)}</strong>
      `;
    }
  }

  [priceInput, d1Input, d2Input, taxRateInput].forEach(el => {
    if (el) {
      el.oninput = calculateDiscount;
      el.onchange = calculateDiscount;
    }
  });

  if (presetBtns) {
    presetBtns.forEach(btn => {
      btn.onclick = () => {
        const discVal = btn.getAttribute('data-disc');
        if (discVal && d1Input) {
          d1Input.value = discVal;
          
  if (resFinal) resFinal.textContent = '$0.00';
  if (resSavings) resSavings.textContent = '$0.00 (0%)';
  if (resTaxAmt) resTaxAmt.textContent = '$0.00';
  if (breakdownBox) breakdownBox.textContent = 'Enter price and discount to see breakdown';

        }
      };
    });
  }

  calculateDiscount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiscountCalculator);
} else {
  initDiscountCalculator();
}

window.addEventListener('load', initDiscountCalculator);
