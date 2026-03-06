/**
 * 医療系SNS集客サービス LP - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Scroll Animations (IntersectionObserver) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
      observer.observe(el);
    });
  } else {
    // If reduced motion, make all elements visible immediately
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
      el.classList.add('visible');
    });
  }

  // ===== Header Scroll Effect =====
  const header = document.getElementById('header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ===== Mobile Navigation =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      // Prevent body scroll when nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq__item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          const activeAnswer = activeItem.querySelector('.faq__answer');
          activeAnswer.style.maxHeight = null;
          activeItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== Sticky CTA =====
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    const heroSection = document.querySelector('.hero');
    const ctaSection = document.getElementById('contact');

    window.addEventListener('scroll', () => {
      if (!heroSection || !ctaSection) return;
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const ctaTop = ctaSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (heroBottom < 0 && ctaTop > windowHeight) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ===== Form Validation =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let isValid = true;

      // Reset errors
      contactForm.querySelectorAll('.form__error').forEach(el => {
        el.style.display = 'none';
      });
      contactForm.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });

      // Validate clinic name
      const clinicName = document.getElementById('clinic-name');
      if (!clinicName.value.trim()) {
        showError(clinicName, 'clinic-name-error');
        isValid = false;
      }

      // Validate name
      const contactName = document.getElementById('contact-name');
      if (!contactName.value.trim()) {
        showError(contactName, 'contact-name-error');
        isValid = false;
      }

      // Validate email
      const contactEmail = document.getElementById('contact-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.value.trim())) {
        showError(contactEmail, 'contact-email-error');
        isValid = false;
      }

      // Validate type
      const contactType = document.getElementById('contact-type');
      if (!contactType.value) {
        showError(contactType, 'contact-type-error');
        isValid = false;
      }

      // Validate privacy checkbox
      const privacyCheck = document.getElementById('privacy-check');
      if (!privacyCheck.checked) {
        isValid = false;
        privacyCheck.closest('.form__privacy').style.outline = '2px solid var(--color-cta)';
        privacyCheck.closest('.form__privacy').style.outlineOffset = '4px';
        privacyCheck.closest('.form__privacy').style.borderRadius = '4px';
      }

      if (!isValid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = contactForm.querySelector('.error, .form__privacy[style]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Remove error on input
    contactForm.querySelectorAll('.form__input, .form__select, .form__textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.form__error');
        if (errorEl) errorEl.style.display = 'none';
      });
    });

    const privacyCheck = document.getElementById('privacy-check');
    if (privacyCheck) {
      privacyCheck.addEventListener('change', () => {
        const wrapper = privacyCheck.closest('.form__privacy');
        if (privacyCheck.checked) {
          wrapper.style.outline = '';
          wrapper.style.outlineOffset = '';
          wrapper.style.borderRadius = '';
        }
      });
    }
  }

  function showError(input, errorId) {
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.style.display = 'block';
  }

  // ===== Counter Animation for Result Numbers =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.result-card__number').forEach(el => {
    counterObserver.observe(el);
  });

  document.querySelectorAll('.hero__stat-number').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(element) {
    const text = element.textContent;
    // Extract the number from the text
    const match = text.match(/([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const isDecimal = text.includes('.');
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        element.innerHTML = current.toFixed(1) + suffix;
      } else {
        element.innerHTML = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.innerHTML = text;
      }
    }

    requestAnimationFrame(update);
  }
});
