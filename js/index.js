document.addEventListener('DOMContentLoaded', function () {
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = dropdownMenu.classList.toggle('show');
      dropdownBtn.setAttribute('aria-expanded', String(isExpanded));
    });

    document.addEventListener('click', function (e) {
      if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const contactForm = document.querySelector('.php-email-form');
  const formFeedback = document.querySelector('[data-form-feedback]');

  if (contactForm instanceof HTMLFormElement && formFeedback) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const recipient = contactForm.dataset.recipient;
      if (!recipient) {
        formFeedback.textContent = 'The contact form email address is not configured.';
        return;
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const emailSubject = `Website contact: ${subject}`;
      const emailBody = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');

      formFeedback.textContent =
        'Your email app should open with this message. Review it and press Send to deliver.';
      window.location.href =
        `mailto:${encodeURIComponent(recipient)}` +
        `?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;
    });
  }

  const portfolioFilters = document.querySelector('.portfolio-filters');
  const portfolioItems = document.querySelectorAll('.portfolio-img-item[data-category]');

  if (portfolioFilters && portfolioItems.length > 0) {
    portfolioFilters.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement) || !target.hasAttribute('data-filter')) {
        return;
      }

      const selectedFilter = target.dataset.filter;

      portfolioFilters.querySelectorAll('button[data-filter]').forEach(function (button) {
        const isActive = button === target;
        button.classList.toggle('filter-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      portfolioItems.forEach(function (item) {
        item.hidden = selectedFilter !== '*' && item.dataset.category !== selectedFilter;
      });
    });
  }

  const factCounters = document.querySelectorAll('[data-count]');

  if (factCounters.length > 0) {
    const numberFormatter = new Intl.NumberFormat();
    const setFinalCounterValues = function () {
      factCounters.forEach(function (counter) {
        const target = Number(counter.dataset.count);
        if (Number.isSafeInteger(target) && target >= 0) {
          counter.textContent = numberFormatter.format(target);
        }
      });
    };

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setFinalCounterValues();
    } else {
      const animateCounter = function (counter) {
        const target = Number(counter.dataset.count);
        if (!Number.isSafeInteger(target) || target < 0) {
          return;
        }

        const duration = 1400;
        const startTime = performance.now();
        const updateCounter = function (currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          counter.textContent = numberFormatter.format(Math.round(target * easedProgress));

          if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
          }
        };

        window.requestAnimationFrame(updateCounter);
      };

      const counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );

      factCounters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  const testimonialCarousel = document.querySelector('.testimonial-carousel');

  if (testimonialCarousel) {
    const slides = Array.from(testimonialCarousel.querySelectorAll('.testimonial-slide'));
    const indicators = Array.from(
      testimonialCarousel.querySelectorAll('.side-bar-page button')
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeSlide = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    let rotationTimer;

    if (slides.length > 0 && indicators.length === slides.length) {
      if (activeSlide < 0) {
        activeSlide = 0;
      }

      const showSlide = function (index) {
        activeSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          const isActive = slideIndex === activeSlide;
          slide.hidden = !isActive;
          slide.classList.toggle('is-active', isActive);
        });

        indicators.forEach(function (indicator, indicatorIndex) {
          const isActive = indicatorIndex === activeSlide;
          indicator.classList.toggle('is-active', isActive);
          indicator.setAttribute('aria-pressed', String(isActive));
        });
      };

      const stopRotation = function () {
        window.clearInterval(rotationTimer);
        rotationTimer = undefined;
      };

      const startRotation = function () {
        stopRotation();
        if (!reducedMotion.matches && !document.hidden) {
          rotationTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
          }, 5000);
        }
      };

      indicators.forEach(function (indicator, index) {
        indicator.addEventListener('click', function () {
          showSlide(index);
          startRotation();
        });
      });

      testimonialCarousel.addEventListener('mouseenter', stopRotation);
      testimonialCarousel.addEventListener('mouseleave', startRotation);
      testimonialCarousel.addEventListener('focusin', stopRotation);
      testimonialCarousel.addEventListener('focusout', function (event) {
        if (!testimonialCarousel.contains(event.relatedTarget)) {
          startRotation();
        }
      });
      document.addEventListener('visibilitychange', startRotation);
      reducedMotion.addEventListener('change', startRotation);

      showSlide(activeSlide);
      startRotation();
    }
  }
});
