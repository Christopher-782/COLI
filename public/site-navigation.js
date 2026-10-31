// One lightweight, accessible menu shared across the site's pages.
(() => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!navbar || !toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const opening = !menu.classList.contains('active');
    menu.classList.toggle('active', opening);
    toggle.setAttribute('aria-expanded', String(opening));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!navbar.contains(event.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
})();
