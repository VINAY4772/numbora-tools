function initSalaryCalculator() {
  const salAmountInput = document.getElementById('salary-amount');
  const salPeriodSelect = document.getElementById('salary-period');
  const hoursPerWeekInput = document.getElementById('hours-per-week');
  const taxPctInput = document.getElementById('tax-pct');
  const pfPctInput = document.getElementById('pf-pct');
  const otherDeductionsInput = document.getElementById('other-deductions');

  const resNetMonthly = document.getElementById('res-net-monthly');
  const resNetAnnual = document.getElementById('res-net-annual');
  const resTotalTax = document.getElementById('res-total-tax');

  // Matrix Row Elements
  const rowGrossHr = document.getElementById('row-gross-hr');
  const rowDedHr = document.getElementById('row-ded-hr');
  const rowNetHr = document.getElementById('row-net-hr');

  const rowGrossDay = document.getElementById('row-gross-day');
  const rowDedDay = document.getElementById('row-ded-day');
  const rowNetDay = document.getElementById('row-net-day');

  const rowGrossWk = document.getElementById('row-gross-wk');
  const rowDedWk = document.getElementById('row-ded-wk');
  const rowNetWk = document.getElementById('row-net-wk');

  const rowGrossBiwk = document.getElementById('row-gross-biwk');
  const rowDedBiwk = document.getElementById('row-ded-biwk');
  const rowNetBiwk = document.getElementById('row-net-biwk');

  const rowGrossMo = document.getElementById('row-gross-mo');
  const rowDedMo = document.getElementById('row-ded-mo');
  const rowNetMo = document.getElementById('row-net-mo');

  const rowGrossYr = document.getElementById('row-gross-yr');
  const rowDedYr = document.getElementById('row-ded-yr');
  const rowNetYr = document.getElementById('row-net-yr');

  function fmt(val) {
    return '$' + (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateSalary() {
    const rawSal = parseFloat(salAmountInput?.value) || 0;
    const period = salPeriodSelect?.value || 'annual';
    const hoursPerWk = parseFloat(hoursPerWeekInput?.value) || 40;
    const taxPct = (parseFloat(taxPctInput?.value) || 0) / 100;
    const pfPct = (parseFloat(pfPctInput?.value) || 0) / 100;
    const otherMonthly = parseFloat(otherDeductionsInput?.value) || 0;

    // Convert input salary to annual gross
    let annualGross = 0;
    const totalWorkingHoursPerYear = hoursPerWk * 52;

    if (period === 'hourly') {
      annualGross = rawSal * totalWorkingHoursPerYear;
    } else if (period === 'weekly') {
      annualGross = rawSal * 52;
    } else if (period === 'biweekly') {
      annualGross = rawSal * 26;
    } else if (period === 'monthly') {
      annualGross = rawSal * 12;
    } else {
      annualGross = rawSal;
    }

    const annualTax = annualGross * taxPct;
    const annualPf = annualGross * pfPct;
    const annualOther = otherMonthly * 12;
    const totalAnnualDeductions = annualTax + annualPf + annualOther;
    const annualNet = Math.max(0, annualGross - totalAnnualDeductions);

    const monthlyGross = annualGross / 12;
    const monthlyDed = totalAnnualDeductions / 12;
    const monthlyNet = annualNet / 12;

    const weeklyGross = annualGross / 52;
    const weeklyDed = totalAnnualDeductions / 52;
    const weeklyNet = annualNet / 52;

    const biweeklyGross = annualGross / 26;
    const biweeklyDed = totalAnnualDeductions / 26;
    const biweeklyNet = annualNet / 26;

    const hourlyGross = totalWorkingHoursPerYear > 0 ? (annualGross / totalWorkingHoursPerYear) : 0;
    const hourlyDed = totalWorkingHoursPerYear > 0 ? (totalAnnualDeductions / totalWorkingHoursPerYear) : 0;
    const hourlyNet = totalWorkingHoursPerYear > 0 ? (annualNet / totalWorkingHoursPerYear) : 0;

    const dailyGross = hourlyGross * (hoursPerWk / 5);
    const dailyDed = hourlyDed * (hoursPerWk / 5);
    const dailyNet = hourlyNet * (hoursPerWk / 5);

    // Update main result cards
    if (resNetMonthly) resNetMonthly.textContent = fmt(monthlyNet);
    if (resNetAnnual) resNetAnnual.textContent = fmt(annualNet);
    if (resTotalTax) resTotalTax.textContent = fmt(totalAnnualDeductions);

    // Update Matrix table
    if (rowGrossHr) rowGrossHr.textContent = fmt(hourlyGross);
    if (rowDedHr) rowDedHr.textContent = fmt(hourlyDed);
    if (rowNetHr) rowNetHr.textContent = fmt(hourlyNet);

    if (rowGrossDay) rowGrossDay.textContent = fmt(dailyGross);
    if (rowDedDay) rowDedDay.textContent = fmt(dailyDed);
    if (rowNetDay) rowNetDay.textContent = fmt(dailyNet);

    if (rowGrossWk) rowGrossWk.textContent = fmt(weeklyGross);
    if (rowDedWk) rowDedWk.textContent = fmt(weeklyDed);
    if (rowNetWk) rowNetWk.textContent = fmt(weeklyNet);

    if (rowGrossBiwk) rowGrossBiwk.textContent = fmt(biweeklyGross);
    if (rowDedBiwk) rowDedBiwk.textContent = fmt(biweeklyDed);
    if (rowNetBiwk) rowNetBiwk.textContent = fmt(biweeklyNet);

    if (rowGrossMo) rowGrossMo.textContent = fmt(monthlyGross);
    if (rowDedMo) rowDedMo.textContent = fmt(monthlyDed);
    if (rowNetMo) rowNetMo.textContent = fmt(monthlyNet);

    if (rowGrossYr) rowGrossYr.textContent = fmt(annualGross);
    if (rowDedYr) rowDedYr.textContent = fmt(totalAnnualDeductions);
    if (rowNetYr) rowNetYr.textContent = fmt(annualNet);
  }

  [salAmountInput, salPeriodSelect, hoursPerWeekInput, taxPctInput, pfPctInput, otherDeductionsInput].forEach(el => {
    if (el) {
      el.oninput = calculateSalary;
      el.onchange = calculateSalary;
    }
  });

  
  if (resNetMonthly) resNetMonthly.textContent = '$0.00';
  if (resNetAnnual) resNetAnnual.textContent = '$0.00';
  if (resTotalTax) resTotalTax.textContent = '$0.00';
  ['rowGrossHr', 'rowDedHr', 'rowNetHr', 'rowGrossDay', 'rowDedDay', 'rowNetDay', 'rowGrossWk', 'rowDedWk', 'rowNetWk', 'rowGrossBiwk', 'rowDedBiwk', 'rowNetBiwk', 'rowGrossMo', 'rowDedMo', 'rowNetMo', 'rowGrossYr', 'rowDedYr', 'rowNetYr'].forEach(id => {
    const el = document.getElementById(id.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (el) el.textContent = '$0.00';
  });

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSalaryCalculator);
} else {
  initSalaryCalculator();
}

window.addEventListener('load', initSalaryCalculator);
