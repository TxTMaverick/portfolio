/* ================================================
   TEJAS TRIPATHI — PORTFOLIO SCRIPTS
   Sections:
   1. Active nav highlight on scroll
   2. Smooth reveal on scroll (IntersectionObserver)
================================================ */

// ── 1. Active nav link on scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -50% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));


// ── 2. Scroll reveal ──────────────────────────────
const revealElements = document.querySelectorAll(
  '.about-card, .exp-item, .skill-group, .project-card, .writing-pill'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // staggered delay based on sibling index
        const delay = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target) * 60;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Add initial hidden state via JS so CSS-only still works if JS fails
revealElements.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  revealObserver.observe(el);
});

// Revealed class applied by observer
document.head.insertAdjacentHTML(
  'beforeend',
  `<style>.revealed { opacity: 1 !important; transform: none !important; }</style>`
);
