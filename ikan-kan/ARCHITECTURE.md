# Architecture Documentation

## 1. System Overview

Ikan-Kan is built as a single-page React application with Redux for state management. The architecture follows a component-based design with clear separation between game logic, UI components, and data management.

```
+---------------------------+
|          UI Layer         |
|  (React Components, MUI)  |
+------------+----+---------+
             |    |
             v    v
+------------+----+---------+
|       State Layer         |
|     (Redux, Reducers)     |
+------------+----+---------+
             |    |
             v    v
+------------+----+---------+
|      Core Game Logic      |
|   (Game Loop, Upgrades)   |
+---------------------------+
```

## 2. Component Architecture <a id="component-architecture"></a>

The UI is structured as a hierarchy of React components:

```
GameScreen
├── Header
├── ResourceDisplay
├── FishingArea
│   └── FishButton
├── UpgradePanel
│   ├── CategoryTabs
│   ├── UpgradeItem
│   │   ├── UpgradeEffectDescription
│   │   └── UpgradePurchaseButton
│   └── NoUpgradesMessage
└── Footer
```

Each component is responsible for a specific aspect of the UI and communicates with the Redux store for state updates.

## 3. State Management <a id="state-management"></a>

The application uses Redux Toolkit for state management with the following key slices:

- **gameSlice**: Core game state including resources, upgrades, and progress
- **settingsSlice**: User preferences and configuration
- **uiSlice**: UI-specific state like active tabs and modals

The game state follows this structure:

```javascript
{
  resources: {
    fish: number,
    scales: number,
    knowledge: number
  },
  production: {
    fishPerSecond: number,
    clickPower: number
  },
  upgrades: {
    [upgradeId]: {
      level: number,
      purchased: boolean
    }
  },
  stats: {
    totalClicks: number,
    totalFishCollected: number,
    playTime: number
  },
  meta: {
    lastActive: timestamp,
    version: string
  }
}
```

## 4. Data Flow <a id="data-flow"></a>

The application follows a unidirectional data flow:

1. User actions (clicks, purchases) are captured by React components
2. Actions are dispatched to the Redux store
3. Reducers update the state based on the actions
4. Components react to state changes and re-render

For time-based actions, a game loop is implemented:

```
+----------------+     +---------------+
| Game Loop      |---->| Update State  |
| (setInterval)  |     | (Dispatch)    |
+----------------+     +---------------+
        |                     |
        v                     v
+----------------+     +---------------+
| Save Progress  |<----| UI Updates    |
| (localStorage) |     | (React)       |
+----------------+     +---------------+
```

## 5. Technical Constraints <a id="technical-constraints"></a>

### Performance Considerations

- Game loop runs at 10 ticks per second (100ms intervals)
- Heavy calculations are memoized to prevent unnecessary recalculations
- Component rendering is optimized with `React.memo` and selective re-renders

### Browser Compatibility

- Targets modern browsers (Chrome, Firefox, Safari, Edge)
- Uses polyfills for older browsers when necessary
- Responsive design works on both desktop and mobile devices

### Storage Limitations

- Game state is stored in localStorage with fallback mechanisms
- Save data is compressed to stay within storage limits
- Version tracking ensures backward compatibility for saved games

## 6. Security Architecture <a id="security"></a>

As a client-side game, security focuses on:

- Input validation to prevent unexpected state manipulation
- Anti-cheat measures for basic save data integrity
- Safe storage practices for user preferences

## 7. Design Patterns <a id="design-patterns"></a>

The application employs several design patterns:

- **Observer Pattern**: Redux store subscription for state updates
- **Command Pattern**: Action creators for state modifications
- **Factory Pattern**: Upgrade generation and initialization
- **Strategy Pattern**: Different upgrade effect implementations

## 8. Architecture Decisions <a id="architecture-decisions"></a>

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| State Management | Context API vs Redux | Redux chosen for complex state with time-based updates and persistence requirements |
| UI Framework | Custom CSS vs Material UI | Material UI chosen for consistent design system and component library |
| Animation Library | CSS vs Framer Motion | Framer Motion chosen for complex animations with React integration |
| Storage Mechanism | Cookies vs localStorage | localStorage chosen for larger storage capacity and simpler API |

## 9. Future Architectural Considerations <a id="future-considerations"></a>

- Potential migration to TypeScript for improved type safety
- Consideration of offline-first PWA capabilities
- Modularization of game mechanics for plugin-style feature expansion
- Server-side validation for potential multiplayer features 