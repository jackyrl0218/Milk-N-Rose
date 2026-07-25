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

class CinelinPreviewCartDrawer {
  constructor(page) {
    this.page = page;
    this.toggle = page.querySelector('.cinelin-page__actions a[href$="cart-preview.html"]');
    if (!this.toggle || page.querySelector('[data-cinelin-preview-cart-drawer]')) return;

    this.toggle.setAttribute('role', 'button');
    this.toggle.setAttribute('aria-haspopup', 'dialog');
    this.toggle.setAttribute('aria-expanded', 'false');

    this.drawer = document.createElement('aside');
    this.drawer.className = 'cinelin-preview-cart';
    this.drawer.setAttribute('data-cinelin-preview-cart-drawer', '');
    this.drawer.setAttribute('aria-label', 'Bag');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.drawer.innerHTML = `
      <div class="cinelin-preview-cart__panel" role="dialog" aria-modal="true" aria-labelledby="CinelinPreviewCartTitle">
        <header class="cinelin-preview-cart__header">
          <h2 id="CinelinPreviewCartTitle">Bag</h2>
          <button class="cinelin-preview-cart__close" type="button" aria-label="Close bag" data-cinelin-preview-cart-close>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </header>
        <p class="cinelin-preview-cart__promo">Spend $15.00 more and get free shipping</p>
        <article class="cinelin-preview-cart__item">
          <div class="cinelin-preview-cart__model" aria-hidden="true">
            <span class="cinelin-card__model"><span class="cinelin-card__gem"></span><span class="cinelin-card__ring"></span><span class="cinelin-card__stone"></span><span class="cinelin-card__shadow"></span></span>
          </div>
          <div class="cinelin-preview-cart__copy">
            <h3>Pearl loop</h3>
            <p>$88</p>
            <p>Gold / One size</p>
            <div class="cinelin-preview-cart__quantity"><button type="button" aria-label="Decrease quantity">-</button><span>1</span><button type="button" aria-label="Increase quantity">+</button></div>
            <a href="cart-preview.html">Remove</a>
          </div>
        </article>
        <div class="cinelin-preview-cart__trust"><span><strong>Trusted by 1m</strong><small>customers</small></span><span><strong>Secure payments</strong><small>protected checkout</small></span><span><strong>Easy returns</strong><small>simple support</small></span></div>
        <div class="cinelin-preview-cart__summary"><div><span>Sub total</span><span>$88.00</span></div><div><span>Total</span><strong>$88.00</strong></div><a href="cart-preview.html">Checkout</a></div>
      </div>
    `;
    page.append(this.drawer);
    this.closeButton = this.drawer.querySelector('[data-cinelin-preview-cart-close]');

    this.toggle.addEventListener('click', (event) => {
      event.preventDefault();
      this.setOpen(!this.page.classList.contains('is-cart-open'));
    });
    this.closeButton?.addEventListener('click', () => this.setOpen(false));
    this.drawer.addEventListener('click', (event) => {
      if (event.target === this.drawer) this.setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.page.classList.contains('is-cart-open')) this.setOpen(false);
    });
  }

  setOpen(isOpen) {
    this.page.classList.toggle('is-cart-open', isOpen);
    this.toggle.setAttribute('aria-expanded', String(isOpen));
    this.drawer.setAttribute('aria-hidden', String(!isOpen));
    document.documentElement.classList.toggle('cinelin-preview-cart-open', isOpen);
    document.body.classList.toggle('cinelin-preview-cart-open', isOpen);

    if (isOpen) {
      this.page.cinelinPageMenu?.setOpen(false);
      this.closeButton?.focus();
    } else if (document.activeElement && this.drawer.contains(document.activeElement)) {
      this.toggle.focus();
    }
  }
}

const initCinelinProductModelGrids = (container = document) => {
  container.querySelectorAll('[data-cinelin-product-grid], [data-cinelin-product-media]').forEach((grid) => {
    if (!grid.cinelinProductModelGrid) {
      grid.cinelinProductModelGrid = new CinelinProductModelGrid(grid);
    }
  });
};

const initCinelinProductPages = (container = document) => {
  container.querySelectorAll('[data-cinelin-product]').forEach((productPage) => {
    if (productPage.cinelinProductPage) return;
    productPage.cinelinProductPage = true;

    const thumbs = Array.from(productPage.querySelectorAll('[data-cinelin-product-thumb]'));
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((item) => item.classList.toggle('is-active', item === thumb));
      });
    });
  });
};

const initCinelinPageMenus = (container = document) => {
  container.querySelectorAll('[data-cinelin-page]').forEach((page) => {
    if (!page.cinelinPageMenu) {
      page.cinelinPageMenu = new CinelinPageMenu(page);
    }
    if (!page.cinelinPreviewCartDrawer) {
      page.cinelinPreviewCartDrawer = new CinelinPreviewCartDrawer(page);
    }
  });
};

const initCinelinAboutScrollEffects = (container = document) => {
  const aboutPages = Array.from(container.querySelectorAll('.cinelin-page--about'));
  if (container.matches?.('.cinelin-page--about')) {
    aboutPages.push(container);
  }

  aboutPages.forEach((page) => {
    if (page.cinelinAboutScrollEffects) return;
    page.cinelinAboutScrollEffects = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = Array.from(page.querySelectorAll('[data-about-reveal]'));
    const floatItems = Array.from(page.querySelectorAll('[data-about-float]'));

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    let isTicking = false;
    const updateFloat = () => {
      isTicking = false;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      floatItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const offset = Math.max(-1, Math.min(1, progress)) * -28;
        item.style.setProperty('--about-parallax', `${offset.toFixed(2)}px`);
      });
    };

    const requestFloatUpdate = () => {
      if (isTicking) return;
      isTicking = true;
      window.requestAnimationFrame(updateFloat);
    };

    updateFloat();
    window.addEventListener('scroll', requestFloatUpdate, { passive: true });
    window.addEventListener('resize', requestFloatUpdate);
  });
};

initCinelinPageMenus();
initCinelinProductModelGrids();
initCinelinProductPages();
initCinelinAboutScrollEffects();

document.addEventListener('shopify:section:load', (event) => {
  initCinelinPageMenus(event.target);
  initCinelinProductModelGrids(event.target);
  initCinelinProductPages(event.target);
  initCinelinAboutScrollEffects(event.target);
});
