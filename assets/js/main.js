// Main Global JS for Numbora Platform
document.addEventListener('DOMContentLoaded', () => {
  // Theme Switching Logic
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('numbora_theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('numbora_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      mobileMenuBtn.textContent = isActive ? '✕' : '☰';
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking on any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
      });
    });

    // Close menu when tapping outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== mobileMenuBtn) {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
      }
    });
  }

  // Enhanced Prefix & Keyword Live Search Filter
  const searchInput = document.getElementById('tool-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const toolCards = document.querySelectorAll('.tool-card');

      if (!query) {
        toolCards.forEach(card => card.style.display = 'flex');
        return;
      }

      const queryTokens = query.split(/\s+/);

      toolCards.forEach(card => {
        const textContent = card.textContent.toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const searchableText = `${textContent} ${keywords}`;

        // Check if every query word matches as a substring or prefix in searchable text
        const isMatch = queryTokens.every(token => searchableText.includes(token));

        if (isMatch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Dynamic Hero Graphic Card Auto-Slideshow (Changes Smoothly Every 3.5 Seconds)
  const heroSlides = document.querySelectorAll('.hero-slide-item');
  if (heroSlides.length > 0) {
    let activeIndex = 0;

    function rotateHeroGraphic() {
      heroSlides.forEach((slide, idx) => {
        if (idx === activeIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      activeIndex = (activeIndex + 1) % heroSlides.length;
    }

    rotateHeroGraphic();
    setInterval(rotateHeroGraphic, 3500); // 3.5 seconds comfortable reading interval
  }
});
