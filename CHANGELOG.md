# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project setup with React, TypeScript, Redux, and Vite
- Basic game loop implementation
- Visual fish representation with individual fish icons filling the tank
- Click-to-feed mechanic with visual feedback (points indicator)
- Fish entity system with basic properties
- Resource panel showing game stats
- Upgrade panel for tank and feeder enhancements
- First tier of upgrades (tank sizes and feeders)
- Local storage save/load system with offline progression
- Responsive layout for mobile and desktop
- Lucky Bubbles system with random bonus events (Feeding Frenzy, Breeding Boom, etc.)
- Visual notifications for active bonuses and timers
- Full-screen responsive layout for all device sizes
- Detailed welcome back modal showing offline earnings and progress
- Enhanced offline progression with fish breeding during absence
- Comprehensive visual feedback system with animated indicators for:
  - Points earned from clicking
  - New fish being added to the tank
  - Purchasing upgrades and feeders
  - Multiple animations for bonus events like Feeding Frenzy
- Advanced fish entity system with different properties:
  - Various fish types with unique stats and appearances
  - Fish rarity system (Common, Uncommon, Rare, Epic, Legendary)
  - Special abilities that enhance gameplay mechanics
  - Breeding rates that vary by fish type
  - Points per second generation based on fish type and level
- Fish collection UI showing:
  - All discovered and undiscovered fish types
  - Detailed fish stats and abilities
  - Rarity indicators and counts of owned fish
- Enhanced breeding system with discovery chance for new fish types
- Fish special abilities that affect gameplay:
  - Breeding boost abilities
  - Lucky bubble chance increasers
  - Point multipliers for clicks
  - Feeder efficiency enhancers
  - And more...
- Comprehensive statistics tracking system with:
  - Detailed gameplay metrics (clicks, fish bred, points earned)
  - Fish collection statistics by type and rarity
  - Time tracking (play time, active bubble time)
  - Visual statistics interface with formatted numbers
  - Offline progress tracking for statistics
- New auto-feeder speed upgrade system:
  - Five upgrade levels for each auto-feeder
  - Exponential speed increases (3x, 9x, 27x, 81x)
  - Visual indicator of current speed level
  - "MAX" badge for fully upgraded feeders
- Centered "Click to feed!" indicator that disappears after first interaction
- More compact and streamlined UI design with better spacing
- Fixed TypeScript type errors in auto-feeder speed level handling
- Removed unused imports to improve code quality
- Enhanced project configuration with comprehensive .gitignore file

### Changed
- Ultra-compressed game progression to fit within 2-hour max timeframe
- Accelerated initial experience with first automation within 30 seconds
- Reduced first automation cost from 15 FP to 10 FP
- Lowered early game upgrade costs across the board
- Replaced animated fish with individual fish icons that fill the tank based on count
- Simplified user interface with cleaner visual representation
- Improved offline progression calculations with capped timeframes
- Enhanced feedback for user actions with diverse animation types
- Updated game state model to support fish with unique properties and abilities
- Improved passive income calculation based on individual fish properties
- Enhanced localStorage system with support for statistics tracking
- Completely reworked the feeder upgrade system:
  - Unified FP gain from clicking and automation (2 FP per click/feed)
  - Removed different feeder types in favor of speed upgrades
  - All feeders now start at the same base rate with upgradeable speed
  - Added clear progression path for upgrading feeders
- Repositioned UI buttons for better layout and to avoid overlap
- Moved game controls to top of screen for better visibility
- Made buttons more consistent in style and appearance
- Improved fish count display by moving it from bottom-right tank indicator to Fish Collection button
- Enhanced tooltips and hover states for better user feedback
- Repositioned event notifications to middle right to prevent overlap with UI elements
- Adjusted tank capacities to follow a steeper progression: 5 → 30 → 150 → 600 → 1800 → 3200

### Removed
- Canvas-based fish animation system
- PixiJS dependency to reduce bundle size
- Bubble animation effects
- Complex fish rendering code for better performance
- Simple click indicators in favor of comprehensive animation system
- Efficiency multipliers on different feeder types
- Distinct feeder tiers with unique rates (replaced with speed upgrades)
- Redundant fish capacity indicator from tank display

## [0.1.0] - 2024-05-02

### Added
- Initial project structure
- Core game concept documentation
- Planning and task organization 