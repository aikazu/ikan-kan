# Ikan-kan Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2023-05-22

### Changed
- Removed tank full warning visual indicators
- Tank upgrades now display regardless of tank capacity status
- Improved user experience by making upgrade options more consistently visible
- Simplified GameControls component logic

## [0.3.2] - 2023-05-21

### Changed
- Further refactored gameSlice.ts into domain-specific reducer files:
  - breedingReducers.ts: Contains feeding and breeding-related logic
  - purchaseReducers.ts: Contains functionality for buying upgrades, tanks and locations
  - navigationReducers.ts: Contains location switching and save/load functionality
  - gameLoopReducers.ts: Contains game tick and fish simulation logic
- Improved project structure with a dedicated reducers directory
- Enhanced code organization by grouping related functionality
- Ensured all files adhere to the 300-line limit for better maintainability

### Fixed
- Updated import paths in all components to reference models from gameModels.ts instead of gameSlice.ts
- Fixed type errors resulting from the refactoring of the Redux store
- Properly re-exported the BreedingEvent interface to maintain API compatibility

## [0.3.1] - 2023-05-20

### Changed
- Improved code organization by splitting large components into smaller modules
- Refactored Aquarium.tsx to extract SingleLocationView component
- Separated TankRenderer.tsx into core renderer and decoration utilities
- Split Aquarium.css into core styles and responsive styles
- Exported and standardized interface types for better type safety
- Improved CSS organization with better section comments and structure
- Refactored gameSlice.ts into multiple files for better maintainability:
  - gameModels.ts: Contains all interfaces and type definitions
  - gameUtils.ts: Contains utility functions for fish creation and movement
  - initialData.ts: Contains initial state data for tanks, locations, and upgrades
  - gameSlice.ts: Now focused only on Redux slice and reducers
- All files now follow the 300-line code limit for better readability

## [0.3.0] - 2023-05-17

### Added
- Full-screen responsive design with immersive gameplay
- In-tank indicators for Fish Points, fish count, and tank type
- Collapsible side panel for upgrades that can be toggled with a button
- Semi-transparent overlays with backdrop filters for modern UI look
- Enhanced visual feedback with floating indicators and animations
- Responsive layout that adapts to different screen sizes

### Changed
- Removed top header for a cleaner, more immersive experience
- Integrated all UI elements directly into the game view
- Improved mobile experience with bottom-sliding panel on smaller screens
- Enhanced overall visual styling with better contrasts and animations

## [0.2.0] - 2023-05-16

### Added
- Complete fish breeding system with visual effects
- Breeding animation with heart particles
- New "Breeding Supplements" upgrade to increase breeding chance
- Visual feedback for breeding events
- Enhanced fish animations with realistic swimming patterns
- Glowing effects for breeding fish
- Growing animation for newly spawned fish
- Improved tank visualizations with decorations
- Added gravel, plants, and castle decorations to larger tanks
- Ambient bubble animations in the aquarium
- Tank capacity management system with visual warnings
- Animated capacity alert message when tank is full
- Visual indicators for breeding and new fish

### Changed
- Improved breeding mechanics to show parent fish
- Enhanced fish appearance with better proportions and colors
- Optimized game loop for smoother animations
- Refined fish movement patterns for more natural behavior
- Updated UI to provide better feedback on tank capacity status
- Improved CSS styling for visual elements

## [0.1.0] - 2023-05-15

### Added
- Initial project setup and structure
- Core game management system with Redux
- Basic UI components (Aquarium, ControlPanel, StatsPanel)
- Fish entity system with basic properties
- Game loop with tick mechanics
- Click-based feeding system
- Auto-feeder upgrade
- Tank upgrade system with capacity limits
- Fish point (FP) economy system
- Local storage save/load functionality
- Canvas-based fish tank visualization
- Management documents (README, PLANNING, TASK, CHANGELOG)
- Basic project configuration

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A 