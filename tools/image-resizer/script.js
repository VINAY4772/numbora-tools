document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const dropzone = document.getElementById('dropzone');
  const workspace = document.getElementById('resizer-workspace');

  const origWidthEl = document.getElementById('orig-width');
  const origHeightEl = document.getElementById('orig-height');
  const origSizeEl = document.getElementById('orig-size');

  const targetWidthInput = document.getElementById('target-width');
  const targetHeightInput = document.getElementById('target-height');
  const lockAspectCheckbox = document.getElementById('lock-aspect');

  const resizeBtn = document.getElementById('resize-btn');
  const previewCanvas = document.getElementById('preview-canvas');
  const downloadBtn = document.getElementById('download-btn');
  const changeImgBtn = document.getElementById('change-img-btn');

  let imgElement = null;
  let originalAspectRatio = 1;
  let originalFile = null;

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  });

  dropzone.addEventListener('dragover', (e) => e.preventDefault());
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImage(e.dataTransfer.files[0]);
    }
  });

  changeImgBtn.addEventListener('click', () => {
    workspace.style.display = 'none';
    dropzone.style.display = 'block';
    fileInput.value = '';
  });

  function loadImage(file) {
    if (!file.type.startsWith('image/')) return;
    originalFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imgElement = new Image();
      imgElement.onload = () => {
        originalAspectRatio = imgElement.width / imgElement.height;

        origWidthEl.textContent = imgElement.width + ' px';
        origHeightEl.textContent = imgElement.height + ' px';
        origSizeEl.textContent = formatBytes(file.size);

        targetWidthInput.value = imgElement.width;
        targetHeightInput.value = imgElement.height;

        dropzone.style.display = 'none';
        workspace.style.display = 'grid';

        processResize();
      };
      imgElement.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  targetWidthInput.addEventListener('input', () => {
    if (lockAspectCheckbox.checked && originalAspectRatio) {
      const w = parseInt(targetWidthInput.value) || 0;
      targetHeightInput.value = Math.round(w / originalAspectRatio);
    }
    processResize();
  });

  targetHeightInput.addEventListener('input', () => {
    if (lockAspectCheckbox.checked && originalAspectRatio) {
      const h = parseInt(targetHeightInput.value) || 0;
      targetWidthInput.value = Math.round(h * originalAspectRatio);
    }
    processResize();
  });

  resizeBtn.addEventListener('click', processResize);

  function processResize() {
    if (!imgElement) return;

    const targetW = parseInt(targetWidthInput.value) || imgElement.width;
    const targetH = parseInt(targetHeightInput.value) || imgElement.height;

    previewCanvas.width = targetW;
    previewCanvas.height = targetH;

    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, targetW, targetH);
  }

  downloadBtn.addEventListener('click', () => {
    if (!previewCanvas) return;
    const link = document.createElement('a');
    link.download = `resized_${Date.now()}.png`;
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
    showToast('Resized image downloaded!');
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});
