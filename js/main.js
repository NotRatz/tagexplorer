/**
 * Main application entry point
 * Coordinates all modules and maintains existing functionality
 */

import { showToast, showNoEntriesMsg, debounce, postHasAllTags, generateCacheKey } from './utils.js';
import { loadApplicationData, fetchDanbooruPosts, fetchArtistCounts, fetchInBatches, setDanbooruUnavailable } from './api.js';
import { addLipstickKiss, setupScrollToggle, setupBackToTop, setupLightbox, updatePageTitle, toggleElementVisibility } from './ui.js';
import { spawnBubble, renderTagButtons, setupTagSearch, setupClearTags, kinkTags } from './tags.js';

// Application state
let allArtists = [];
let activeTags = new Set();
let tagTooltips = {};
let tagTaunts = {};
let taunts = [];
let searchFilter = "";
let artistNameFilter = "";
let currentPage = 0;
const itemsPerPage = 25;

// Audio state
let currentTrack = 0;
const audioFiles = [
  "audio/1.mp3", "audio/2.mp3", "audio/3.mp3",
  "audio/4.mp3", "audio/5.mp3", "audio/6.mp3"
];

// Copied artists functionality
let copiedArtists = new Set();
let copiedSidebar = null;

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);

/**
 * Main initialization function
 */
async function initializeApp() {
  try {
    // Set up basic UI elements
    addLipstickKiss();
    setupBackToTop();
    
    // Initialize DOM references
    copiedSidebar = document.getElementById("copied-sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    setupScrollToggle(sidebarToggle);
    
    // Set up lightbox
    const lightbox = setupLightbox();
    
    // Set up audio
    initializeAudio();
    
    // Set up sidebar toggle
    setupSidebarToggle();
    
    // Set up tag functionality
    setupTagFiltering();
    
    // Set up artist name filtering
    setupArtistNameFiltering();
    
    // Load application data
    await loadData();
    
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    showToast("Failed to load application data");
  }
}

/**
 * Loads all application data
 */
async function loadData() {
  try {
    const { artists, tips, general, specific } = await loadApplicationData();
    
    allArtists = artists;
    tagTooltips = tips;
    taunts = general;
    tagTaunts = specific;
    
    renderTagButtons(activeTags, kinkTags, searchFilter, tagTooltips, handleTagClick);
    await filterArtists();
    setRandomBackground();
    setInterval(setRandomBackground, 15000);
    
  } catch (error) {
    console.error("Failed to load data:", error);
    showToast("Failed to load required data files");
  }
}

/**
 * Sets up tag filtering functionality
 */
function setupTagFiltering() {
  // Set up tag search
  const cleanupTagSearch = setupTagSearch((searchValue) => {
    searchFilter = searchValue;
    renderTagButtons(activeTags, kinkTags, searchFilter, tagTooltips, handleTagClick);
    filterArtists(true);
  });

  // Set up clear tags button
  const cleanupClearTags = setupClearTags(() => {
    activeTags.clear();
    renderTagButtons(activeTags, kinkTags, searchFilter, tagTooltips, handleTagClick);
    filterArtists(true);
    setRandomBackground();
  });
}

/**
 * Sets up artist name filtering
 */
function setupArtistNameFiltering() {
  const artistNameFilterInput = document.getElementById("artist-name-filter");
  if (!artistNameFilterInput) return;

  artistNameFilterInput.addEventListener("input", (e) => {
    artistNameFilter = e.target.value.trim().toLowerCase();
    filterArtists(true);
  });
}

/**
 * Handles tag click events
 */
function handleTagClick(tag) {
  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
    spawnBubble(tag);
  }
  
  renderTagButtons(activeTags, kinkTags, searchFilter, tagTooltips, handleTagClick);
  filterArtists();
  setRandomBackground();
  updatePageTitle(activeTags, artistNameFilter);
}

/**
 * Filters and displays artists based on active filters
 */
async function filterArtists(reset = false) {
  if (reset) currentPage = 0;

  const gallery = document.getElementById("artist-gallery");
  if (!gallery) return;

  // Show loading state
  if (reset) {
    gallery.innerHTML = '<div class="loading">Loading artists...</div>';
  }

  try {
    // Filter artists
    let filtered = allArtists.filter(artist => {
      const matchesName = !artistNameFilter || 
        artist.artistName.toLowerCase().includes(artistNameFilter);
      
      const matchesTags = activeTags.size === 0 || 
        Array.from(activeTags).every(tag => artist.tags?.includes(tag));
      
      return matchesName && matchesTags;
    });

    if (filtered.length === 0) {
      gallery.innerHTML = '<div class="no-results">No artists found matching your criteria.</div>';
      return;
    }

    // Paginate results
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageArtists = filtered.slice(startIndex, endIndex);

    // Render artists
    if (reset) {
      gallery.innerHTML = '';
    }

    await renderArtists(pageArtists);

    // Add load more button if needed
    if (endIndex < filtered.length) {
      addLoadMoreButton(filtered.length - endIndex);
    }

  } catch (error) {
    console.error("Error filtering artists:", error);
    if (reset) {
      gallery.innerHTML = '<div class="error">Error loading artists. Please try again.</div>';
    }
  }
}

/**
 * Renders artist cards
 */
async function renderArtists(artists) {
  const gallery = document.getElementById("artist-gallery");
  if (!gallery) return;

  for (const artist of artists) {
    const artistCard = createArtistCard(artist);
    gallery.appendChild(artistCard);
  }
}

/**
 * Creates an artist card element
 */
function createArtistCard(artist) {
  const card = document.createElement("div");
  card.className = "artist-card";
  card.innerHTML = `
    <div class="artist-header">
      <span class="artist-favorite">💗</span>
      <button class="artist-zoom-btn" data-artist="${artist.artistName}">Show with selected tag</button>
    </div>
    <div class="artist-image-container">
      <img class="artist-image" data-artist="${artist.artistName}" alt="${artist.artistName}" loading="lazy">
    </div>
    <div class="artist-info">
      <div class="artist-name-container">
        <span class="artist-name">${artist.artistName.replace(/_/g, ' ')} (${artist.category || 'Unknown'}, ${artist.type || 'Unknown'})</span>
        <button class="copy-button" data-artist="${artist.artistName}" title="Copy artist tag">📋</button>
        <button class="reload-button" data-artist="${artist.artistName}" title="Reload image">⟳</button>
      </div>
      <div class="artist-tags">${(artist.tags || []).join(', ')}</div>
    </div>
  `;

  // Set up image
  const img = card.querySelector('.artist-image');
  setBestImage(artist, img);

  // Set up event listeners
  setupArtistCardEvents(card, artist);

  return card;
}

/**
 * Sets up event listeners for artist card
 */
function setupArtistCardEvents(card, artist) {
  // Copy button
  const copyBtn = card.querySelector('.copy-button');
  copyBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleArtistCopy(artist);
  });

  // Reload button
  const reloadBtn = card.querySelector('.reload-button');
  reloadBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = card.querySelector('.artist-image');
    setBestImage(artist, img, true);
  });

  // Zoom button
  const zoomBtn = card.querySelector('.artist-zoom-btn');
  zoomBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openArtistZoom(artist);
  });
}

/**
 * Handles artist copy functionality
 */
function handleArtistCopy(artist) {
  const artistTag = artist.artistName.replace(/_/g, " ");
  const copyText = `artist:${artistTag}`;
  
  navigator.clipboard.writeText(copyText)
    .then(() => {
      showToast(`Copied: ${copyText}`);
      if (!copiedArtists.has(artist.artistName)) {
        copiedArtists.add(artist.artistName);
        updateCopiedSidebar();
      }
    })
    .catch(() => {
      showToast("Failed to copy!");
    });
}

/**
 * Updates the copied artists sidebar
 */
function updateCopiedSidebar() {
  if (!copiedSidebar) return;
  copiedSidebar.innerHTML = "";

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "copied-sidebar-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.title = "Close";
  closeBtn.onclick = () => copiedSidebar.classList.remove("visible");
  copiedSidebar.appendChild(closeBtn);

  // Add copied artists
  copiedArtists.forEach((name) => {
    const artist = allArtists.find((a) => a.artistName === name);
    const div = document.createElement("div");
    div.className = "copied-artist";
    div.style.cssText = "display: flex; align-items: center; cursor: pointer;";
    
    const tooltip = artist?.tooltip || artist?.artistName.replace(/_/g, " ");
    
    if (artist?.thumbnailUrl) {
      const img = document.createElement("img");
      img.src = artist.thumbnailUrl;
      img.style.cssText = "width: 32px; height: 32px; border-radius: 8px; margin-right: 8px;";
      img.title = tooltip;
      img.onclick = (e) => {
        e.stopPropagation();
        openArtistZoom(artist);
      };
      div.appendChild(img);
    }
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name.replace(/_/g, " ");
    nameSpan.title = tooltip;
    nameSpan.onclick = () => openArtistZoom(artist);
    div.appendChild(nameSpan);
    
    copiedSidebar.appendChild(div);
  });
}

/**
 * Opens artist zoom/detail view
 */
function openArtistZoom(artist) {
  // This would open a detailed view - placeholder for now
  console.log("Opening zoom for artist:", artist.artistName);
  showToast(`Viewing ${artist.artistName.replace(/_/g, ' ')}`);
}

/**
 * Sets the best image for an artist
 */
function setBestImage(artist, img, forceReload = false) {
  if (!img || !artist) return;

  const cacheKey = `artist_img_${artist.artistName}`;
  
  // Try cached URL first (unless forcing reload)
  if (!forceReload) {
    const cachedUrl = localStorage.getItem(cacheKey);
    if (cachedUrl) {
      const testImg = new Image();
      testImg.onload = () => {
        img.src = cachedUrl;
        // Remove any existing no-entries message
        const noEntriesMsg = img.nextSibling;
        if (noEntriesMsg?.classList?.contains("no-entries-msg")) {
          noEntriesMsg.remove();
        }
      };
      testImg.onerror = () => {
        localStorage.removeItem(cacheKey);
        fetchAndSetImage();
      };
      testImg.src = cachedUrl;
      return;
    }
  }

  fetchAndSetImage();

  async function fetchAndSetImage() {
    try {
      const tagQuery = artist.artistName;
      const posts = await fetchDanbooruPosts(tagQuery, `api_${artist.artistName}`);
      
      if (!posts.length) {
        showNoEntriesMsg(img.parentElement);
        return;
      }

      // Find best image
      const bestPost = posts.find(post => 
        post.file_url && 
        (post.file_ext === 'jpg' || post.file_ext === 'png') &&
        post.rating !== 'e'
      ) || posts[0];

      if (bestPost?.file_url) {
        img.src = bestPost.file_url;
        localStorage.setItem(cacheKey, bestPost.file_url);
      } else {
        showNoEntriesMsg(img.parentElement);
      }
      
    } catch (error) {
      console.error(`Error fetching image for ${artist.artistName}:`, error);
      showNoEntriesMsg(img.parentElement, "Failed to load image");
    }
  }
}

/**
 * Sets up sidebar toggle functionality
 */
function setupSidebarToggle() {
  const sidebarToggles = document.querySelectorAll(".sidebar-toggle");
  if (sidebarToggles.length && copiedSidebar) {
    sidebarToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        copiedSidebar.classList.toggle("visible");
      });
    });
  }
}

/**
 * Initializes audio functionality
 */
function initializeAudio() {
  const hypnoAudio = document.getElementById("hypno-audio");
  const audioPanel = document.getElementById("audio-panel");
  const audioToggle = document.getElementById("audio-panel-toggle");
  const audioPlayBtn = document.getElementById("audio-toggle");
  const audioPrevBtn = document.getElementById("audio-prev");
  const audioNextBtn = document.getElementById("audio-next");
  const trackNameSpan = document.getElementById("audio-track-name");

  if (!hypnoAudio) return;

  // Load first track
  loadTrack(currentTrack);

  // Audio controls
  audioPlayBtn?.addEventListener("click", () => {
    if (hypnoAudio.paused) {
      hypnoAudio.play();
    } else {
      hypnoAudio.pause();
    }
  });

  audioPrevBtn?.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
    loadTrack(currentTrack);
  });

  audioNextBtn?.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % audioFiles.length;
    loadTrack(currentTrack);
  });

  // Auto-advance to next track
  hypnoAudio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % audioFiles.length;
    loadTrack(currentTrack);
  });

  // Panel toggle
  audioToggle?.addEventListener("click", () => {
    audioPanel?.classList.toggle("hidden");
  });

  function loadTrack(index) {
    if (hypnoAudio && audioFiles[index]) {
      hypnoAudio.src = audioFiles[index];
      if (trackNameSpan) {
        trackNameSpan.textContent = `Track ${index + 1}`;
      }
    }
  }
}

/**
 * Sets a random background image
 */
function setRandomBackground() {
  const backgroundBlur = document.getElementById("background-blur");
  if (!backgroundBlur || !allArtists.length) return;

  const randomArtist = allArtists[Math.floor(Math.random() * allArtists.length)];
  if (randomArtist.thumbnailUrl) {
    backgroundBlur.style.backgroundImage = `url(${randomArtist.thumbnailUrl})`;
  }
}

/**
 * Adds load more button
 */
function addLoadMoreButton(remainingCount) {
  const gallery = document.getElementById("artist-gallery");
  if (!gallery) return;

  const existingBtn = gallery.querySelector('.load-more-btn');
  if (existingBtn) existingBtn.remove();

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className = 'load-more-btn';
  loadMoreBtn.textContent = `Load More (${remainingCount} remaining)`;
  loadMoreBtn.onclick = () => {
    currentPage++;
    filterArtists(false);
  };
  
  gallery.appendChild(loadMoreBtn);
}

// Export functions for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateCopiedSidebar,
    _setAllArtists: (val) => { allArtists = val; },
    _setCopiedArtists: (val) => { copiedArtists = val; },
    _setCopiedSidebar: (val) => { copiedSidebar = val; },
  };
}