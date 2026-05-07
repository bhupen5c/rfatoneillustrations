/* ============================================================
   R.Fatone Illustrations — Interactive script
   ✦ Custom cursor      ✦ Scroll progress
   ✦ Reveal on scroll   ✦ 3D tilt cards
   ✦ Parallax           ✦ Magnetic buttons
   ✦ Mobile menu        ✦ Smooth nav
   ✦ Marquee gallery
   ============================================================ */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(hover:hover)').matches && !reduceMotion) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    const animate = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, .work, .help__item, .shop__card, .series__item, [data-tilt], .gallery__item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- Scroll progress ---------- */
  const progress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Nav scrolled state ---------- */
  const nav = document.getElementById('nav');
  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = entry.target.style.getPropertyValue('--i');
          const delay = i ? parseInt(i, 10) * 80 : 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 3D tilt on works ---------- */
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const media = card.querySelector('.work__media');
      if (!media) return;
      const max = 8; // degrees
      let rect;

      const updateRect = () => { rect = media.getBoundingClientRect(); };
      updateRect();
      window.addEventListener('resize', updateRect, { passive: true });

      card.addEventListener('mouseenter', updateRect);
      card.addEventListener('mousemove', e => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;
        media.style.transform = `perspective(1200px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        media.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.btn, .cart-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Parallax (hero art, book) ---------- */
  if (!reduceMotion) {
    const parallaxItems = [
      { el: document.querySelector('.leaf--1'), speed: -0.15 },
      { el: document.querySelector('.leaf--2'), speed: -0.25 },
      { el: document.querySelector('.leaf--3'), speed: -0.10 },
      { el: document.querySelector('.orb--1'),  speed:  0.08 },
      { el: document.querySelector('.orb--2'),  speed:  0.12 },
    ].filter(i => i.el);

    let ticking = false;
    const onParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxItems.forEach(({ el, speed }) => {
            el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ---------- Hero title scroll-out ---------- */
  if (!reduceMotion) {
    const heroTitle = document.querySelector('.hero__title');
    const heroLede = document.querySelector('.hero__lede');
    if (heroTitle) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          const k = y / window.innerHeight;
          heroTitle.style.transform = `translateY(${y * 0.25}px)`;
          heroTitle.style.opacity = String(1 - k * 1.4);
          if (heroLede) {
            heroLede.style.transform = `translateY(${y * 0.18}px)`;
            heroLede.style.opacity = String(1 - k * 1.6);
          }
        }
      }, { passive: true });
    }
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) close();
      else {
        toggle.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ---------- Smooth in-page nav (account for fixed header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  /* ---------- Gallery: drag to scroll & marquee pause on hover ---------- */
  const gallery = document.querySelector('.gallery__track');
  if (gallery) {
    let isDown = false, startX, scrollLeft;
    const wrap = gallery.parentElement;
    wrap.addEventListener('mousedown', e => {
      isDown = true;
      wrap.classList.add('is-dragging');
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
    });
    wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('is-dragging'); });
    wrap.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('is-dragging'); });
    wrap.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrap.offsetLeft;
      const walk = (x - startX) * 1.6;
      wrap.scrollLeft = scrollLeft - walk;
    });
  }

  /* ---------- Hover-triggered video play ---------- */
  document.querySelectorAll('video[data-hover]').forEach(v => {
    const card = v.closest('.feature, .gallery__item');
    if (!card) return;
    card.addEventListener('mouseenter', () => v.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
  });

})();
