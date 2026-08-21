function initBMICalculator() {
  const modeMetric = document.getElementById('mode-metric');
  const modeImperial = document.getElementById('mode-imperial');
  const metricInputs = document.getElementById('metric-inputs');
  const imperialInputs = document.getElementById('imperial-inputs');

  const heightCmInput = document.getElementById('height-cm');
  const weightKgInput = document.getElementById('weight-kg');

  const heightFtInput = document.getElementById('height-ft');
  const heightInInput = document.getElementById('height-in');
  const weightLbsInput = document.getElementById('weight-lbs');

  const userAgeInput = document.getElementById('user-age');
  const userGenderSelect = document.getElementById('user-gender');

  const resBmi = document.getElementById('res-bmi');
  const resCategory = document.getElementById('res-category');
  const resIdealWeight = document.getElementById('res-ideal-weight');
  const resBmr = document.getElementById('res-bmr');

  let currentMode = 'metric'; // 'metric' or 'imperial'

  function calculateBMI() {
    let heightCm = 0;
    let weightKg = 0;

    if (currentMode === 'metric') {
      heightCm = parseFloat(heightCmInput?.value) || 0;
      weightKg = parseFloat(weightKgInput?.value) || 0;
    } else {
      const ft = parseFloat(heightFtInput?.value) || 0;
      const inch = parseFloat(heightInInput?.value) || 0;
      const totalInches = (ft * 12) + inch;
      heightCm = totalInches * 2.54;

      const lbs = parseFloat(weightLbsInput?.value) || 0;
      weightKg = lbs * 0.45359237;
    }

    const age = parseFloat(userAgeInput?.value) || 25;
    const gender = userGenderSelect?.value || 'male';

    if (heightCm <= 0 || weightKg <= 0) {
      if (resBmi) resBmi.textContent = '0.0';
      if (resCategory) resCategory.textContent = 'Enter valid height and weight';
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (resBmi) resBmi.textContent = bmi.toFixed(1);

    // Health Category
    if (resCategory) {
      if (bmi < 18.5) {
        resCategory.textContent = 'Underweight (< 18.5) ⚠️';
        resCategory.style.color = '#0284c7';
      } else if (bmi < 25.0) {
        resCategory.textContent = 'Normal weight (18.5 – 24.9) ✅';
        resCategory.style.color = '#059669';
      } else if (bmi < 30.0) {
        resCategory.textContent = 'Overweight (25.0 – 29.9) ⚠️';
        resCategory.style.color = '#d97706';
      } else {
        resCategory.textContent = 'Obese (≥ 30.0) 🚨';
        resCategory.style.color = '#e11d48';
      }
    }

    // Ideal Healthy Weight Range (BMI 18.5 - 24.9)
    const minIdealKg = 18.5 * (heightM * heightM);
    const maxIdealKg = 24.9 * (heightM * heightM);

    if (resIdealWeight) {
      if (currentMode === 'metric') {
        resIdealWeight.textContent = `${minIdealKg.toFixed(1)} – ${maxIdealKg.toFixed(1)} kg`;
      } else {
        const minLbs = minIdealKg * 2.20462;
        const maxLbs = maxIdealKg * 2.20462;
        resIdealWeight.textContent = `${minLbs.toFixed(1)} – ${maxLbs.toFixed(1)} lbs`;
      }
    }

    // BMR (Mifflin-St Jeor Equation)
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);

    if (resBmr) {
      resBmr.textContent = `${Math.round(bmr).toLocaleString()} kcal/day`;
    }
  }

  if (modeMetric && modeImperial) {
    modeMetric.onclick = () => {
      currentMode = 'metric';
      modeMetric.classList.add('btn-primary');
      modeMetric.classList.remove('btn-secondary');
      modeImperial.classList.remove('btn-primary');
      modeImperial.classList.add('btn-secondary');
      if (metricInputs) metricInputs.style.display = 'block';
      if (imperialInputs) imperialInputs.style.display = 'none';
      
  if (resBmi) resBmi.textContent = '0.0';
  if (resCategory) resCategory.textContent = 'Enter height & weight';
  if (resIdealWeight) resIdealWeight.textContent = '0.0 kg';
  if (resBmr) resBmr.textContent = '0 kcal/day';

    };

    modeImperial.onclick = () => {
      currentMode = 'imperial';
      modeImperial.classList.add('btn-primary');
      modeImperial.classList.remove('btn-secondary');
      modeMetric.classList.remove('btn-primary');
      modeMetric.classList.add('btn-secondary');
      if (metricInputs) metricInputs.style.display = 'none';
      if (imperialInputs) imperialInputs.style.display = 'block';
      calculateBMI();
    };
  }

  [heightCmInput, weightKgInput, heightFtInput, heightInInput, weightLbsInput, userAgeInput, userGenderSelect].forEach(el => {
    if (el) {
      el.oninput = calculateBMI;
      el.onchange = calculateBMI;
    }
  });

  calculateBMI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBMICalculator);
} else {
  initBMICalculator();
}

window.addEventListener('load', initBMICalculator);
