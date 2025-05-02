# Ikan-kan: Planning Document

## Project Vision and Goals

Ikan-kan is an incremental game where players start with a single fish in a tiny bowl and gradually build a vast aquatic empire. The game aims to provide a satisfying progression experience through simple mechanics that evolve into complex systems, creating an addictive gameplay loop that keeps players engaged over long periods.

The primary goal is to create an engaging, visually appealing idle game that:
- Provides immediate feedback and satisfaction
- Offers meaningful choices and multiple progression paths
- Scales smoothly from simple clicking to complex management
- Maintains player interest through varied visual and gameplay elements
- Creates an immersive, fullscreen experience with minimal UI distractions

## Architectural Overview

### Core Components

1. **Game State Manager**
   - Maintains the central state of the game
   - Handles save/load functionality
   - Manages game loop and tick updates

2. **Economy System**
   - Tracks all resources (Fish Points, fish population, etc.)
   - Calculates production rates and costs
   - Handles transactions and upgrades

3. **UI Manager**
   - Renders the game interface
   - Handles user interactions
   - Updates visual elements based on game state
   - Provides responsive, fullscreen experience across devices

4. **Entity System**
   - Manages fish instances and their properties
   - Handles fish breeding and lifecycle events
   - Controls tank environments and capacity limits

5. **Upgrade System**
   - Manages available and purchased upgrades
   - Applies upgrade effects to game mechanics
   - Controls unlock progression

6. **Event System**
   - Generates random events (Lucky Bubbles)
   - Handles time-based occurrences
   - Manages special mechanics (expeditions, visitors)

7. **Achievement System**
   - Tracks player progress milestones
   - Provides rewards for achievements
   - Maintains encyclopedia of discovered content

### Component Interactions

- **Game State Manager** acts as the central hub, coordinating all other components
- **UI Manager** receives input and communicates actions to Game State Manager
- **Economy System** is updated by Entity System activities and player actions
- **Entity System** operates within constraints defined by the player's upgrades
- **Upgrade System** modifies the behavior of other systems when purchases are made
- **Event System** injects randomness and special opportunities into the gameplay
- **Achievement System** passively monitors actions across all systems

## Technical Constraints and Limitations

- **Browser Compatibility**: Must work on modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: Responsive design for mobile play with touch controls
- **Performance Optimization**: Efficient handling of potentially thousands of entities
- **Storage Limits**: Local storage constraints for save data
- **Animation Performance**: Balance between visual appeal and performance
- **Canvas Rendering**: Optimized drawing for smooth fish animations
- **Viewport Utilization**: Properly fill available screen space on all devices

## Performance Requirements

- **Frame Rate**: Maintain 60 FPS even with hundreds of fish displayed
- **Memory Usage**: Keep memory footprint below 100MB for browser environments
- **Save Data Size**: Compress save data to stay within local storage limits (5-10MB)
- **Load Time**: Initial game load under 3 seconds on average connections
- **Tick Rate**: Game logic updates at minimum 30 ticks per second
- **Responsive Layout**: UI adaptations for different screen sizes without performance impact

## Tech Stack

- **Frontend Framework**: React for UI components and state management
- **State Management**: Redux for global state management
- **Rendering**: HTML5 Canvas for fish animations and environments
- **Styling**: CSS with advanced features like backdrop-filter
- **Build Tools**: Webpack for bundling and optimization
- **Testing**: Jest for unit and integration tests
- **Storage**: LocalStorage for saving game progress
- **Animations**: GreenSock Animation Platform (GSAP) for smooth animations
- **TypeScript**: For type safety and better code quality

## Development Approach and Methodology

- **Incremental Development**: Build core mechanics first, then expand to more complex systems
- **Feature-Based Iterations**: Complete one gameplay feature fully before moving to the next
- **Playtest-Driven Design**: Regular playtesting to ensure balance and engagement
- **Modular Architecture**: Components designed for reusability and clear separation of concerns
- **Continuous Improvement**: Regular UI and performance enhancements based on playtesting

## Security Considerations

- **Save Data Integrity**: Checksum verification to prevent save editing
- **Input Validation**: Sanitize all user inputs for customization features
- **Offline Protection**: Mechanics to discourage time manipulation

## Testing Strategy

- **Unit Tests**: For core game mechanics and calculations
- **Integration Tests**: For component interactions
- **Performance Tests**: To ensure smooth operation with large numbers of entities
- **Balance Testing**: Simulations to verify progression curve
- **Playtesting**: Regular sessions with real players to evaluate engagement
- **Cross-browser Testing**: Ensure consistent experience across browsers
- **Device Testing**: Validate responsive design on various screen sizes

## Deployment Pipeline

- **Development Environment**: Local development with hot reloading
- **Staging Environment**: Web-based testing environment for internal review
- **Production Deployment**: Static site hosting (GitHub Pages, Netlify, or Vercel)
- **CI/CD**: Automated testing and deployment on commit to main branch

## Integration Points

- **Analytics Integration**: Event tracking for gameplay patterns
- **Social Sharing**: Optional mechanics for sharing achievements
- **Cloud Save**: Potential future integration for cross-device play

## UI/UX Design Principles

- **Clean Interface**: Minimal UI elements that don't obstruct gameplay
- **Responsive Design**: Adapts seamlessly to different screen sizes and orientations
- **Visual Feedback**: Clear indicators for player actions and game events
- **Accessibility**: Consideration for color contrast and interaction patterns
- **Immersive Experience**: Fullscreen gameplay that utilizes available viewport space
- **Contextual Controls**: UI elements appear when needed and stay out of the way otherwise 