# Ikan-kan Project Planning

## Project Vision and Goals
Ikan-kan is an incremental/idle game that aims to create an addictive gameplay loop around building and managing an ever-expanding aquatic ecosystem. Starting with a single fish in a bowl, players will expand to global oceans and even extraterrestrial waters.

Key goals:
- Create a satisfying progression curve with balanced timings and resource costs
- Provide multiple interlocking systems that create meaningful choices
- Implement engaging visual feedback to reward player actions
- Develop a sense of accomplishment through collection and expansion
- Balance active gameplay with idle progression
- Maintain a clean, intuitive UI that works across device sizes
- Ensure clear onboarding with contextual help that disappears after use

## Architectural Overview

### Core Components
1. **Game Engine**
   - Core game loop and update cycle
   - Time management (real-time tracking, offline progression)
   - Save/load system with data persistence

2. **Resource Management System**
   - Fish Points (FP) accumulation and spending
   - Secondary currencies (Tickets, Research Points, etc.)
   - Resource production and consumption rates

3. **Entity System**
   - Fish entities with attributes (species, age, productivity)
   - Tank/environment entities with capacity and bonuses
   - Location management for multi-site gameplay

4. **Upgrade System**
   - Progressive upgrades with scaling costs
   - Unlockable features tied to progression milestones
   - Prestige mechanics for long-term engagement

5. **UI Components**
   - Main game display with visual fish representation
   - Control panels for actions and upgrades positioned for optimal flow
   - Statistics and achievement tracking
   - Centralized "Click to feed" tutorial that teaches core gameplay
   - Consistent button styling and positioning across the interface
   - Adaptive layout that reorganizes based on screen size

6. **Event System**
   - Random events (Lucky Bubbles)
   - Timed events (special breeding opportunities)
   - Challenge scenarios

### Component Interactions
- Game Engine maintains the state and processes updates from user interactions
- Resource System feeds into Upgrade System to enable progression
- Entity System visualizes game state and provides feedback
- UI Components handle user input and display game state
- Event System introduces variety and strategic opportunities

## Non-Functional Requirements

### Performance Requirements
- Game must run smoothly on mobile devices with minimal battery usage
- Offline progress calculations must be efficient and accurate
- Animation system should gracefully handle hundreds of fish entities
- Memory footprint should remain reasonable even in late-game scenarios
- UI updates should be responsive with no perceptible lag

### Scalability
- Number system must handle exponential growth (from single digits to quintillions)
- UI must adapt to display large numbers clearly
- Performance should degrade gracefully with increased game complexity
- Interface must reorganize effectively across various screen sizes

### Reliability
- Save system must be robust with automatic backups
- Game state should recover gracefully from interruptions
- Browser refreshes should not result in progress loss
- UI interactions should remain consistent across sessions

## Technology Stack

### Frontend
- **HTML5/CSS3**: Foundation for the UI
- **JavaScript/TypeScript**: For game logic
- **React**: Component-based UI management
- **CSS Flexbox/Grid**: For responsive, adaptive layouts

### Animation & Graphics
- **CSS Animations**: For subtle UI feedback and transitions
- **SVG Icons**: For scalable UI elements that work across screen sizes

### State Management
- **Redux**: For game state (fish count, upgrades, etc.)
- **localStorage/IndexedDB**: For saving progress

### Build Tools
- **Vite**: Fast modern bundler for development and production
- **ESLint/Prettier**: Code quality and formatting

### Performance Optimization
- **Web Workers**: For complex calculations off the main thread
- **RequestAnimationFrame**: For smooth animation loops
- **Object pooling**: For fish entity management to minimize garbage collection
- **Virtualized rendering**: To handle large numbers of UI elements

## Type Safety Enhancements
- **Strong TypeScript typing**: Enforced throughout the codebase to catch errors at compile time
- **Enum-based state management**: For consistent state handling across components
- **Type guards**: To ensure runtime type safety when handling user data or API responses
- **Interface segregation**: Clear separation between different parts of the game state
- **Strict null checking**: To prevent null reference errors in-game

## Development Approach
- **Incremental Development**: Build core loop first, then add features
- **Component-Based**: Develop isolated components that can be composed
- **State-Driven**: UI reflects game state, with clear update patterns
- **Mobile-First**: Design for mobile constraints, then enhance for desktop
- **Progressive Enhancement**: Core functionality works everywhere, with enhancements for more capable browsers

## Security Considerations
- Save file validation to prevent tampering
- Rate limiting for actions to prevent automation/botting
- Safe parsing of imported save files
- Protection against time manipulation (for time-based mechanics)

## Testing Strategy
- Unit tests for core game mechanics and calculations
- Component tests for UI elements
- Integration tests for interaction between systems
- Playtest sessions to validate progression curve and engagement
- Cross-device testing to ensure responsive design works on all targets

## Deployment Pipeline
- GitHub Actions for CI/CD
- Automated testing before deployment
- Staging environment for final verification
- Production deployment to GitHub Pages or similar static hosting

## Integration Points
- Browser localStorage/IndexedDB for saves
- Optional cloud save functionality
- Potential for community features (leaderboards, sharing)

## Technical Debt Considerations
- Avoid hard-coding game constants; use configuration objects
- Plan for localization from the beginning
- Document core algorithms and game balance formulas
- Establish conventions for handling large numbers and precision
- Maintain clear UI component organization with minimal coupling 