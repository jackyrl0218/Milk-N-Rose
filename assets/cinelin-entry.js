(() => {
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

  class CinelinEntry {
    constructor(root) {
      this.root = root;
      this.frames = Array.from(root.querySelectorAll('[data-entry-frame]'));
      this.mediaTemplates = Array.from(root.querySelectorAll('[data-entry-media-template]'));
      this.form = root.querySelector('[data-entry-form]');
      this.emailInput = root.querySelector('[data-entry-email]');
      this.success = root.querySelector('[data-entry-success]');
      this.skipButton = root.querySelector('[data-entry-skip]');
      this.muteButton = root.querySelector('[data-entry-mute]');
      this.muteLabel = root.querySelector('[data-entry-mute-label]');
      this.cookieName = root.dataset.cookieName || 'cinelin_entry_bypass';
      this.liveDuration = Number(root.dataset.liveDuration) || 900;
      this.gapDuration = Number(root.dataset.gapDuration) || 250;
      this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      this.designMode = Boolean(window.Shopify && window.Shopify.designMode);
      this.timer = null;
      this.currentFrame = null;
      this.currentMediaIndex = -1;
      this.audioContext = null;
      this.audioReady = false;
      this.muted = this.reducedMotion;

      this.handleFirstGesture = this.handleFirstGesture.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSkip = this.handleSkip.bind(this);
      this.handleMute = this.handleMute.bind(this);
      this.boundEvents = [];

      if (!this.designMode && this.hasBypassCookie()) {
        this.root.hidden = true;
        return;
      }

      this.root.classList.toggle('is-reduced-motion', this.reducedMotion);
      this.bind();
      this.updateMuteState();

      if (this.reducedMotion) {
        this.renderReducedMotionFallback();
        return;
      }

      this.start();
    }

    bind() {
      this.on(this.form, 'submit', this.handleSubmit);
      this.on(this.skipButton, 'click', this.handleSkip);
      this.on(this.muteButton, 'click', this.handleMute);
      this.on(document, 'pointerdown', this.handleFirstGesture, { once: true });
      this.on(document, 'keydown', this.handleFirstGesture, { once: true });
    }

    on(target, eventName, handler, options) {
      if (!target) return;
      target.addEventListener(eventName, handler, options);
      this.boundEvents.push([target, eventName, handler, options]);
    }

    start() {
      if (!this.frames.length) return;
      this.activateRandomFrame();
    }

    activateRandomFrame() {
      this.deactivateCurrentFrame();

      const availableFrames = this.frames.filter((frame) => frame !== this.currentFrame);
      const nextFrame = availableFrames[Math.floor(Math.random() * availableFrames.length)] || this.frames[0];
      const availableMediaIndexes = this.mediaTemplates
        .map((_, index) => index)
        .filter((index) => index !== this.currentMediaIndex);
      const nextMediaIndex = availableMediaIndexes.length
        ? availableMediaIndexes[Math.floor(Math.random() * availableMediaIndexes.length)]
        : 0;

      this.currentFrame = nextFrame;
      this.currentMediaIndex = nextMediaIndex;
      this.renderMediaInFrame(nextFrame, nextMediaIndex);

      this.timer = window.setTimeout(() => {
        nextFrame.classList.add('is-live');
        this.playFrameVideo(nextFrame);
        this.playTvClick('on');

        this.timer = window.setTimeout(() => {
          this.deactivateCurrentFrame();
          this.playTvClick('off');
          this.timer = window.setTimeout(() => this.activateRandomFrame(), this.gapDuration);
        }, this.liveDuration);
      }, this.gapDuration);
    }

    deactivateCurrentFrame() {
      if (!this.currentFrame) return;
      this.currentFrame.classList.remove('is-live');
      const video = this.currentFrame.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      this.renderPlaceholder(this.currentFrame);
    }

    renderMediaInFrame(frame, mediaIndex) {
      const template = this.mediaTemplates[mediaIndex];
      if (!template?.content) {
        this.renderPlaceholder(frame);
        return;
      }

      frame.replaceChildren(template.content.cloneNode(true));
    }

    renderPlaceholder(frame) {
      if (!frame) return;
      const placeholder = document.createElement('span');
      placeholder.className = 'cinelin-entry__placeholder';
      frame.replaceChildren(placeholder);
    }

    playFrameVideo(frame) {
      const video = frame.querySelector('video');
      if (!video) return;
      const playRequest = video.play();
      if (playRequest) {
        playRequest.catch(() => {});
      }
    }

    renderReducedMotionFallback() {
      this.frames.slice(0, 3).forEach((frame, index) => {
        this.renderMediaInFrame(frame, index % Math.max(this.mediaTemplates.length, 1));
        frame.classList.add('is-live');
        const video = frame.querySelector('video');
        if (video) {
          video.pause();
          video.removeAttribute('autoplay');
        }
      });
    }

    handleFirstGesture() {
      if (this.reducedMotion || this.muted || this.audioReady) return;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioContext = this.audioContext || new AudioContextClass();
      this.audioContext.resume().then(() => {
        this.audioReady = true;
      }).catch(() => {});
    }

    handleMute() {
      this.muted = !this.muted;
      if (!this.muted) {
        this.handleFirstGesture();
      }
      this.updateMuteState();
    }

    updateMuteState() {
      if (!this.muteButton) return;
      this.muteButton.setAttribute('aria-pressed', String(this.muted));
      if (this.muteLabel) {
        this.muteLabel.textContent = this.muted ? 'Sound off' : 'Sound on';
      }
    }

    playTvClick(type) {
      if (this.muted || this.reducedMotion || !this.audioReady || !this.audioContext) return;

      const duration = type === 'on' ? 0.045 : 0.03;
      const sampleRate = this.audioContext.sampleRate;
      const buffer = this.audioContext.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
      const data = buffer.getChannelData(0);

      for (let index = 0; index < data.length; index += 1) {
        const progress = index / data.length;
        data[index] = (Math.random() * 2 - 1) * (1 - progress);
      }

      const source = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      const gain = this.audioContext.createGain();

      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = type === 'on' ? 1800 : 950;
      gain.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.audioContext.currentTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      source.start();
      source.stop(this.audioContext.currentTime + duration);
    }

    handleSubmit(event) {
      event.preventDefault();

      if (!this.emailInput || !this.emailInput.checkValidity()) {
        this.emailInput?.reportValidity();
        return;
      }

      // TODO: Replace this placeholder with the chosen Klaviyo or Shopify customer API integration.
      console.info('Cinelin entry signup submitted', { email: this.emailInput.value });
      this.setBypassCookie();

      if (this.success) {
        this.success.hidden = false;
        this.success.textContent = 'You are on the list.';
      }

      window.setTimeout(() => this.hide(), 900);
    }

    handleSkip() {
      this.setBypassCookie();
      this.hide();
    }

    setBypassCookie() {
      document.cookie = `${this.cookieName}=1; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    }

    hasBypassCookie() {
      return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${this.cookieName}=`));
    }

    hide() {
      if (this.designMode) return;
      this.root.classList.add('is-hidden');
      this.destroy();
    }

    destroy() {
      window.clearTimeout(this.timer);
      this.deactivateCurrentFrame();
      this.boundEvents.forEach(([target, eventName, handler, options]) => {
        target.removeEventListener(eventName, handler, options);
      });
      this.boundEvents = [];
    }
  }

  const initEntry = (root) => {
    if (!root) return;
    root.cinelinEntry?.destroy();
    root.cinelinEntry = new CinelinEntry(root);
  };

  const initAll = (scope = document) => {
    scope.querySelectorAll('[data-cinelin-entry]').forEach(initEntry);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-cinelin-entry]').forEach((root) => root.cinelinEntry?.destroy());
  });
})();
