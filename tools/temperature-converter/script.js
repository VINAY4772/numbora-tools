document.addEventListener('DOMContentLoaded', () => {
  const celsiusInput = document.getElementById('temp-celsius');
  const fahrenheitInput = document.getElementById('temp-fahrenheit');
  const kelvinInput = document.getElementById('temp-kelvin');

  celsiusInput.addEventListener('input', () => {
    let c = parseFloat(celsiusInput.value);
    if (isNaN(c)) {
      fahrenheitInput.value = '';
      kelvinInput.value = '';
      return;
    }
    // Absolute zero check: -273.15°C
    if (c < -273.15) c = -273.15;

    fahrenheitInput.value = ((c * 9/5) + 32).toFixed(2);
    kelvinInput.value = (c + 273.15).toFixed(2);
  });

  fahrenheitInput.addEventListener('input', () => {
    let f = parseFloat(fahrenheitInput.value);
    if (isNaN(f)) {
      celsiusInput.value = '';
      kelvinInput.value = '';
      return;
    }
    // Absolute zero check: -459.67°F
    if (f < -459.67) f = -459.67;

    const c = (f - 32) * (5/9);
    celsiusInput.value = c.toFixed(2);
    kelvinInput.value = (c + 273.15).toFixed(2);
  });

  kelvinInput.addEventListener('input', () => {
    let k = parseFloat(kelvinInput.value);
    if (isNaN(k)) {
      celsiusInput.value = '';
      fahrenheitInput.value = '';
      return;
    }
    // Absolute zero check: 0 K
    if (k < 0) k = 0;

    const c = k - 273.15;
    celsiusInput.value = c.toFixed(2);
    fahrenheitInput.value = ((c * 9/5) + 32).toFixed(2);
  });

  // Initial trigger
  celsiusInput.dispatchEvent(new Event('input'));
});
