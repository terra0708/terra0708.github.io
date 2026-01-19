window.particlesConfig = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#d4af37"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 4,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#d4af37",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 100,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
};

window.initParticles = (container = document) => {
  // Retry mechanism to ensure particles.js is loaded
  let retryCount = 0;
  const maxRetries = 20; // Increased retries for slower connections
  
  const tryInit = () => {
    // Check if particles.js is loaded
    if (typeof particlesJS === 'undefined') {
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(tryInit, 150); // Slightly longer delay
        return;
      } else {
        console.warn('particles.js library not loaded after maximum retries');
        return;
      }
    }

    // Find particles container - try in provided container first, then fallback to document
    let particlesContainer = container.querySelector('#particles-js');
    if (!particlesContainer) {
      particlesContainer = document.querySelector('main[data-barba-namespace] #particles-js');
    }
    if (!particlesContainer) {
      particlesContainer = document.querySelector('#particles-js');
    }

    if (particlesContainer) {
      // Ensure the ID is unique if multiple exist during transition
      document.querySelectorAll('#particles-js').forEach(el => {
        if (el !== particlesContainer) el.id = 'particles-js-old';
      });

      // Destroy existing instance if any
      if (particlesContainer.pJSDom && particlesContainer.pJSDom[0] && particlesContainer.pJSDom[0].pJS) {
        try {
          particlesContainer.pJSDom[0].pJS.fn.vendors.destroypJS();
        } catch (e) {
          // Ignore destroy errors
        }
        particlesContainer.pJSDom = [];
      }

      // Clear any existing canvas
      const existingCanvas = particlesContainer.querySelector('canvas');
      if (existingCanvas) {
        existingCanvas.remove();
      }

      // Initialize particles
      try {
        particlesJS("particles-js", window.particlesConfig);
      } catch (error) {
        console.error('Error initializing particles:', error);
        // Retry once more after a delay if initialization fails
        if (retryCount < maxRetries) {
          setTimeout(() => {
            try {
              particlesJS("particles-js", window.particlesConfig);
            } catch (retryError) {
              console.error('Error retrying particles initialization:', retryError);
            }
          }, 200);
        }
      }
    }
  };

  tryInit();
};

// Wait for particles.js script to load
(function() {
  const particlesScript = document.querySelector('script[src*="particles.js"]');
  if (particlesScript) {
    particlesScript.addEventListener('load', () => {
      // Script loaded, particles should be available now
      if (typeof window.initParticles === 'function' && document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => window.initParticles(), 100);
        });
      }
    });
  }
})();
