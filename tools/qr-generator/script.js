// Numbora QR Code Generator UI Controller using qrcode.min.js
document.addEventListener('DOMContentLoaded', () => {
  const qrInput = document.getElementById('qr-text');
  const qrSizeInput = document.getElementById('qr-size');
  const fgColorInput = document.getElementById('fg-color');
  const bgColorInput = document.getElementById('bg-color');

  const qrContainer = document.getElementById('qrcode');
  const downloadPngBtn = document.getElementById('download-png-btn');
  const downloadSvgBtn = document.getElementById('download-svg-btn');
  const copyBtn = document.getElementById('copy-btn');

  const presetTabs = document.querySelectorAll('.preset-tab');
  const presetLabel = document.getElementById('preset-label');

  let currentPreset = 'url';

  const wifiSsid = document.getElementById('wifi-ssid');
  const wifiPass = document.getElementById('wifi-pass');
  const wifiContainer = document.getElementById('wifi-container');

  function getFormattedQRText() {
    if (currentPreset === 'wifi') {
      const ssid = wifiSsid ? wifiSsid.value.trim() : '';
      const pass = wifiPass ? wifiPass.value.trim() : '';
      return `WIFI:T:WPA;S:${ssid};P:${pass};;`;
    }
    return qrInput.value.trim() || 'https://example.com';
  }

  function renderQR() {
    if (!qrContainer) return;
    const text = getFormattedQRText();
    const size = parseInt(qrSizeInput.value) || 256;
    const fg = fgColorInput.value || '#059669';
    const bg = bgColorInput.value || '#ffffff';

    // Clear previous QR code rendering
    qrContainer.innerHTML = '';

    try {
      new QRCode(qrContainer, {
        text: text,
        width: size,
        height: size,
        colorDark: fg,
        colorLight: bg,
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.error('QR Render Error:', e);
    }
  }

  // Handle Preset Tabs
  if (presetTabs) {
    presetTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        presetTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        currentPreset = tab.getAttribute('data-preset');

        if (currentPreset === 'wifi') {
          if (wifiContainer) wifiContainer.style.display = 'block';
          if (qrInput) qrInput.parentElement.style.display = 'none';
        } else {
          if (wifiContainer) wifiContainer.style.display = 'none';
          if (qrInput) {
            qrInput.parentElement.style.display = 'block';
            if (currentPreset === 'url') {
              presetLabel.textContent = 'Website URL';
              qrInput.value = 'https://example.com';
              qrInput.placeholder = 'https://example.com';
            } else if (currentPreset === 'text') {
              presetLabel.textContent = 'Plain Text Message';
              qrInput.value = 'Hello from QR Code Generator!';
              qrInput.placeholder = 'Type plain text message...';
            } else if (currentPreset === 'email') {
              presetLabel.textContent = 'Email Address (mailto:)';
              qrInput.value = 'mailto:contact@example.com';
              qrInput.placeholder = 'mailto:user@example.com';
            } else if (currentPreset === 'phone') {
              presetLabel.textContent = 'Phone Number (tel:)';
              qrInput.value = 'tel:+1234567890';
              qrInput.placeholder = 'tel:+1234567890';
            }
          }
        }
        renderQR();
      });
    });
  }

  if (wifiSsid) wifiSsid.addEventListener('input', renderQR);
  if (wifiPass) wifiPass.addEventListener('input', renderQR);

  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', () => {
      const canvas = qrContainer.querySelector('canvas');
      const img = qrContainer.querySelector('img');
      const dataUrl = canvas ? canvas.toDataURL('image/png') : (img ? img.src : '');

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `numbora_qrcode_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        if (typeof showToast === 'function') showToast('PNG QR Code Downloaded! 📥');
      }
    });
  }

  if (downloadSvgBtn) {
    downloadSvgBtn.addEventListener('click', () => {
      const canvas = qrContainer.querySelector('canvas');
      const dataUrl = canvas ? canvas.toDataURL('image/png') : '';
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `numbora_qrcode_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        if (typeof showToast === 'function') showToast('QR Code Image Downloaded! 📥');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const canvas = qrContainer.querySelector('canvas');
      if (canvas && canvas.toBlob) {
        canvas.toBlob(blob => {
          if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              if (typeof showToast === 'function') showToast('QR Image Copied to Clipboard! 📋');
            });
          } else {
            if (typeof showToast === 'function') showToast('Copied QR Image to Clipboard!');
          }
        });
      }
    });
  }

  if (qrInput) qrInput.addEventListener('input', renderQR);
  if (qrSizeInput) qrSizeInput.addEventListener('change', renderQR);
  if (fgColorInput) fgColorInput.addEventListener('change', renderQR);
  if (bgColorInput) bgColorInput.addEventListener('change', renderQR);

  renderQR();
});
