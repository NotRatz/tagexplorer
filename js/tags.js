/**
 * Tag-related functionality including filtering and bubble effects
 */

// Tag icons mapping
const tagIcons = {
  'bimbofication': 'icons/bimbofication.png',
  'chastity_cage': 'icons/chastity_cage.png',
  'feminization': 'icons/feminization.png',
  'gagged': 'icons/gagged.png',
  'mind_break': 'icons/mind_break.png',
  'netorare': 'icons/netorare.png'
};

/**
 * Spawns a floating bubble effect for a tag
 * @param {string} tag - The tag to create a bubble for
 */
export function spawnBubble(tag) {
  const bubblesContainer = document.getElementById("jrpg-bubbles");
  if (!bubblesContainer) return;

  const bubble = document.createElement("div");
  bubble.className = "jrpg-bubble";
  bubble.textContent = tag.replace(/_/g, " ");
  
  // Random position and animation
  const startX = Math.random() * (window.innerWidth - 200);
  const startY = window.innerHeight + 50;
  const endY = -100;
  const drift = (Math.random() - 0.5) * 100;

  bubble.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    background: linear-gradient(45deg, #ff69c4, #ff1493);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    z-index: 1000;
    pointer-events: none;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(255, 20, 147, 0.3);
    animation: bubbleFloat 3s ease-out forwards;
  `;

  // Add animation keyframes if not already present
  if (!document.querySelector('#bubble-animations')) {
    const style = document.createElement('style');
    style.id = 'bubble-animations';
    style.textContent = `
      @keyframes bubbleFloat {
        0% {
          transform: translateY(0) translateX(0) scale(0.8);
          opacity: 0;
        }
        20% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          transform: translateY(-${window.innerHeight + 150}px) translateX(${drift}px) scale(0.6);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  bubblesContainer.appendChild(bubble);

  // Remove bubble after animation
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }, 3000);
}

/**
 * Renders tag buttons with filtering and icons
 * @param {Set} activeTags - Currently active tags
 * @param {Array<string>} allTags - All available tags
 * @param {string} searchFilter - Current search filter
 * @param {Object} tagTooltips - Tag tooltip mapping
 * @param {Function} onTagClick - Callback for tag clicks
 */
export function renderTagButtons(activeTags, allTags, searchFilter, tagTooltips, onTagClick) {
  const tagButtonsContainer = document.getElementById("tag-buttons");
  const clearTagsBtn = document.getElementById("clear-tags");
  
  if (!tagButtonsContainer) return;

  tagButtonsContainer.innerHTML = "";

  // Filter tags based on search
  const tagsToShow = searchFilter
    ? allTags.filter((tag) =>
        tag.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : allTags;

  if (tagsToShow.length === 0) {
    const emptyMsg = document.createElement("span");
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.opacity = "0.7";
    emptyMsg.textContent = "No tags found.";
    tagButtonsContainer.appendChild(emptyMsg);
    if (clearTagsBtn) {
      clearTagsBtn.style.display = activeTags.size ? "" : "none";
    }
    return;
  }

  tagsToShow.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag-button";
    btn.type = "button";
    
    // Add icon if available
    if (tagIcons[tag]) {
      const icon = document.createElement("img");
      icon.src = tagIcons[tag];
      icon.style.height = "16px";
      icon.style.marginRight = "4px";
      icon.alt = "";
      btn.appendChild(icon);
    }
    
    btn.appendChild(document.createTextNode(tag.replaceAll("_", " ")));
    btn.dataset.tag = tag;
    
    if (tagTooltips[tag]) {
      btn.title = tagTooltips[tag];
    }
    
    if (activeTags.has(tag)) {
      btn.classList.add("active");
    }
    
    btn.onclick = () => onTagClick(tag);
    tagButtonsContainer.appendChild(btn);
  });

  if (clearTagsBtn) {
    clearTagsBtn.style.display = activeTags.size ? "" : "none";
  }
}

/**
 * Sets up tag search functionality
 * @param {Function} onSearch - Callback for search changes
 * @returns {Function} Cleanup function
 */
export function setupTagSearch(onSearch) {
  const tagSearchInput = document.getElementById("tag-search");
  if (!tagSearchInput) return () => {};

  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onSearch(e.target.value);
    }, 150);
  };

  tagSearchInput.addEventListener("input", handleSearch);
  
  return () => {
    tagSearchInput.removeEventListener("input", handleSearch);
    clearTimeout(searchTimeout);
  };
}

/**
 * Sets up clear tags button
 * @param {Function} onClear - Callback for clearing tags
 * @returns {Function} Cleanup function
 */
export function setupClearTags(onClear) {
  const clearTagsBtn = document.getElementById("clear-tags");
  if (!clearTagsBtn) return () => {};

  const handleClear = () => onClear();
  clearTagsBtn.addEventListener("click", handleClear);
  
  return () => {
    clearTagsBtn.removeEventListener("click", handleClear);
  };
}

/**
 * Default kink tags for the application
 */
export const kinkTags = [
  "anal_object_insertion",
  "bimbofication", 
  "chastity_cage",
  "cum_in_mouth",
  "dildo_riding",
  "dominatrix",
  "femdom",
  "feminization",
  "flat_chastity_cage",
  "foot_worship",
  "forced_feminization",
  "gagged",
  "gokkun",
  "hand_milking",
  "hogtie",
  "huge_dildo",
  "humiliation",
  "knotting",
  "lactation",
  "large_insertion",
  "milking_machine",
  "mind_break",
  "netorare",
  "netorase",
  "object_insertion",
  "object_insertion_from_behind",
  "orgasm_denial",
  "penis_milking",
  "pouring_from_condom",
  "prostate_milking",
  "restraints",
  "sex_machine",
  "shibari",
  "small_penis_humiliation",
  "sockjob",
  "spreader_bar",
  "tentacle_pit",
  "toe_sucking",
  "trap",
  "used_condom"
];