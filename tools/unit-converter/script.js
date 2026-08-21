const UNIT_DATA = {
  length: {
    meter: { label: 'Meter (m)', ratio: 1 },
    kilometer: { label: 'Kilometer (km)', ratio: 1000 },
    centimeter: { label: 'Centimeter (cm)', ratio: 0.01 },
    millimeter: { label: 'Millimeter (mm)', ratio: 0.001 },
    mile: { label: 'Mile (mi)', ratio: 1609.344 },
    yard: { label: 'Yard (yd)', ratio: 0.9144 },
    foot: { label: 'Foot (ft)', ratio: 0.3048 },
    inch: { label: 'Inch (in)', ratio: 0.0254 }
  },
  weight: {
    kilogram: { label: 'Kilogram (kg)', ratio: 1 },
    gram: { label: 'Gram (g)', ratio: 0.001 },
    milligram: { label: 'Milligram (mg)', ratio: 0.000001 },
    pound: { label: 'Pound (lb)', ratio: 0.45359237 },
    ounce: { label: 'Ounce (oz)', ratio: 0.02834952 },
    metric_ton: { label: 'Metric Ton (t)', ratio: 1000 }
  },
  area: {
    sq_meter: { label: 'Square Meter (m²)', ratio: 1 },
    sq_km: { label: 'Square Kilometer (km²)', ratio: 1000000 },
    sq_foot: { label: 'Square Foot (ft²)', ratio: 0.092903 },
    acre: { label: 'Acre (ac)', ratio: 4046.8564 },
    hectare: { label: 'Hectare (ha)', ratio: 10000 }
  },
  volume: {
    liter: { label: 'Liter (L)', ratio: 1 },
    milliliter: { label: 'Milliliter (mL)', ratio: 0.001 },
    cubic_meter: { label: 'Cubic Meter (m³)', ratio: 1000 },
    gallon: { label: 'Gallon (US gal)', ratio: 3.78541 }
  },
  speed: {
    mps: { label: 'Meters per sec (m/s)', ratio: 1 },
    kph: { label: 'Kilometers per hr (km/h)', ratio: 0.277778 },
    mph: { label: 'Miles per hr (mph)', ratio: 0.44704 },
    knot: { label: 'Knot (kn)', ratio: 0.514444 }
  },
  energy: {
    joule: { label: 'Joule (J)', ratio: 1 },
    kilojoule: { label: 'Kilojoule (kJ)', ratio: 1000 },
    calorie: { label: 'Calorie (cal)', ratio: 4.184 },
    kilocalorie: { label: 'Kilocalorie (kcal)', ratio: 4184 },
    watt_hour: { label: 'Watt-hour (Wh)', ratio: 3600 },
    kwh: { label: 'Kilowatt-hour (kWh)', ratio: 3600000 }
  },
  temperature: {
    celsius: { label: 'Celsius (°C)', isTemp: true },
    fahrenheit: { label: 'Fahrenheit (°F)', isTemp: true },
    kelvin: { label: 'Kelvin (K)', isTemp: true }
  },
  data: {
    bit: { label: 'Bit (b)', ratio: 1 },
    byte: { label: 'Byte (B)', ratio: 8 },
    kb: { label: 'Kilobyte (KB)', ratio: 8000 },
    mb: { label: 'Megabyte (MB)', ratio: 8000000 },
    gb: { label: 'Gigabyte (GB)', ratio: 8000000000 },
    tb: { label: 'Terabyte (TB)', ratio: 8000000000000 },
    kib: { label: 'Kibibyte (KiB)', ratio: 8192 },
    mib: { label: 'Mebibyte (MiB)', ratio: 8388608 },
    gib: { label: 'Gibibyte (GiB)', ratio: 8589934592 }
  }
};

function convertTemp(val, fromKey, toKey) {
  let celsius = val;
  if (fromKey === 'fahrenheit') celsius = (val - 32) * (5 / 9);
  if (fromKey === 'kelvin') celsius = val - 273.15;

  if (toKey === 'celsius') return celsius;
  if (toKey === 'fahrenheit') return (celsius * 9 / 5) + 32;
  if (toKey === 'kelvin') return celsius + 273.15;
  return celsius;
}

function initUnitConverter() {
  const catSelect = document.getElementById('category-select');
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');
  const fromVal = document.getElementById('from-val');
  const toVal = document.getElementById('to-val');
  const formulaDiv = document.getElementById('unit-formula');
  const gridContainer = document.getElementById('all-units-grid');
  const btnSwap = document.getElementById('btn-swap');
  const tabBtns = document.querySelectorAll('.unit-tab-btn');

  if (!catSelect || !fromSelect || !toSelect || !fromVal || !toVal) return;

  function populateUnits() {
    const cat = catSelect.value || 'length';
    const units = UNIT_DATA[cat];
    if (!units) return;

    const currentFrom = fromSelect.value;
    const currentTo = toSelect.value;

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    const keys = Object.keys(units);
    keys.forEach((key) => {
      const opt1 = document.createElement('option');
      opt1.value = key;
      opt1.textContent = units[key].label;
      fromSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = key;
      opt2.textContent = units[key].label;
      toSelect.appendChild(opt2);
    });

    if (keys.includes(currentFrom)) {
      fromSelect.value = currentFrom;
    } else if (keys.length > 0) {
      fromSelect.value = keys[0];
    }

    if (keys.includes(currentTo)) {
      toSelect.value = currentTo;
    } else if (keys.length > 1) {
      toSelect.value = keys[1];
    } else if (keys.length > 0) {
      toSelect.value = keys[0];
    }

    // Highlight active category tab
    if (tabBtns) {
      tabBtns.forEach(btn => {
        if (btn.getAttribute('data-cat') === cat) {
          btn.classList.add('btn-primary', 'active');
          btn.classList.remove('btn-secondary');
        } else {
          btn.classList.remove('btn-primary', 'active');
          btn.classList.add('btn-secondary');
        }
      });
    }

    convert();
  }

  function convert() {
    const cat = catSelect.value || 'length';
    const fromKey = fromSelect.value;
    const toKey = toSelect.value;
    const val = parseFloat(fromVal.value) || 0;

    const units = UNIT_DATA[cat];
    if (!units || !units[fromKey] || !units[toKey]) return;

    let res = 0;
    if (cat === 'temperature') {
      res = convertTemp(val, fromKey, toKey);
    } else {
      const baseVal = val * units[fromKey].ratio;
      res = baseVal / units[toKey].ratio;
    }

    if (typeof formatNumber === 'function') {
      toVal.textContent = formatNumber(res, 6);
    } else {
      toVal.textContent = res.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }

    if (formulaDiv) {
      if (cat === 'temperature') {
        formulaDiv.textContent = `${val} ${units[fromKey].label} = ${res.toFixed(2)} ${units[toKey].label}`;
      } else {
        const factor = units[fromKey].ratio / units[toKey].ratio;
        formulaDiv.textContent = `1 ${units[fromKey].label} = ${factor < 0.0001 && factor > 0 ? factor.toExponential(4) : factor.toFixed(6)} ${units[toKey].label}`;
      }
    }

    // Render All Equivalent Units Grid
    if (gridContainer) {
      gridContainer.innerHTML = '';
      Object.keys(units).forEach(key => {
        let eq = 0;
        if (cat === 'temperature') {
          eq = convertTemp(val, fromKey, key);
        } else {
          const base = val * units[fromKey].ratio;
          eq = base / units[key].ratio;
        }

        const isSelected = key === toKey;
        const card = document.createElement('div');
        card.style.cssText = `padding: 10px 12px; background: ${isSelected ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-input)'}; border-radius: var(--radius-md); border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'};`;
        
        let formattedEq = '';
        if (typeof formatNumber === 'function') {
          formattedEq = formatNumber(eq, eq < 0.0001 && eq > 0 ? 8 : 4);
        } else {
          formattedEq = eq.toLocaleString(undefined, { maximumFractionDigits: 6 });
        }

        card.innerHTML = `
          <div style="font-size: 0.75rem; color: ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 700;">${units[key].label}</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">${formattedEq}</div>
        `;
        gridContainer.appendChild(card);
      });
    }
  }

  if (catSelect) catSelect.onchange = populateUnits;
  if (fromSelect) fromSelect.onchange = convert;
  if (toSelect) toSelect.onchange = convert;

  if (fromVal) {
    fromVal.oninput = convert;
    fromVal.onkeyup = convert;
    fromVal.onchange = convert;
    fromVal.onpaste = () => setTimeout(convert, 10);
  }

  if (btnSwap) {
    btnSwap.onclick = (e) => {
      if (e) e.preventDefault();
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      convert();
    };
  }

  if (tabBtns) {
    tabBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        const targetCat = btn.getAttribute('data-cat');
        if (targetCat && catSelect) {
          catSelect.value = targetCat;
          populateUnits();
        }
      };
    });
  }

  populateUnits();
  setInterval(convert, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUnitConverter);
} else {
  initUnitConverter();
}

window.addEventListener('load', initUnitConverter);
