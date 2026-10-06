/**
 * CRYSTAL INSTITUTE OF COMPETITIVE STUDIES (CICS) - HUBBALLI
 * Production Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCourseFilters();
  initFormHandling();
  initGalleryLightbox();
  initURLParams();
});

/**
 * Navigation Bar & Mobile Drawer Controls
 */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleDrawer(show) {
    if (!mobileDrawer) return;
    if (show) {
      mobileDrawer.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileDrawer.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => toggleDrawer(true));
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) toggleDrawer(false);
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
    }
  });

  // Highlight Active Link based on Path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a, nav.fixed a');
  
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0].split('/').pop();

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      if (link.classList.contains('text-on-surface-variant')) {
        link.classList.remove('text-on-surface-variant');
        link.classList.add('text-secondary', 'font-semibold');
      }
    }
  });
}

/**
 * Dynamic Course Filter Tabs
 */
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('bg-navy-deep', 'text-pure-white');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });

      btn.classList.add('bg-navy-deep', 'text-pure-white');
      btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      const filter = btn.getAttribute('data-filter');

      courseCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.classList.add('flex');
        } else {
          card.classList.add('hidden');
          card.classList.remove('flex');
        }
      });
    });
  });
}

/**
 * Enquiry & Callback Form Handling
 */
function initFormHandling() {
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const formErrorMessage = document.getElementById('formErrorMessage');

  if (!consultationForm) return;

  consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Elements
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const targetExam = document.getElementById('targetExam');
    const submitBtn = consultationForm.querySelector('button[type="submit"]');

    // Reset alert states
    if (formErrorMessage) formErrorMessage.classList.add('hidden');

    // Basic Validation
    if (!fullName || !fullName.value.trim()) {
      showFormError('Please enter the student\'s full name.');
      return;
    }

    if (!phoneNumber || !phoneNumber.value.trim() || phoneNumber.value.trim().length < 8) {
      showFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!targetExam || !targetExam.value) {
      showFormError('Please select a target examination program.');
      return;
    }

    // Loading UI state
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span> Processing Request...
      `;
    }

    // Simulate submission delay for clean UX feedback
    setTimeout(() => {
      consultationForm.classList.add('hidden');
      if (formSuccessMessage) {
        formSuccessMessage.classList.remove('hidden');
        
        // Personalize success alert
        const nameDisplay = document.getElementById('submittedStudentName');
        const examDisplay = document.getElementById('submittedExamName');
        if (nameDisplay) nameDisplay.textContent = fullName.value.trim();
        if (examDisplay && targetExam.options[targetExam.selectedIndex]) {
          examDisplay.textContent = targetExam.options[targetExam.selectedIndex].text;
        }
      }
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }, 900);
  });
}

function showFormError(msg) {
  const formErrorMessage = document.getElementById('formErrorMessage');
  if (formErrorMessage) {
    formErrorMessage.textContent = msg;
    formErrorMessage.classList.remove('hidden');
  } else {
    alert(msg);
  }
}

/**
 * Pre-fill URL query parameters (e.g. ?course=banking)
 */
function initURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');

  if (courseParam) {
    const targetExamSelect = document.getElementById('targetExam');
    if (targetExamSelect) {
      for (let i = 0; i < targetExamSelect.options.length; i++) {
        if (targetExamSelect.options[i].value === courseParam) {
          targetExamSelect.selectedIndex = i;
          break;
        }
      }
    }

    // Also trigger filter if on courses page
    const filterBtn = document.querySelector(`.course-filter-btn[data-filter="${courseParam}"]`);
    if (filterBtn) {
      filterBtn.click();
    }
  }
}

/**
 * Gallery Lightbox Modal with Zoom, Prev/Next, Keyboard & Touch Swipe
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  if (!lightboxModal) return;

  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxZoomInBtn = document.getElementById('lightboxZoomIn');
  const lightboxZoomOutBtn = document.getElementById('lightboxZoomOut');
  const lightboxZoomResetBtn = document.getElementById('lightboxZoomReset');

  let currentIndex = 0;
  let currentZoom = 1;
  const itemsList = Array.from(galleryItems);

  function openLightbox(index) {
    if (index < 0 || index >= itemsList.length) return;
    currentIndex = index;
    currentZoom = 1;
    updateZoom();

    const item = itemsList[currentIndex];
    const imgUrl = item.getAttribute('data-src') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || 'Crystal Institute Campus';
    const category = item.getAttribute('data-category') || 'Campus Infrastructure';

    if (lightboxImg) lightboxImg.src = imgUrl;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category.toUpperCase();

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  function showNext() {
    openLightbox((currentIndex + 1) % itemsList.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + itemsList.length) % itemsList.length);
  }

  function updateZoom() {
    if (lightboxImg) {
      lightboxImg.style.transform = `scale(${currentZoom})`;
    }
  }

  itemsList.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNext);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrev);

  if (lightboxZoomInBtn) {
    lightboxZoomInBtn.addEventListener('click', () => {
      if (currentZoom < 2.5) {
        currentZoom += 0.25;
        updateZoom();
      }
    });
  }

  if (lightboxZoomOutBtn) {
    lightboxZoomOutBtn.addEventListener('click', () => {
      if (currentZoom > 0.75) {
        currentZoom -= 0.25;
        updateZoom();
      }
    });
  }

  if (lightboxZoomResetBtn) {
    lightboxZoomResetBtn.addEventListener('click', () => {
      currentZoom = 1;
      updateZoom();
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) showNext();
    if (touchEndX > touchStartX + 50) showPrev();
  }, { passive: true });
}
