(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileMenu.hidden = true;
  }
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
    mobileMenu.hidden = isOpen;
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const dialog = document.querySelector('.service-dialog');
  const descriptions = {
    'Шиномонтаж': 'Мобильный шиномонтаж — 2 500 ₽ по прайсу. Уточним состояние колеса, необходимые работы и итоговую стоимость до выезда.',
    'Эвакуатор': 'Эвакуатор — 2 000 ₽ по прайсу. Уточним тип автомобиля, место погрузки, маршрут и итоговую стоимость до выезда.'
  };
  let dialogOpener;
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => {
      dialogOpener = button;
      document.querySelector('#dialog-title').textContent = button.dataset.service === 'Эвакуатор' ? 'Вызвать эвакуатор' : 'Вызвать шиномонтаж';
      document.querySelector('#dialog-description').textContent = descriptions[button.dataset.service];
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    dialogOpener?.focus({ preventScroll: true });
  });

  const toast = document.querySelector('.toast');
  let toastTimeout;
  function notify(message) {
    window.clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 4200);
  }
  document.querySelector('.copy-phone').addEventListener('click', async () => {
    const phone = '+79885266060';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phone);
      } else {
        const field = document.createElement('textarea');
        field.value = phone;
        field.setAttribute('aria-label', 'Номер телефона');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      notify('Номер скопирован: +7 988 526-60-60');
    } catch {
      notify('Номер для звонка: +7 988 526-60-60');
    }
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    document.documentElement.classList.add('js-motion');
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
})();
