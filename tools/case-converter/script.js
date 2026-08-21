document.addEventListener('DOMContentLoaded', () => {
  const mainInput = document.getElementById('case-input');
  const cardsContainer = document.getElementById('case-cards-container');

  const btnCopyInput = document.getElementById('btn-copy-input');
  const btnClear = document.getElementById('btn-clear');
  const btnSample = document.getElementById('btn-sample');

  const SAMPLE_TEXT = 'HELLO-WORLD-WELCOME-TO-NUMBORA';

  // Robust Word Tokenizer
  function extractWords(str) {
    if (!str || typeof str !== 'string') return [];
    // Extract words splitting on spaces, hyphens, underscores, dots, slashes, and camelCase
    const clean = str.replace(/[^a-zA-Z0-9\s-_./]/g, ' ');
    const matched = clean.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)|\d+/g);
    if (matched && matched.length > 0) return matched;
    return str.trim().split(/\s+/).filter(Boolean);
  }

  // 15+ Converter Functions
  const converters = {
    uppercase: str => str.toUpperCase(),
    lowercase: str => str.toLowerCase(),
    titlecase: str => {
      return str.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
    },
    sentencecase: str => {
      return str.toLowerCase().replace(/(^\s*|[.!?]\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    },
    camelcase: str => {
      const words = extractWords(str);
      if (words.length === 0) return '';
      return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
    pascalcase: str => {
      const words = extractWords(str);
      if (words.length === 0) return '';
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
    snakecase: str => {
      const words = extractWords(str);
      return words.map(w => w.toLowerCase()).join('_');
    },
    kebabcase: str => {
      const words = extractWords(str);
      return words.map(w => w.toLowerCase()).join('-');
    },
    constantcase: str => {
      const words = extractWords(str);
      return words.map(w => w.toUpperCase()).join('_');
    },
    dotcase: str => {
      const words = extractWords(str);
      return words.map(w => w.toLowerCase()).join('.');
    },
    pathcase: str => {
      const words = extractWords(str);
      return words.map(w => w.toLowerCase()).join('/');
    },
    traincase: str => {
      const words = extractWords(str);
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
    },
    alternatingcase: str => {
      let res = '';
      for (let i = 0; i < str.length; i++) {
        res += i % 2 === 0 ? str[i].toLowerCase() : str[i].toUpperCase();
      }
      return res;
    },
    invertcase: str => {
      let res = '';
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        res += c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      }
      return res;
    },
    slugcase: str => {
      const words = extractWords(str);
      return words.map(w => w.toLowerCase()).join('-');
    }
  };

  const caseDefinitionsList = [
    { id: 'uppercase', title: '🔠 UPPERCASE', func: converters.uppercase },
    { id: 'lowercase', title: '🔡 lowercase', func: converters.lowercase },
    { id: 'titlecase', title: '📰 Title Case', func: converters.titlecase },
    { id: 'sentencecase', title: '📝 Sentence case', func: converters.sentencecase },
    { id: 'camelcase', title: '🐫 camelCase', func: converters.camelcase },
    { id: 'pascalcase', title: '🏛️ PascalCase', func: converters.pascalcase },
    { id: 'snakecase', title: '🐍 snake_case', func: converters.snakecase },
    { id: 'kebabcase', title: '🍢 kebab-case', func: converters.kebabcase },
    { id: 'constantcase', title: '📢 CONSTANT_CASE', func: converters.constantcase },
    { id: 'dotcase', title: '🔴 dot.case', func: converters.dotcase },
    { id: 'pathcase', title: '📁 path/case', func: converters.pathcase },
    { id: 'traincase', title: '🚂 Train-Case', func: converters.traincase },
    { id: 'alternatingcase', title: '🤪 aLtErNaTiNg cAsE', func: converters.alternatingcase },
    { id: 'invertcase', title: '🔄 InVeRt cAsE', func: converters.invertcase },
    { id: 'slugcase', title: '🔗 URL Slug', func: converters.slugcase }
  ];

  function renderCaseCards() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    caseDefinitionsList.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card case-card';
      card.style.cssText = 'display: flex; flex-direction: column; gap: 8px; position: relative;';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h4 style="margin: 0; font-size: 0.95rem; color: var(--text-main);">${c.title}</h4>
          <button class="btn btn-secondary copy-case-btn" data-id="${c.id}" style="padding: 4px 12px; font-size: 0.78rem;">📋 Copy</button>
        </div>
        <input type="text" id="out-${c.id}" class="input-control case-out-field" readonly style="font-family: monospace; font-size: 0.9rem; background: var(--bg-input);" />
      `;
      cardsContainer.appendChild(card);
    });

    attachCopyHandlers();
  }

  function updateConversions() {
    if (!mainInput) return;
    const raw = mainInput.value;
    const text = raw.trim() === '' ? SAMPLE_TEXT : raw;

    caseDefinitionsList.forEach(c => {
      const field = document.getElementById(`out-${c.id}`);
      if (field) {
        field.value = c.func(text);
      }
    });
  }

  function attachCopyHandlers() {
    if (!cardsContainer) return;
    cardsContainer.querySelectorAll('.copy-case-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const field = document.getElementById(`out-${id}`);
        if (field && field.value) {
          copyToClipboard(field.value, 'Case format copied to clipboard! 📋');
        }
      };
    });
  }

  // Handle Quick Action Convert Buttons above input box
  const actionBtns = document.querySelectorAll('.case-action-btn');
  actionBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const convertType = btn.getAttribute('data-convert');
      if (converters[convertType]) {
        // If main input is empty, load SAMPLE_TEXT first
        if (!mainInput.value || mainInput.value.trim() === '') {
          mainInput.value = SAMPLE_TEXT;
        }
        
        // Execute conversion directly on main textarea
        const newText = converters[convertType](mainInput.value);
        mainInput.value = newText;
        
        // Highlight active button visually
        actionBtns.forEach(b => b.classList.remove('btn-primary', 'active'));
        btn.classList.add('btn-primary', 'active');

        // Update all cards below
        updateConversions();

        if (typeof showToast === 'function') {
          showToast(`Converted main text to ${btn.textContent.trim()}! ✨`);
        }
      }
    };
  });

  if (mainInput) {
    mainInput.oninput = updateConversions;
  }

  if (btnCopyInput) {
    btnCopyInput.onclick = () => {
      const textToCopy = mainInput.value || SAMPLE_TEXT;
      copyToClipboard(textToCopy, 'Main text copied to clipboard! 📋');
    };
  }

  if (btnClear) {
    btnClear.onclick = () => {
      mainInput.value = '';
      updateConversions();
    };
  }

  if (btnSample) {
    btnSample.onclick = () => {
      mainInput.value = SAMPLE_TEXT;
      updateConversions();
    };
  }

  renderCaseCards();
  updateConversions();
});
