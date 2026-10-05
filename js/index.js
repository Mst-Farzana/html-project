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
});
