# Ikan-kan

Ikan-kan is an incremental game where you start with a single fish in a tiny bowl and build your way to a vast aquatic empire spanning multiple locations, species, and even planets.

## Problem

Many incremental games follow the same pattern and quickly become repetitive. Ikan-kan aims to solve this by providing a visually engaging experience with multiple progression paths and a theme that naturally aligns with growth mechanics.

## Key Features

- **Evolving Gameplay**: Transitions from simple clicking to complex management of a vast aquatic ecosystem
- **Multiple Progression Paths**: Tank upgrades, automation, species diversity, and location expansion
- **Visually Engaging**: Watch your fish swim and your aquarium environments grow with your progress
- **Special Events**: Lucky Bubbles, Expeditions, and Tourism systems add variety and surprise
- **Deep Progression System**: Prestige mechanic ("Conservation Grants") for long-term gameplay
- **Immersive Experience**: Fullscreen aquarium view with clean, intuitive UI and minimal distractions

## Game Phases

1. **Clicking Phase**: Start by clicking to feed your fish, earning Fish Points and occasionally triggering breeding
2. **Expansion Phase**: Upgrade tanks to house more fish and increase passive production
3. **Automation Phase**: Purchase auto-feeders and upgrades to reduce manual clicking
4. **Multi-Location Phase**: Expand to additional tanks and locations for parallel progression
5. **Species Diversification**: Collect different fish species with unique benefits
6. **Late-Game Content**: Scientific breakthroughs, ocean colonization, and space aquatics

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ikan-kan.git

# Navigate to project directory
cd ikan-kan

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

## Development Roadmap

- **v0.1.0**: Basic clicking mechanics, first upgrades, and tank visualization
- **v0.2.0**: Improved fish visualization, breeding system, and tank capacity management
- **v0.3.0**: Full-screen responsive design, in-tank indicators, and enhanced UI/UX
- **v0.3.7** (Current): Improved mobile support, multi-touch, and portrait mode
- **v0.4.0** (Planned): Code quality improvements, fish variety system, and Lucky Bubbles events
- **v0.5.0**: Multiple locations, visitor/tourism mechanics, and settings menu
- **v0.6.0**: Expeditions system, fish encyclopedia, and achievement tracking
- **v1.0.0**: Complete core gameplay loop with prestige system
- **Post-Launch**: Late-game content, scientific breakthroughs, ocean colonization, space aquatics

## Development Guidelines

### Code Quality

The project maintains high code quality standards through:
- ESLint configuration for consistent code style
- Maximum function length of 50 lines for better readability 
- Nested component depth limited to 3 levels
- Modular architecture with files under 300 lines
- Consistent import ordering pattern
- TypeScript for type safety

Run the linter to check code quality:
```bash
npm run lint
```

Fix automatically fixable issues:
```bash
npm run lint:fix
```

## Usage

```javascript
// Example code for basic game interaction
import { IkanKan } from './src/game';

// Initialize game
const game = new IkanKan();

// Feed fish manually
game.feedFish();

// Purchase upgrade
game.purchaseUpgrade('autoFeeder');

// Save game
game.saveGame();
```

## Technology Stack

- React for UI components
- Redux for state management
- HTML5 Canvas for fish animations
- GSAP for fluid animations
- LocalStorage for save data
- CSS for styling with advanced features like backdrop-filter

## Project Structure

```
ikan-kan/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # UI components
│   ├── game/            # Game logic
│   │   ├── entities/    # Fish and environment entities
│   │   ├── systems/     # Game systems (economy, upgrades, etc.)
│   │   └── events/      # Special events logic
│   ├── store/           # Redux store configuration
│   │   └── reducers/    # Domain-specific reducers
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main application component
├── PLANNING.md          # Project planning document
├── TASK.md              # Task tracking
├── CHANGELOG.md         # Version history
├── ESLINT_FIXES.md      # Implementation plan for code quality improvements
└── README.md            # This file
```

## Contributing

See [PLANNING.md](PLANNING.md) for project architecture and vision. Check [TASK.md](TASK.md) for current tasks and backlog.

## License

MIT

## Contact

For questions or contributions, please open an issue on the GitHub repository. 