document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  /* ==========================================================================
     2. MOBILE MENU
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Animate hamburger bars to 'X'
    const bars = menuToggle.querySelectorAll('.bar');
    if (menuToggle.classList.contains('active')) {
      bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    const bars = menuToggle.querySelectorAll('.bar');
    bars[0].style.transform = 'none';
    bars[1].style.opacity = '1';
    bars[2].style.transform = 'none';
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      
      // Update active state in nav
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ==========================================================================
     3. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  /* ==========================================================================
     4. GALLERY FILTER & LIGHTBOX
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeGalleryItems = Array.from(galleryItems);
  let currentImageIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons and add to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter gallery elements
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Smooth fade in
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });

      // Update active items list for lightbox navigation
      activeGalleryItems = Array.from(galleryItems).filter(item => {
        return filterValue === 'all' || item.getAttribute('data-category') === filterValue;
      });
    });
  });

  // Lightbox functions
  const openLightbox = (index) => {
    currentImageIndex = index;
    const item = activeGalleryItems[currentImageIndex];
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-item-title').textContent;
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable page scroll
  };

  const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % activeGalleryItems.length;
    openLightbox(currentImageIndex);
  };

  const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    openLightbox(currentImageIndex);
  };

  // Add click listener to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = activeGalleryItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  // Lightbox navigation events
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Close lightbox on click outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* ==========================================================================
     5. TESTIMONIALS SLIDER
     ========================================================================== */
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let testimonialInterval;

  const updateSlider = (index) => {
    currentSlide = index;
    const amountToMove = -index * 100;
    track.style.transform = `translateX(${amountToMove}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
      resetSliderTimer();
    });
  });

  const startSliderTimer = () => {
    testimonialInterval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % dots.length;
      updateSlider(nextSlide);
    }, 6000); // 6 seconds slide interval
  };

  const resetSliderTimer = () => {
    clearInterval(testimonialInterval);
    startSliderTimer();
  };

  startSliderTimer();

  /* ==========================================================================
     6. CONTACT FORM VALIDATION & WHATSAPP REDIRECT
     ========================================================================== */
  const form = document.getElementById('contact-form');
  const formName = document.getElementById('form-name');
  const formPhone = document.getElementById('form-phone');
  const formService = document.getElementById('form-service');
  const formMessage = document.getElementById('form-message');
  const successCard = document.getElementById('success-card');
  const submitBtn = document.getElementById('submit-btn');

  // Input phone mask: (XX) XXXXX-XXXX
  formPhone.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    
    let formatted = '';
    if (val.length > 0) {
      formatted = '(' + val.substring(0, 2);
    }
    if (val.length > 2) {
      formatted += ') ' + val.substring(2, 7);
    }
    if (val.length > 7) {
      formatted += '-' + val.substring(7, 11);
    }
    e.target.value = formatted;
  });

  // Validation function
  const validateField = (input) => {
    const parent = input.parentElement;
    let isValid = true;

    if (input.required && (!input.value || input.value.trim() === '')) {
      isValid = false;
    }

    if (input === formPhone) {
      const phoneDigits = input.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        isValid = false;
      }
    }

    if (!isValid) {
      parent.classList.add('invalid');
    } else {
      parent.classList.remove('invalid');
    }

    return isValid;
  };

  // Real-time validation
  [formName, formPhone, formService, formMessage].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  formService.addEventListener('change', () => {
    if (formService.value) {
      formService.parentElement.classList.remove('invalid');
    }
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    [formName, formPhone, formService, formMessage].forEach(input => {
      const isValid = validateField(input);
      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) return;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Gather data
    const name = formName.value.trim();
    const company = document.getElementById('form-company').value.trim() || 'Não informada';
    const phone = formPhone.value.trim();
    const serviceName = formService.options[formService.selectedIndex].text;
    const message = formMessage.value.trim();

    // Mock API processing delay
    setTimeout(() => {
      // Hide loading
      submitBtn.classList.remove('loading');
      
      // Hide form, show success card
      form.style.display = 'none';
      successCard.classList.add('active');

      // Create pre-filled WhatsApp link
      const whatsappNumber = '5511999999999'; // Base phone number
      const introMessage = `Olá Ryan Empilhadeiras! Enviei um contato pelo site e gostaria de um orçamento:\n\n`;
      const dataMessage = `*Nome:* ${name}\n*Empresa:* ${company}\n*Celular:* ${phone}\n*Serviço:* ${serviceName}\n*Mensagem/Equipamento:* ${message}`;
      
      const fullMessage = encodeURIComponent(introMessage + dataMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${fullMessage}`;

      // Redirect after a brief moment so user sees success checkmark
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    }, 1500);
  });
});
