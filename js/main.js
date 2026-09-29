// ponytail: minimal, robust native JS — zero frameworks, native RAF parallax

// ════════════════ MOBILE MENU ════════════════
function toggleMenu() {
  const overlay = document.getElementById('menuOverlay');
  const hamburger = document.querySelector('.nav-hamburger');
  if (!overlay || !hamburger) return;

  const isActive = overlay.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(isActive));
  document.body.style.overflow = isActive ? 'hidden' : '';
}

// ════════════════ CONTACT FORM SUBMIT ════════════════
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('form-name')?.value.trim();
  const email = document.getElementById('form-email')?.value.trim();
  const msg = document.getElementById('form-msg')?.value.trim();
  const statusEl = document.getElementById('formStatus');

  if (!name || !email || !msg) {
    if (statusEl) {
      statusEl.textContent = 'Harap lengkapi semua kolom.';
      statusEl.style.color = '#e53e3e';
    }
    return;
  }

  // Pre-fill email client for recruiter inquiry
  const subject = encodeURIComponent(`Peluang Kerja / Kontak Portofolio dari ${name}`);
  const body = encodeURIComponent(`Halo Hendra,\n\nNama/Perusahaan: ${name}\nEmail: ${email}\n\nPesan / Tawaran Kerja:\n${msg}`);
  window.location.href = `mailto:hendra03174@gmail.com?subject=${subject}&body=${body}`;

  if (statusEl) {
    statusEl.textContent = 'Membuka aplikasi email... Terima kasih atas pesannya!';
    statusEl.style.color = '#5d7037';
  }
}

// ════════════════ SCROLL REVEAL ════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 40);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ════════════════ DYNAMIC NAVBAR THEME & ACTIVE LINK ════════════════
const nav = document.querySelector('.nav');
const hero = document.getElementById('hero');

if (nav && hero) {
  const navObserver = new IntersectionObserver(([entry]) => {
    nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
  }, { rootMargin: '-70px 0px 0px 0px' });

  navObserver.observe(hero);
}

// Active Nav Indicator on Scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { passive: true });

// ════════════════ SMOOTH SCROLL PARALLAX ════════════════
(() => {
  const watermark = document.querySelector('.hero-watermark');
  const portrait = document.querySelector('.hero-portrait');
  const introBox = document.querySelector('.hero-intro-box');
  const quickCards = document.querySelector('.hero-quick-cards');

  if (!hero || (!watermark && !portrait && !introBox && !quickCards)) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  let prefersReducedMotion = motionQuery.matches;
  let isMobile = mobileQuery.matches;
  let isTicking = false;

  function resetParallax() {
    if (watermark) watermark.style.transform = '';
    if (portrait) portrait.style.transform = '';
    if (introBox) introBox.style.transform = '';
    if (quickCards) quickCards.style.transform = '';
  }

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) resetParallax();
  });

  mobileQuery.addEventListener('change', (e) => {
    isMobile = e.matches;
    if (isMobile) resetParallax();
  });

  function updateParallax() {
    isTicking = false;
    if (prefersReducedMotion || isMobile) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrollY > heroHeight + 50) return;

    // 1. Watermark depth lag
    if (watermark) {
      const y = scrollY * 0.22;
      watermark.style.transform = `translate3d(-50%, calc(-50% + ${y.toFixed(2)}px), 0)`;
    }

    // 2. Centered Portrait subtle vertical parallax (maintains -50% horizontal center)
    if (portrait) {
      const y = scrollY * 0.12;
      portrait.style.transform = `translate3d(-50%, ${y.toFixed(2)}px, 0)`;
    }

    // 3. Flanking cards subtle floating parallax
    if (introBox) {
      const y = -scrollY * 0.05;
      introBox.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    if (quickCards) {
      const y = -scrollY * 0.07;
      quickCards.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
