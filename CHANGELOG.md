# Changelog

All notable changes to the Ikan Kan: Mancing Mania project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0]

### Added

- Git repository configuration with GitHub integration
- Proper .gitignore file for Node.js project
- Complete documentation tracking in version control

### Changed

- Project structure organization with documentation in root directory
- Fixed embedded repository issue in ikan-kan directory

## [0.2.0] - 2023-08-20

### Added
- Custom water-themed background with animated bubbles
- Splash loading screen with animations and transitions
- Custom MUI theme with water-inspired color palette
- Wave text and glow animations for UI elements
- Fish click animations in CSS
- Custom scrollbar styling
- Complete documentation set (README, PLANNING, TASK, CHANGELOG)
- Relocated Info button from title bar to bottom right corner of game area for better UI consistency
- Enhanced ResourceDisplay component to accept custom styling via sx prop
- Improved visual layout with matched styling between Info and Upgrade buttons
- Semi-transparent background wrapper for ResourceDisplay component for better visibility
- Support for transparent background in ResourceDisplay while maintaining text readability
- Simplified title bar with centered game title

### Changed
- Updated application font to Nunito for better readability
- Redesigned upgrade card UI for visual consistency
- Enhanced button styling with proper hover effects
- Improved color scheme for better theme consistency
- Updated app manifest with proper metadata and theme colors

### Fixed
- Resolved button styling inconsistencies in upgrade cards
- Fixed "Ready to upgrade" text positioning
- Corrected theme implementation to avoid duplication

## [0.1.0] - 2023-08-15

### Added
- Core game mechanics (clicking, upgrades, auto-production)
- Basic UI components for game interaction
- Initial upgrade system with multiple categories
- Redux state management for game data
- Offline progress calculation
- Local storage for game saves
- Initial deployment to GitHub Pages
- Initial game implementation with core mechanics
- Basic UI with GameScreen, FishingArea, and ResourceDisplay components
- Upgrade system with purchasable items
- Redux state management for game data
- LocalStorage persistence for game progress
- Responsive layout design
- Core game loop with auto-saving
- Click mechanics with visual feedback
- Base fish collection data structure
- Initial set of upgrades across categories
- Pond environment implementation

### Changed
- Improved click response time
- Enhanced visual design of resource counters

### Fixed
- Resource calculation during offline periods
- Layout issues on mobile devices
