(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#navigation');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('open');
    }));
  }

  const stepCards = [...document.querySelectorAll('.step-card')];
  stepCards.forEach((card) => {
    const trigger = card.querySelector('.step-toggle');
    const content = card.querySelector('.step-content');
    if (!trigger || !content) return;
    trigger.addEventListener('click', () => {
      stepCards.forEach((other) => {
        const active = other === card;
        other.classList.toggle('is-active', active);
        other.querySelector('.step-toggle')?.setAttribute('aria-expanded', String(active));
        const otherContent = other.querySelector('.step-content');
        if (otherContent) otherContent.hidden = !active;
      });
    });
  });

  const form = document.querySelector('#diagnostic-form');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.elements.fax.value) return;
    const data = new FormData(form);
    const lines = [
      'Olá, Prospett! Quero conversar sobre marketing e crescimento para minha empresa.',
      '',
      `Nome: ${data.get('name')}`,
      `Empresa: ${data.get('company')}`,
      data.get('website') ? `Site: ${data.get('website')}` : null,
      `Prioridade: ${data.get('objective')}`
    ].filter(Boolean);
    const status = document.querySelector('#form-status');
    if (status) status.textContent = 'Abrindo o WhatsApp com sua mensagem para você revisar.';
    window.open(`https://wa.me/5551995501677?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const progress = document.querySelector('.scroll-progress');
  const ribbon = document.querySelector('.ribbon');
  const ribbonTrack = ribbon?.querySelector('.ribbon-track');
  function fillRibbon() {
    if (!ribbon || !ribbonTrack) return;
    const firstGroup = ribbonTrack.querySelector('.ribbon-group');
    const groupWidth = firstGroup?.getBoundingClientRect().width || 0;
    if (!groupWidth) return;
    const requiredWidth = ribbon.getBoundingClientRect().width + groupWidth;
    while (ribbonTrack.scrollWidth < requiredWidth) {
      ribbonTrack.append(firstGroup.cloneNode(true));
    }
  }
  function updateRibbon() {
    if (!ribbon || !ribbonTrack) return;
    const groupWidth = ribbonTrack.querySelector('.ribbon-group')?.getBoundingClientRect().width || 0;
    if (!groupWidth) return;
    const offset = (window.scrollY * 0.22) % groupWidth;
    ribbonTrack.style.setProperty('--ribbon-offset', `${offset}px`);
  }
  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }
  fillRibbon();
  updateRibbon();
  window.addEventListener('scroll', () => { updateProgress(); updateRibbon(); }, { passive: true });
  window.addEventListener('resize', () => { fillRibbon(); updateRibbon(); }, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('[data-reveal], [data-reveal-group] > *');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); instance.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item, index) => { item.style.transitionDelay = `${(index % 4) * 65}ms`; observer.observe(item); });
  } else revealItems.forEach((item) => item.classList.add('visible'));
})();
