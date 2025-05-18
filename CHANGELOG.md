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

## [0.2.0]

### Changed

- Relocated Info button from title bar to bottom right corner of game area for better UI consistency
- Enhanced ResourceDisplay component to accept custom styling via sx prop
- Improved visual layout with matched styling between Info and Upgrade buttons

### Added

- Semi-transparent background wrapper for ResourceDisplay component for better visibility
- Support for transparent background in ResourceDisplay while maintaining text readability
- Simplified title bar with centered game title

## [0.1.0]

### Added

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
