document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('text-input');
  const cntWords = document.getElementById('cnt-words');
  const cntChars = document.getElementById('cnt-chars');
  const cntCharsNoSpace = document.getElementById('cnt-chars-nospace');
  const cntSentences = document.getElementById('cnt-sentences');
  const cntParagraphs = document.getElementById('cnt-paragraphs');
  const cntReadTime = document.getElementById('cnt-readtime');

  function analyzeText() {
    if (!textarea) return;
    const text = textarea.value;

    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;

    const trimmed = text.trim();
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).filter(w => w.length > 0).length;

    const sentences = trimmed === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = trimmed === '' ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Reading time: avg 200 words per minute
    const readTimeMins = Math.ceil(words / 200);

    cntWords.textContent = words.toLocaleString();
    cntChars.textContent = chars.toLocaleString();
    cntCharsNoSpace.textContent = charsNoSpace.toLocaleString();
    cntSentences.textContent = sentences.toLocaleString();
    cntParagraphs.textContent = paragraphs.toLocaleString();
    cntReadTime.textContent = readTimeMins + (readTimeMins === 1 ? ' min' : ' mins');
  }

  textarea.addEventListener('input', analyzeText);
  analyzeText();
});
