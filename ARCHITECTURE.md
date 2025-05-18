# Ikan Kan: Mancing Mania - Architecture Document

## Architectural Overview

Ikan Kan: Mancing Mania follows a component-based architecture built on React with Redux for state management. The game is designed as a web application with a clear separation between the UI layer and game logic.

## System Components

### Core Game Engine
The game engine handles the core mechanics, including:
- Game loop management
- Time tracking for idle progression
- Resource calculation and management
- Game state persistence
- Event handling

### User Interface Layer
The UI layer is responsible for:
- Rendering game components
- Handling user interactions
- Displaying animations and visual effects
- Adapting to different screen sizes

### Data Management
The data management components handle:
- Save/load functionality
- Game progression tracking
- Player statistics
- Achievement tracking

### Game Logic Units
These units implement specific game mechanics:
- Fish collection and management
- Upgrade systems
- Research and technology progression
- Staff and facility management
- Event and achievement systems

## Component Interactions

```
┌─────────────────────────────────────┐
│            User Interface           │
│  ┌───────────┐  ┌───────────────┐   │
│  │  Game UI  │  │ Control Panel │   │
│  └─────┬─────┘  └───────┬───────┘   │
└────────┼────────────────┼───────────┘
         │                │
         ▼                ▼
┌────────┴────────────────┴───────────┐
│           Redux Store                │
│  ┌─────────────┐  ┌──────────────┐  │
│  │ Game State  │  │ UI State     │  │
│  └──────┬──────┘  └──────────────┘  │
└─────────┼───────────────────────────┘
          │
          ▼
┌─────────┴───────────────────────────┐
│          Game Engine                 │
│  ┌─────────┐ ┌───────┐ ┌─────────┐  │
│  │Resources│ │Upgrades│ │Mechanics│  │
│  └─────────┘ └───────┘ └─────────┘  │
└─────────────────────────────────────┘
          │
          ▼
┌─────────┴───────────────────────────┐
│          Storage Layer               │
│  ┌────────────┐    ┌──────────────┐ │
│  │LocalStorage│    │Cloud Storage  │ │
│  └────────────┘    └──────────────┘ │
└─────────────────────────────────────┘
```

## Design Patterns

### Observer Pattern
Used for event handling and notifications between game components. For example:
- When resources change, UI components are notified
- When achievements are unlocked, notification system is triggered

### Factory Pattern
Used for creating different types of game objects:
- Fish species with different properties
- Upgrades with various effects
- Staff with different skills and abilities

### Command Pattern
Used for handling user actions and maintaining a clean separation between UI and game logic:
- All user interactions are converted to commands
- Commands can be serialized for undo/redo functionality
- Simplifies testing of game logic

### Singleton Pattern
Used for global managers:
- Game engine instance
- Save manager
- Sound manager

### Strategy Pattern
Used for implementing different behaviors:
- Calculation strategies for different upgrade effects
- Different fish spawning behaviors based on environment

## Data Flow

1. **User Interactions** → UI Components capture clicks, selections
2. **UI Actions** → Dispatched to Redux store
3. **Redux Middleware** → Processes actions and updates state
4. **Game Engine** → Processes state changes and applies game logic
5. **State Updates** → Propagated to UI components
6. **Persistence** → State saved to storage at checkpoints

## Technical Constraints

### Browser Compatibility
- Target modern browsers (last 2 versions)
- Fallbacks for critical features
- Progressive enhancement approach

### Performance Considerations
- Minimize DOM updates using React's virtual DOM
- Use requestAnimationFrame for animations
- Throttle expensive calculations
- Implement efficient algorithms for idle progression

### Memory Management
- Limit object creation during game loop
- Use object pooling for frequently created/destroyed objects
- Clean up listeners and intervals when components unmount

## Security Architecture

### Save Data Integrity
- Checksums to detect tampering
- Encryption for sensitive data
- Validation of loaded save data

### Cloud Save Security (if implemented)
- Secure authentication
- Data encryption in transit and at rest
- Rate limiting to prevent abuse

## Performance Architecture

### Rendering Optimization
- Component memoization
- Canvas for performance-critical rendering
- Sprite batching for similar objects

### Calculation Optimization
- Cached calculations where possible
- Batched updates
- Time-slicing for heavy calculations

## Section ID: ARCH-001
## Technical Decisions

### Frontend Framework: React
- **Decision**: Use React for UI components
- **Rationale**: Component-based architecture fits game UI requirements
- **Alternatives Considered**: Vue.js, Angular
- **Trade-offs**: React has steeper learning curve but better performance for our needs

### State Management: Redux
- **Decision**: Use Redux for state management
- **Rationale**: Predictable state management for complex game state
- **Alternatives Considered**: Context API, MobX
- **Trade-offs**: More boilerplate but better debugging and state tracking

### Storage Solution: LocalStorage + Optional Firebase
- **Decision**: Use LocalStorage with optional Firebase
- **Rationale**: Simple storage with optional cloud backup
- **Alternatives Considered**: IndexedDB, Custom backend
- **Trade-offs**: LocalStorage has size limitations but is simpler to implement

### Rendering Approach: Mixed DOM/Canvas
- **Decision**: Use DOM for UI, Canvas for game elements
- **Rationale**: Leverage React for UI with Canvas performance for game elements
- **Alternatives Considered**: Pure DOM, Pure Canvas, WebGL
- **Trade-offs**: More complex integration but better performance/flexibility balance 