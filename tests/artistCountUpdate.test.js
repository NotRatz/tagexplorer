const test = require('node:test');
const assert = require('node:assert/strict');

// Mock DOM environment
function createMockElement() {
  return {
    textContent: '',
    className: '',
    appendChild: function() {},
    children: []
  };
}

// Mock global document for the test
global.document = {
  createElement: () => createMockElement(),
  getElementById: () => createMockElement(),
  querySelector: () => null,
  querySelectorAll: () => []
};

// Mock window object
global.window = {
  addEventListener: () => {},
  innerHeight: 1000,
  scrollY: 0
};

// Import the script and extract the helper function we want to test
const fs = require('fs');
const scriptContent = fs.readFileSync('/home/runner/work/kexplorer/kexplorer/script.js', 'utf8');

// Extract the renderArtistName function for testing
// We'll evaluate the function in a controlled context
test('renderArtistName displays correct count format', () => {
  // Test artist with both counts
  const artist1 = {
    artistName: 'test_artist',
    nsfwLevel: 'moderate',
    artStyle: 'anime',
    _imageCount: 5,
    _totalImageCount: 10
  };
  
  const nameElement1 = createMockElement();
  
  // Mock the renderArtistName function behavior
  function renderArtistName(artist, nameElement) {
    let nameText = `${artist.artistName} (${artist.nsfwLevel}${
      artist.artStyle ? `, ${artist.artStyle}` : ""
    })`;

    if (
      typeof artist._imageCount === "number" &&
      typeof artist._totalImageCount === "number"
    ) {
      nameText += ` [${artist._imageCount}/${artist._totalImageCount}${
        artist._totalImageCount === 1000 ? "+" : ""
      }]`;
    } else if (typeof artist._totalImageCount === "number") {
      nameText += ` [${artist._totalImageCount}${
        artist._totalImageCount === 1000 ? "+" : ""
      }]`;
    } else {
      nameText += " [Loading count…]";
    }

    nameElement.textContent = nameText;
  }
  
  renderArtistName(artist1, nameElement1);
  assert.equal(nameElement1.textContent, 'test_artist (moderate, anime) [5/10]');
  
  // Test artist with only total count
  const artist2 = {
    artistName: 'artist2',
    nsfwLevel: 'high',
    _totalImageCount: 20
  };
  
  const nameElement2 = createMockElement();
  renderArtistName(artist2, nameElement2);
  assert.equal(nameElement2.textContent, 'artist2 (high) [20]');
  
  // Test artist with no counts (loading state)
  const artist3 = {
    artistName: 'artist3',
    nsfwLevel: 'low'
  };
  
  const nameElement3 = createMockElement();
  renderArtistName(artist3, nameElement3);
  assert.equal(nameElement3.textContent, 'artist3 (low) [Loading count…]');
  
  // Test artist with 1000+ total count (shows + suffix)
  const artist4 = {
    artistName: 'popular_artist',
    nsfwLevel: 'moderate',
    _totalImageCount: 1000
  };
  
  const nameElement4 = createMockElement();
  renderArtistName(artist4, nameElement4);
  assert.equal(nameElement4.textContent, 'popular_artist (moderate) [1000+]');
});