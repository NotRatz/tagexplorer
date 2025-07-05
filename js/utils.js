/**
 * Utility functions for the Artist Explorer application
 */

/**
 * Shows a toast notification to the user
 * @param {string} message - The message to display
 */
export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-popup";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff69c4;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);

  // Play moan audio if available
  const moanAudio = document.getElementById("moan-audio");
  if (moanAudio) {
    moanAudio.currentTime = 0;
    moanAudio.play().catch(() => {});
  }

  setTimeout(() => toast.remove(), 3000);
}

/**
 * Shows a "no entries" message in the specified element
 * @param {HTMLElement} element - The element to show the message in
 * @param {string} msg - The message to display
 */
export function showNoEntriesMsg(element, msg = "No valid entries") {
  const existing = element.querySelector(".no-entries-msg");
  if (existing) return;

  const noEntriesMsg = document.createElement("div");
  noEntriesMsg.className = "no-entries-msg";
  noEntriesMsg.textContent = msg;
  noEntriesMsg.style.cssText = `
    color: #666;
    font-style: italic;
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 10px 0;
  `;
  element.appendChild(noEntriesMsg);
}

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Checks if a post has all specified tags
 * @param {Object} post - The post object from Danbooru API
 * @param {Array<string>} tags - Array of tags to check for
 * @returns {boolean} True if post has all tags
 */
export function postHasAllTags(post, tags) {
  if (!tags.length) return true;
  // Danbooru returns tags as a space-separated string in tag_string
  const tagArr = (post.tag_string || "").split(" ");
  return tags.every((tag) => tagArr.includes(tag));
}

/**
 * Generates a cache key for localStorage/sessionStorage
 * @param {string} prefix - The prefix for the key
 * @param {string} identifier - The unique identifier
 * @returns {string} The generated cache key
 */
export function generateCacheKey(prefix, identifier) {
  return `${prefix}_${identifier}`;
}