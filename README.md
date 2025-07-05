# Kink Artist Explorer

The **Kink Artist Explorer** is a modern, mobile-first tool for discovering NSFW artists on Danbooru based on various kink tags. The application has been completely refactored for improved maintainability, performance, and user experience.

## ✨ Features

- 🎯 **Dynamic Tag Filtering** - Filter artists by multiple kink tags with real-time updates
- 🖼️ **Live Artist Gallery** - Dynamic loading of artist cards with image fetching from Danbooru
- 🎧 **Audio Player** - Embedded audio player with multiple tracks and controls
- 💬 **Interactive Bubbles** - Animated bubble effects for tag selections
- 🎀 **Copied Artists Sidebar** - Track and manage copied artist tags
- 📱 **Mobile-First Design** - Responsive design optimized for all devices
- ⌨️ **Keyboard Navigation** - Full keyboard support for accessibility
- 🎨 **Modern UI** - Clean, organized interface with smooth animations

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/NotRatz/kexplorer.git
   cd kexplorer
   ```

2. **Install dependencies** (for testing)
   ```bash
   npm install
   ```

3. **Serve the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using any other static file server
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🏗️ Architecture

The application follows modern modular architecture principles:

### 📁 File Structure
```
kexplorer/
├── js/                 # Modular JavaScript
│   ├── main.js        # Application entry point
│   ├── api.js         # API calls and data fetching
│   ├── ui.js          # DOM manipulation and UI updates
│   ├── tags.js        # Tag filtering and effects
│   └── utils.js       # Utility functions
├── tests/             # Test files
├── audio/             # Audio tracks
├── icons/             # Tag icons
├── index.html         # Main HTML file
├── style.css          # Optimized CSS styles
└── *.json             # Data files (artists, tooltips, etc.)
```

### 🔧 JavaScript Modules

- **`main.js`** - Application initialization and coordination
- **`api.js`** - Danbooru API integration with caching
- **`ui.js`** - DOM manipulation, lightbox, and UI components
- **`tags.js`** - Tag filtering, search, and bubble effects
- **`utils.js`** - Shared utility functions

## 🎨 Features Overview

### Tag Filtering
- **Smart Search**: Type to filter available tags
- **Multi-Selection**: Select multiple tags for combined filtering
- **Visual Feedback**: Selected tags show with special styling and animations
- **Clear All**: Quick button to reset all filters

### Artist Gallery
- **Grid Layout**: Responsive grid that adapts to screen size
- **Lazy Loading**: Images load efficiently with pagination
- **Quick Actions**: Copy artist tags, reload images, zoom view
- **Load More**: Infinite scroll with load more functionality

### Audio System
- **Multiple Tracks**: Rotate through different audio files
- **Full Controls**: Play, pause, previous, next, mute
- **Panel Toggle**: Collapsible audio control panel

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Full desktop experience with enhanced features

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The application includes unit tests for core functionality, particularly the sidebar management system.

## 🎯 Performance Features

- **Modular Loading**: JavaScript split into focused modules
- **Image Caching**: Intelligent caching for artist images
- **Debounced Search**: Optimized search input handling
- **Batch API Calls**: Efficient data fetching with rate limiting
- **CSS Optimization**: Organized, efficient styling

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES6+ modules, CSS Grid, Flexbox, Custom Properties

## 🔧 Development

### Code Organization
- **ES6+ Features**: Arrow functions, destructuring, template literals
- **Module System**: Clean separation of concerns
- **Error Handling**: Comprehensive error catching and user feedback
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Styling
- **CSS Custom Properties**: Consistent theming system
- **Flexbox & Grid**: Modern layout techniques
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and effects

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 🏷️ Tags

`kink` `artist-explorer` `danbooru` `javascript` `html5` `css3` `responsive` `mobile-first` `modular-architecture`

---

*Made with 💖 for the community*
