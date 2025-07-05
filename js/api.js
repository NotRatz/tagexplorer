/**
 * API and data fetching functions for Danbooru and other services
 */

// Global flag to track Danbooru availability
export let isDanbooruUnavailable = false;

/**
 * Sets the Danbooru availability flag
 * @param {boolean} unavailable - Whether Danbooru is unavailable
 */
export function setDanbooruUnavailable(unavailable) {
  isDanbooruUnavailable = unavailable;
  if (typeof window !== 'undefined') {
    window._danbooruUnavailable = unavailable;
  }
}

/**
 * Fetches data from multiple JSON endpoints in parallel
 * @returns {Promise<Object>} Object containing all loaded data
 */
export async function loadApplicationData() {
  try {
    const [artists, tips, general, specific] = await Promise.all([
      fetch("artists.json").then((r) => r.json()),
      fetch("tag-tooltips.json").then((r) => r.json()),
      fetch("taunts.json").then((r) => r.json()),
      fetch("tag-taunts.json").then((r) => r.json()),
    ]);

    return { artists, tips, general, specific };
  } catch (err) {
    console.error("Failed to load required data files:", err);
    throw err;
  }
}

/**
 * Fetches posts from Danbooru API with caching
 * @param {string} tagQuery - The tag query string
 * @param {string} cacheKey - Cache key for sessionStorage
 * @returns {Promise<Array>} Array of posts
 */
export async function fetchDanbooruPosts(tagQuery, cacheKey) {
  if (isDanbooruUnavailable) {
    throw new Error('Danbooru is unavailable');
  }

  // Check cache first
  const cached = getSessionCache(cacheKey);
  if (cached && Array.isArray(cached)) {
    return cached;
  }

  const response = await fetch(
    `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(
      tagQuery
    )}+order:score&limit=1000`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format');
  }

  // Cache the result
  setSessionCache(cacheKey, data);
  return data;
}

/**
 * Fetches posts with count for an artist
 * @param {string} artistName - The artist name
 * @param {Array<string>} activeTags - Currently active tags
 * @returns {Promise<Object>} Object with total count and filtered count
 */
export async function fetchArtistCounts(artistName, activeTags = []) {
  const results = { totalCount: 0, filteredCount: 0 };

  try {
    // Fetch total count for the artist
    const totalResponse = await fetch(
      `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(
        artistName
      )}&limit=1000`
    );
    
    if (totalResponse.ok) {
      const totalPosts = await totalResponse.json();
      const uniqueIds = new Set(
        Array.isArray(totalPosts) ? totalPosts.map((post) => post.id) : []
      );
      results.totalCount = uniqueIds.size;
    }

    // Fetch filtered count if there are active tags
    if (activeTags.length > 0) {
      const tagQuery = `${artistName} ${activeTags.join(' ')}`;
      const filteredResponse = await fetch(
        `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(
          tagQuery
        )}&limit=1000`
      );
      
      if (filteredResponse.ok) {
        const filteredPosts = await filteredResponse.json();
        const uniqueFilteredIds = new Set(
          Array.isArray(filteredPosts) ? filteredPosts.map((post) => post.id) : []
        );
        results.filteredCount = uniqueFilteredIds.size;
      }
    } else {
      results.filteredCount = results.totalCount;
    }
  } catch (error) {
    console.error(`Error fetching counts for ${artistName}:`, error);
  }

  return results;
}

/**
 * Fetches data in batches with delays to avoid rate limiting
 * @param {Array} items - Items to process
 * @param {number} batchSize - Size of each batch
 * @param {Function} fetchFn - Function to apply to each item
 * @param {number} delayMs - Delay between batches in milliseconds
 * @returns {Promise<Array>} Array of results
 */
export async function fetchInBatches(items, batchSize, fetchFn, delayMs = 600) {
  let results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchFn));
    results = results.concat(batchResults);
    
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

/**
 * Gets data from sessionStorage cache
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null
 */
function getSessionCache(key) {
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

/**
 * Sets data in sessionStorage cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
function setSessionCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}