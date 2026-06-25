(() => {
  const hasWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (error) {
      return false;
    }
  };

  const initProduct = (scope = document) => {
    scope.querySelectorAll('[data-cinelin-model-stage]').forEach((stage) => {
      if (!hasWebGL()) {
        stage.classList.add('is-webgl-unavailable');
        return;
      }

      const modelViewer = stage.querySelector('model-viewer');
      const deferredPoster = stage.querySelector('.deferred-media__poster');

      if (modelViewer) {
        modelViewer.addEventListener('load', () => stage.classList.add('is-loaded'), { once: true });
        modelViewer.addEventListener('error', () => stage.classList.add('is-webgl-unavailable'), { once: true });
      }

      if (deferredPoster) {
        deferredPoster.addEventListener('click', () => {
          window.setTimeout(() => stage.classList.add('is-loaded'), 400);
        }, { once: true });
      }

      window.setTimeout(() => stage.classList.add('is-loaded'), 1800);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initProduct());
  } else {
    initProduct();
  }

  document.addEventListener('shopify:section:load', (event) => initProduct(event.target));
})();
