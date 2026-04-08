/**
 * CryptoLab — Main Application Controller
 * Handles navigation, section switching, and module loading.
 */

(function () {
  'use strict';

  // ── DOM Elements ──────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const navItems = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('.section');

  // ── Track loaded modules ──────────────────────────────────────────
  const loadedModules = {};

  // ── Module files mapping ──────────────────────────────────────────
  const moduleFiles = {
    classical: 'js/classical.js',
    numbertheory: 'js/numberTheory.js',
    des: 'js/des.js',
    aes: 'js/aes.js',
    publickey: 'js/publicKey.js',
  };

  // ── Navigate to a section ─────────────────────────────────────────
  function navigateTo(sectionId) {
    // Update sidebar active state
    document.querySelectorAll('.sidebar .nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.nav === sectionId);
    });

    // Switch visible section
    sections.forEach((sec) => {
      const id = sec.id.replace('section-', '');
      sec.classList.toggle('active', id === sectionId);
    });

    // Force re-trigger animation
    const activeSection = document.getElementById('section-' + sectionId);
    if (activeSection) {
      activeSection.style.animation = 'none';
      // Trigger reflow
      void activeSection.offsetWidth;
      activeSection.style.animation = '';
    }

    // Load module script if not yet loaded
    if (moduleFiles[sectionId] && !loadedModules[sectionId]) {
      loadModule(sectionId);
    }

    // Close mobile sidebar
    sidebar.classList.remove('open');
    overlay.classList.remove('active');

    // Update URL hash
    window.location.hash = sectionId === 'home' ? '' : sectionId;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Dynamically load a module script ──────────────────────────────
  function loadModule(moduleId) {
    loadedModules[moduleId] = true; // Mark as loading
    const script = document.createElement('script');
    script.src = moduleFiles[moduleId];
    script.onerror = () => {
      const container = document.getElementById(moduleId + '-content');
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding:60px 0; color: var(--text-muted);">
            <div style="font-size:48px; margin-bottom:16px;">🚧</div>
            <h3 style="color:var(--text-primary); margin-bottom:8px;">Module Under Construction</h3>
            <p>This module is being built. Check back soon!</p>
          </div>
        `;
      }
    };
    document.body.appendChild(script);
  }

  // ── Click handlers ────────────────────────────────────────────────
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.dataset.nav;
      if (target) navigateTo(target);
    });
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // ── Handle initial hash route ─────────────────────────────────────
  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    const validSections = ['home', 'classical', 'numbertheory', 'des', 'aes', 'publickey'];
    if (hash && validSections.includes(hash)) {
      navigateTo(hash);
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute();

  // ── Keyboard shortcuts ────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.altKey) {
      const keyMap = {
        '1': 'home',
        '2': 'classical',
        '3': 'numbertheory',
        '4': 'des',
        '5': 'aes',
        '6': 'publickey',
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        navigateTo(keyMap[e.key]);
      }
    }
  });
})();
