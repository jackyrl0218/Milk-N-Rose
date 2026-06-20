class CinelinProductModelGrid {
  constructor(container) {
    this.container = container;
    this.cards = Array.from(container.querySelectorAll('[data-cinelin-model-card]'));
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.reducedMotion) return;

    this.cards.forEach((card) => this.bindCard(card));
  }

  bindCard(card) {
    const modelButton = card.querySelector('[data-cinelin-model-button]') || card.querySelector('.cinelin-card__media');
    if (!modelButton) return;

    let spin = 0;
    let startX = 0;
    let startSpin = 0;
    let isDragging = false;

    modelButton.addEventListener('pointerdown', (event) => {
      isDragging = true;
      startX = event.clientX;
      startSpin = spin;
      card.classList.add('is-pointer-active');
      modelButton.setPointerCapture?.(event.pointerId);
    });

    modelButton.addEventListener('pointermove', (event) => {
      const rect = modelButton.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      card.classList.add('is-pointer-active');
      if (isDragging) {
        spin = startSpin + (event.clientX - startX) * 0.65;
        card.style.setProperty('--cinelin-spin', `${spin}deg`);
      }

      card.style.setProperty('--cinelin-tilt-y', `${x * 18}deg`);
      card.style.setProperty('--cinelin-tilt-x', `${-8 - y * 18}deg`);
    });

    const stopDrag = () => {
      isDragging = false;
    };

    modelButton.addEventListener('pointerup', stopDrag);
    modelButton.addEventListener('pointercancel', stopDrag);

    modelButton.addEventListener('click', (event) => {
      event.preventDefault();
      spin += 45;
      card.style.setProperty('--cinelin-spin', `${spin}deg`);
    });

    modelButton.addEventListener('pointerleave', () => {
      isDragging = false;
      card.classList.remove('is-pointer-active');
      card.style.setProperty('--cinelin-tilt-y', '0deg');
      card.style.setProperty('--cinelin-tilt-x', '-8deg');
    });
  }
}

class CinelinPageMenu {
  constructor(page) {
    this.page = page;
    this.button = page.querySelector('[data-cinelin-menu-toggle]');
    this.menu = page.querySelector('[data-cinelin-menu]');

    if (!this.button || !this.menu) return;

    this.button.addEventListener('click', () => {
      this.setOpen(!this.page.classList.contains('is-menu-open'));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.page.classList.contains('is-menu-open')) {
        this.setOpen(false);
      }
    });

    this.menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.setOpen(false));
    });
  }

  setOpen(isOpen) {
    this.page.classList.toggle('is-menu-open', isOpen);
    this.button.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('cinelin-page-menu-open', isOpen);
    document.body.classList.toggle('cinelin-page-menu-open', isOpen);

    if (isOpen) {
      this.menu.querySelector('a')?.focus();
    } else if (document.activeElement && this.menu.contains(document.activeElement)) {
      this.button.focus();
    }
  }
}

const initCinelinProductModelGrids = (container = document) => {
  container.querySelectorAll('[data-cinelin-product-grid]').forEach((grid) => {
    if (!grid.cinelinProductModelGrid) {
      grid.cinelinProductModelGrid = new CinelinProductModelGrid(grid);
    }
  });
};

const initCinelinPageMenus = (container = document) => {
  container.querySelectorAll('[data-cinelin-page]').forEach((page) => {
    if (!page.cinelinPageMenu) {
      page.cinelinPageMenu = new CinelinPageMenu(page);
    }
  });
};

initCinelinPageMenus();
initCinelinProductModelGrids();

document.addEventListener('shopify:section:load', (event) => {
  initCinelinPageMenus(event.target);
  initCinelinProductModelGrids(event.target);
});
