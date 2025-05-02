# Fish Empire Public Assets

This directory contains the static assets for the Fish Empire game.

## Contents

- `index.html` - The main HTML file that loads the application
- `manifest.json` - Web app manifest for Progressive Web App functionality
- `favicon.ico` - Website favicon
- `logo192.png` - Small app icon for browsers and PWA
- `logo512.png` - Large app icon for PWA and app stores

## Notes for Developers

- When adding new static assets that need to be loaded by the application, place them in this directory
- For images and other assets that are imported by React components, place them in the appropriate `src` subdirectories instead
- The `%PUBLIC_URL%` placeholder in `index.html` will be replaced with the correct path during the build process 