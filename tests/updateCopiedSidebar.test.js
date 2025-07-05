const test = require('node:test');
const assert = require('node:assert/strict');

const sidebarModule = require('../script-old.js');
const { updateCopiedSidebar, _setAllArtists, _setCopiedArtists, _setCopiedSidebar } = sidebarModule;

function createStubDocument() {
  return {
    createElement(tag) {
      const el = {
        tagName: tag.toUpperCase(),
        children: [],
        style: {},
        appendChild(child) {
          this.children.push(child);
        },
      };
      Object.defineProperty(el, 'src', {
        get() { return this._src; },
        set(v) { this._src = v; },
      });
      return el;
    },
    createTextNode(text) {
      return { nodeType: 3, textContent: text };
    },
  };
}

test('updateCopiedSidebar creates images with correct src', () => {
  const document = createStubDocument();
  global.document = document;
  const sidebar = {
    children: [],
    appendChild(child) { this.children.push(child); },
    set innerHTML(_) { this.children = []; },
  };

  _setCopiedSidebar(sidebar);
  _setAllArtists([
    { artistName: 'foo_bar', thumbnailUrl: 'img/foo.jpg' },
    { artistName: 'baz', thumbnailUrl: 'img/baz.jpg' }
  ]);
  _setCopiedArtists(new Set(['foo_bar', 'baz']));

  updateCopiedSidebar();

  // Should have 3 children: 1 close button + 2 artists
  assert.equal(sidebar.children.length, 3);
  // First child is close button, artists start from index 1
  assert.equal(sidebar.children[1].children[0].src, 'img/foo.jpg');
  assert.equal(sidebar.children[2].children[0].src, 'img/baz.jpg');
});
