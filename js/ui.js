/**
 * UI and DOM manipulation functions
 */

import { showToast, showNoEntriesMsg } from './utils.js';

/**
 * Creates and sets up the lipstick kiss watermark
 */
export function addLipstickKiss() {
  if (!document.querySelector(".lipstick-kiss")) {
    const kiss = document.createElement("div");
    kiss.className = "lipstick-kiss";
    document.body.appendChild(kiss);
  }
}

/**
 * Sets up scroll-based sidebar toggle visibility
 * @param {HTMLElement} sidebarToggle - The sidebar toggle button
 */
export function setupScrollToggle(sidebarToggle) {
  if (!sidebarToggle) return;
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      sidebarToggle.classList.add("pinned-visible");
    } else {
      sidebarToggle.classList.remove("pinned-visible");
    }
  });
}

/**
 * Sets up back to top button
 */
export function setupBackToTop() {
  let backToTopBtn = document.getElementById('back-to-top');
  
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = 'Back to top';
    document.body.appendChild(backToTopBtn);
  }

  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Sets up lightbox functionality
 */
export function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox?.querySelector(".close");
  const prevBtn = document.getElementById("prev-img");
  const nextBtn = document.getElementById("next-img");

  if (!lightbox || !lightboxImg) return;

  let currentImages = [];
  let currentIndex = 0;

  // Close lightbox
  const closeLightbox = () => {
    lightbox.style.display = "none";
    document.body.style.overflow = "";
  };

  // Show image at index
  const showImage = (index) => {
    if (index < 0 || index >= currentImages.length) return;
    
    currentIndex = index;
    const imgData = currentImages[index];
    lightboxImg.src = imgData.url;
    
    if (lightboxCaption) {
      lightboxCaption.textContent = imgData.caption || '';
    }
    
    // Update navigation button states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === currentImages.length - 1;
  };

  // Event listeners
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < currentImages.length - 1) showImage(currentIndex + 1);
    });
  }

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "none") return;
    
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        if (currentIndex > 0) showImage(currentIndex - 1);
        break;
      case "ArrowRight":
        if (currentIndex < currentImages.length - 1) showImage(currentIndex + 1);
        break;
    }
  });

  // Public API
  return {
    open: (images, startIndex = 0) => {
      currentImages = images;
      showImage(startIndex);
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    },
    close: closeLightbox
  };
}

/**
 * Creates a loading spinner element
 * @param {string} text - Optional loading text
 * @returns {HTMLElement} The spinner element
 */
export function createLoadingSpinner(text = "Loading...") {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.innerHTML = `
    <div class="spinner"></div>
    <span>${text}</span>
  `;
  return spinner;
}

/**
 * Updates the page title based on current filters
 * @param {Set} activeTags - Currently active tags
 * @param {string} artistFilter - Current artist name filter
 */
export function updatePageTitle(activeTags, artistFilter) {
  let title = "Artist Explorer";
  
  if (activeTags.size > 0 || artistFilter) {
    const parts = [];
    if (activeTags.size > 0) {
      parts.push(`Tags: ${Array.from(activeTags).join(', ')}`);
    }
    if (artistFilter) {
      parts.push(`Artist: ${artistFilter}`);
    }
    title += ` - ${parts.join(' | ')}`;
  }
  
  document.title = title;
}

/**
 * Shows/hides elements with smooth transitions
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} show - Whether to show or hide
 */
export function toggleElementVisibility(element, show) {
  if (!element) return;
  
  if (show) {
    element.style.display = '';
    element.style.opacity = '0';
    requestAnimationFrame(() => {
      element.style.transition = 'opacity 0.3s ease';
      element.style.opacity = '1';
    });
  } else {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.display = 'none';
    }, 300);
  }
}