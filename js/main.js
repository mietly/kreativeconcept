// ============================================================
//  KREATIVCONCEPT BY LENA – MAIN JS
// ============================================================

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
      // Trigger hero animations
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('loaded');
      animateHero();
    }, 800);
  }
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverTargets = document.querySelectorAll('a, button, .gallery__item, .service-card, .rental-card, .checkbox-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ===== HEADER =====
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', y > 60);
  }
  lastScroll = y;
});

// ===== MOBILE MENU =====
const toggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== HERO ANIMATIONS =====
function animateHero() {
  const elements = document.querySelectorAll('.hero__tag, .hero__title, .hero__desc, .hero__actions, .hero__scroll');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)`;
    }, 300 + i * 150);
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
  revealObserver.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

const counterSection = document.querySelector('.intro__stats');
if (counterSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(counterSection);
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
  const parallaxBgs = document.querySelectorAll('.parallax-text__bg img, .hero__bg img');
  parallaxBgs.forEach(bg => {
    const rect = bg.closest('section, .hero')?.getBoundingClientRect();
    if (rect) {
      const speed = 0.3;
      const y = rect.top * speed;
      bg.style.transform = `translateY(${y}px) scale(1.05)`;
    }
  });
});

// ===== LIGHTBOX =====
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox__img');
const galleryImgs = document.querySelectorAll('.gallery__item img');
let currentIdx = 0;

function openLightbox(i) {
  if (!lightbox) return;
  currentIdx = i;
  lightboxImg.src = galleryImgs[currentIdx].src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  currentIdx = (currentIdx + dir + galleryImgs.length) % galleryImgs.length;
  lightboxImg.src = galleryImgs[currentIdx].src;
}

galleryImgs.forEach((img, i) => {
  img.closest('.gallery__item').addEventListener('click', () => openLightbox(i));
});

document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => navLightbox(-1));
document.querySelector('.lightbox__nav--next')?.addEventListener('click', () => navLightbox(1));
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

// ===== GALLERY FILTERS =====
document.querySelectorAll('.gallery__filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery__filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery__item').forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

// ===== FORMS =====
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const successEl = form.parentElement.querySelector('.form__success');
    if (successEl) {
      form.style.display = 'none';
      successEl.classList.add('active');
    }
  });
});

// ===== ACTIVE NAV =====
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== SMOOTH MAGNETIC BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== RENTAL FORM - QUANTITY CONTROLS =====
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('.qty-input');
    let val = parseInt(input.value) || 0;
    if (btn.classList.contains('qty-btn--minus')) {
      val = Math.max(0, val - 1);
    } else {
      val = Math.min(99, val + 1);
    }
    input.value = val;
  });
});

// ===== 3D TILT EFFECT ON CARDS =====
document.querySelectorAll('.rental-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== SMOOTH TEXT REVEAL ON HERO =====
document.querySelectorAll('.hero__title').forEach(title => {
  const text = title.innerHTML;
  title.style.opacity = '0';
});

// ===== CHECKBOX VISUAL FEEDBACK =====
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const item = cb.closest('.checkbox-item');
    if (cb.checked) {
      item.style.borderColor = '#a79688';
      item.style.background = '#faf8f6';
    } else {
      item.style.borderColor = '';
      item.style.background = '';
    }
  });
});
