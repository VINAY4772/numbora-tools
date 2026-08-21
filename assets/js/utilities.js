// Shared Utility & Math Helpers

function formatNumber(num, decimals = 2) {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

function copyToClipboard(text, msg = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') {
      showToast(msg);
    }
  }).catch(err => {
    console.error('Copy error:', err);
  });
}

// Format Date YYYY-MM-DD
function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}
