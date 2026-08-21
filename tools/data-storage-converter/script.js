const DATA_UNITS = {
  bit: { label: 'Bit (b)', bits: 1 },
  byte: { label: 'Byte (B)', bits: 8 },
  // Decimal Units (Base 1000)
  kb: { label: 'Kilobyte (KB - Base 1000)', bits: 8 * 1000 },
  mb: { label: 'Megabyte (MB - Base 1000)', bits: 8 * 1000000 },
  gb: { label: 'Gigabyte (GB - Base 1000)', bits: 8 * 1000000000 },
  tb: { label: 'Terabyte (TB - Base 1000)', bits: 8 * 1000000000000 },
  // Binary Units (Base 1024)
  kib: { label: 'Kibibyte (KiB - Base 1024)', bits: 8 * 1024 },
  mib: { label: 'Mebibyte (MiB - Base 1024)', bits: 8 * 1048576 },
  gib: { label: 'Gibibyte (GiB - Base 1024)', bits: 8 * 1073741824 },
  tib: { label: 'Tebibyte (TiB - Base 1024)', bits: 8 * 1099511627776 }
};

function initDataStorageConverter() {
  const inputVal = document.getElementById('data-val');
  const unitSelect = document.getElementById('data-unit');
  const gridContainer = document.getElementById('storage-results-grid');

  if (!inputVal || !unitSelect || !gridContainer) return;

  function convertData() {
    const val = parseFloat(inputVal.value) || 0;
    const sourceKey = unitSelect.value;
    const sourceData = DATA_UNITS[sourceKey];

    if (!sourceData) return;

    const totalBits = val * sourceData.bits;

    gridContainer.innerHTML = '';
    Object.keys(DATA_UNITS).forEach(key => {
      const targetData = DATA_UNITS[key];
      const eqVal = totalBits / targetData.bits;

      const card = document.createElement('div');
      const isSelected = key === sourceKey;
      card.style.cssText = `padding: 10px 12px; background: ${isSelected ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-input)'}; border-radius: var(--radius-md); border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'};`;
      
      let formattedVal = '';
      if (typeof formatNumber === 'function') {
        formattedVal = formatNumber(eqVal, eqVal < 0.0001 && eqVal > 0 ? 8 : 4);
      } else {
        formattedVal = eqVal.toLocaleString(undefined, { maximumFractionDigits: 6 });
      }

      card.innerHTML = `
        <div style="font-size: 0.72rem; color: ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 700;">${targetData.label}</div>
        <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">${formattedVal}</div>
      `;
      gridContainer.appendChild(card);
    });
  }

  inputVal.oninput = convertData;
  unitSelect.onchange = convertData;

  convertData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDataStorageConverter);
} else {
  initDataStorageConverter();
}
