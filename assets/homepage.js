class HomepageOrbit {
  constructor(section) {
    this.section = section;
    this.stage = section.querySelector('[data-homepage-stage]');
    this.orbit = section.querySelector('[data-homepage-orbit]');
    this.menuToggle = section.querySelector('[data-homepage-menu-toggle]');
    this.menu = section.querySelector('[data-homepage-menu]');
    this.canvas = section.querySelector('[data-homepage-particles]');
    this.prevButton = section.querySelector('[data-homepage-prev]');
    this.nextButton = section.querySelector('[data-homepage-next]');
    this.rotation = 0;
    this.tilt = -10;
    this.startX = 0;
    this.startY = 0;
    this.startRotation = 0;
    this.startTilt = 0;
    this.isDragging = false;
    this.userPaused = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.stage || !this.orbit) return;

    const rotationSpeed = Number(section.dataset.rotationSpeed) || 18;
    this.orbit.style.setProperty('--homepage-spin-speed', `${rotationSpeed}s`);

    if (this.reducedMotion) {
      this.orbit.classList.add('is-paused');
    }

    this.updateRotation();
    this.bindEvents();
    this.initParticles();
  }

  bindEvents() {
    this.menuToggle?.addEventListener('click', () => {
      this.setMenuOpen(!this.stage.classList.contains('is-menu-open'));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.stage.classList.contains('is-menu-open')) {
        this.setMenuOpen(false);
      }
    });

    this.prevButton?.addEventListener('click', () => this.rotateBy(-45));
    this.nextButton?.addEventListener('click', () => this.rotateBy(45));

    this.orbit.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    this.orbit.addEventListener('pointermove', (event) => this.onPointerMove(event));
    this.orbit.addEventListener('pointerup', () => this.onPointerUp());
    this.orbit.addEventListener('pointercancel', () => this.onPointerUp());
    this.orbit.addEventListener('mouseenter', () => this.pauseAtCurrentRotation());
    this.orbit.addEventListener('mouseleave', () => {
      if (!this.reducedMotion && !this.isDragging && !this.userPaused) this.orbit.classList.remove('is-paused');
    });

    this.orbit.querySelectorAll('.homepage__model-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.userPaused = true;
        this.pauseAtCurrentRotation();
      });
    });
  }

  setMenuOpen(isOpen) {
    this.stage.classList.toggle('is-menu-open', isOpen);
    this.menuToggle?.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('homepage-menu-open', isOpen);
    document.body.classList.toggle('homepage-menu-open', isOpen);

    if (isOpen) {
      this.menu?.querySelector('a, button')?.focus();
    } else if (document.activeElement && this.menu?.contains(document.activeElement)) {
      this.menuToggle?.focus();
    }
  }

  onPointerDown(event) {
    if (event.target.closest?.('.homepage__model-label')) return;

    event.preventDefault();
    this.userPaused = true;
    this.pauseAtCurrentRotation();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startRotation = this.rotation;
    this.startTilt = this.tilt;
    this.orbit.classList.add('is-dragging', 'is-paused');
    this.orbit.setPointerCapture(event.pointerId);
  }

  onPointerMove(event) {
    if (!this.isDragging) return;
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    this.rotation = this.startRotation + deltaX * 0.5;
    this.tilt = Math.max(-48, Math.min(28, this.startTilt - deltaY * 0.32));
    this.updateRotation();
  }

  onPointerUp() {
    this.isDragging = false;
    this.orbit.classList.remove('is-dragging');
  }

  rotateBy(amount) {
    this.userPaused = true;
    this.pauseAtCurrentRotation();
    this.orbit.classList.add('is-paused');
    this.rotation += amount;
    this.updateRotation();
  }

  updateRotation() {
    this.orbit.style.setProperty('--homepage-rotation', `${this.rotation}deg`);
    this.orbit.style.setProperty('--homepage-tilt-x', `${this.tilt}deg`);
  }

  pauseAtCurrentRotation() {
    if (this.orbit.classList.contains('is-paused')) return;

    const transform = window.getComputedStyle(this.orbit).transform;
    if (transform && transform !== 'none') {
      const Matrix = window.DOMMatrixReadOnly || window.WebKitCSSMatrix;
      if (Matrix) {
        const matrix = new Matrix(transform);
        this.rotation = Math.atan2(-matrix.m13, matrix.m11) * (180 / Math.PI);
        this.updateRotation();
      }
    }

    this.orbit.classList.add('is-paused');
  }

  initParticles() {
    if (!this.canvas || this.reducedMotion) return;

    const context = this.canvas.getContext('2d');
    if (!context) return;

    const particleRgb = getComputedStyle(this.section)
      .getPropertyValue('--cinelin-home-ink')
      .trim()
      .replace(/\s+/g, ', ');
    if (!particleRgb) return;

    const particleColor = (alpha) => `rgba(${particleRgb}, ${alpha})`;

    const state = {
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      height: 0,
      points: [],
      pointerX: 0,
      pointerY: 0,
      targetPointerX: 0,
      targetPointerY: 0,
      width: 0,
    };

    const buildPoints = () => {
      const count = Math.min(90, Math.max(44, Math.round(state.width / 18)));
      state.points = Array.from({ length: count }, (_, index) => {
        const band = index / Math.max(count - 1, 1);
        return {
          baseX: 0.1 + band * 0.8,
          baseY: 0.48 + Math.sin(index * 0.72) * 0.14,
          phase: Math.random() * Math.PI * 2,
          radius: 0.7 + Math.random() * 1.6,
          speed: 0.00022 + Math.random() * 0.00034,
        };
      });
    };

    const resize = () => {
      const rect = this.stage.getBoundingClientRect();
      state.width = Math.max(1, Math.round(rect.width));
      state.height = Math.max(1, Math.round(rect.height));
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(state.width * state.dpr);
      this.canvas.height = Math.round(state.height * state.dpr);
      this.canvas.style.width = `${state.width}px`;
      this.canvas.style.height = `${state.height}px`;
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      buildPoints();
    };

    const render = (time) => {
      state.pointerX += (state.targetPointerX - state.pointerX) * 0.06;
      state.pointerY += (state.targetPointerY - state.pointerY) * 0.06;

      context.clearRect(0, 0, state.width, state.height);
      context.fillStyle = particleColor(0.18);

      state.points.forEach((point, index) => {
        const wave = Math.sin(time * point.speed + point.phase);
        const x = point.baseX * state.width + state.pointerX * 22 + Math.cos(time * 0.00018 + point.phase) * 18;
        const y = point.baseY * state.height + state.pointerY * 18 + wave * 34;

        context.globalAlpha = 0.18 + ((wave + 1) * 0.08);
        context.beginPath();
        context.arc(x, y, point.radius, 0, Math.PI * 2);
        context.fill();

        const next = state.points[index + 1];
        if (!next) return;

        const nextX = next.baseX * state.width + state.pointerX * 22 + Math.cos(time * 0.00018 + next.phase) * 18;
        const nextY = next.baseY * state.height + state.pointerY * 18 + Math.sin(time * next.speed + next.phase) * 34;
        const distance = Math.hypot(nextX - x, nextY - y);

        if (distance < 95) {
          context.globalAlpha = 0.06;
          context.strokeStyle = particleColor(1);
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(nextX, nextY);
          context.stroke();
        }
      });

      context.globalAlpha = 1;
      this.particleFrame = window.requestAnimationFrame(render);
    };

    const updatePointer = (event) => {
      const rect = this.stage.getBoundingClientRect();
      state.targetPointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      state.targetPointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resetPointer = () => {
      state.targetPointerX = 0;
      state.targetPointerY = 0;
    };

    resize();
    this.stage.addEventListener('pointermove', updatePointer);
    this.stage.addEventListener('pointerleave', resetPointer);
    window.addEventListener('resize', resize);
    this.particleFrame = window.requestAnimationFrame(render);
  }
}

const initHomepage = (container = document) => {
  container.querySelectorAll('[data-homepage]').forEach((section) => {
    if (!section.homepageOrbit) section.homepageOrbit = new HomepageOrbit(section);
  });
};

initHomepage();

document.addEventListener('shopify:section:load', (event) => {
  initHomepage(event.target);
});
