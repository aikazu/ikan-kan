# ARCHITECTURE.md

## System Overview

Ikan Kan: Mancing Mania is a web-based incremental idle game. The frontend is built using React and Material UI, with Redux managing the application state. The game is designed to be a Progressive Web App (PWA) for cross-platform accessibility.

## Frontend Architecture

The application follows a component-based architecture, typical of React applications.

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│    React Components   │────▶│   Redux State Mgt   │────▶│ Game Logic Services │
│ (UI & Interactions) │     │ (Global App State)  │     │  (Core Mechanics)   │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         ▲                           │                             │
         │                           ▼                             ▼
         └───────────────────────────┴─────────────────────────────┘
                         User Actions & Game Events
```

### Key Directories (within `ikan-kan/src/`):

-   **`components/`**: Contains reusable UI components (e.g., buttons, modals, layout elements) and composite components representing different game views or features.
    -   Examples: `FishDisplay.js`, `UpgradePanel.js`, `PondView.js`
-   **`game/`**: Likely to house the core game logic, including:
    -   Game progression (Phases: Pond, Lake, etc.)
    -   Currency management (Fish, Scales, Knowledge, Prestige)
    -   Upgrade systems and calculations
    -   Event handling (tournaments, disasters)
    -   Ecosystem management logic
-   **`store/`**: Contains Redux setup.
    -   **`actions/`**: Action creators for dispatching changes to the state.
    -   **`reducers/`**: Reducers to handle state updates based on actions.
    -   **`selectors/`**: Selectors to efficiently retrieve data from the state.
    -   `store.js` (or `index.js`): Root store configuration.
-   **`data/`**: May contain static game data, such as:
    -   Fish definitions (species, rarities, bonuses)
    -   Upgrade details (costs, effects)
    -   Event definitions
-   **`utils/`**: Utility functions used across the application (e.g., formatting, calculations, API helpers if any).
-   **`App.js`**: Main application component, responsible for routing (if any) and layout.
-   **`index.js`**: Entry point of the React application, renders `App.js` and sets up the Redux Provider.

### State Management (Redux)

Redux will be used to manage the global game state, including:

-   Player's current resources (fish, scales, knowledge)
-   Unlocked upgrades and their levels
-   Current game phase
-   Discovered fish species
-   Settings and preferences
-   Active events

### Core Game Mechanics Implementation (Conceptual)

-   **Manual Clicking**: Event handlers in React components dispatch Redux actions to increment fish count.
-   **Automation**: Game logic services, possibly driven by `setInterval` or `requestAnimationFrame`, will periodically dispatch actions to simulate automated fishing, income generation, etc. These will update the Redux store.
-   **Upgrades**: Components display upgrade options. Purchasing an upgrade dispatches an action to update the player's resources and the state of the upgrade in Redux. The game logic services will use the new upgrade levels for calculations.
-   **Progression**: Game state (e.g., total fish caught, specific upgrades unlocked) will trigger phase transitions, unlocking new features and UI elements.

## Data Model (Conceptual - managed in Redux state)

-   **`player`**:
    -   `currencies`: { `fish`, `scales`, `knowledge`, `prestige` }
    -   `currentPhase`: `string` (e.g., "POND", "LAKE")
    -   `statistics`: { `totalClicks`, `totalFishCaught`, etc. }
-   **`upgrades`**: `Object` where keys are upgrade IDs.
    -   `[upgradeId]`: { `level`, `cost`, `effectMultiplier` }
-   **`fishSpecies`**: `Object` where keys are fish IDs.
    -   `[fishId]`: { `name`, `description`, `rarity`, `baseValue`, `discovered` }
-   **`facilities`**: `Object` for player-built structures.
    -   `[facilityId]`: { `level`, `productionRate` }
-   **`settings`**: { `soundOn`, `musicOn` }

## Technical Considerations from `IDEA.md`

-   **Progressive Web App (PWA)**: Requires a service worker, manifest file. `create-react-app` provides a base for this.
-   **Cloud Saves**: To be implemented. Could involve a simple backend or use services like Firebase. For now, local storage can be a placeholder.
-   **Offline Progression**: Calculations will need to occur when the game loads, based on the time elapsed since the last session. Store timestamp of last save.
-   **Responsive Design**: Material UI assists with this. CSS and component design should be mindful of different screen sizes.

## Future Expansion Areas (High-Level)

-   **Backend Integration**: For leaderboards, cloud saves, multiplayer features.
-   **API Layer**: If a backend is introduced, an API service layer in the frontend will manage communication.

## Potential Refinement Areas

-   **Research Effect Application**: The `gameLogicMiddleware` currently applies research-based `categoryMultiplier` effects as global multipliers to total FPS/ClickPower. For true category-specific boosts, this middleware would need refactoring to calculate and apply multipliers on a per-category basis before summing final stats. This is noted for future improvement if more granular control is needed.

This architecture is a starting point and will evolve as development progresses. 