# Ikan-kan

An addictive idle game where you start with a single fish in a bowl and build your way to a galactic aquatic empire.

## Key Features
- Start small with a single fish and expand to multiple aquariums, lakes, and eventually oceans
- Balance resource management and strategic upgrades to optimize your progress
- Discover and collect various fish species with unique abilities and benefits
- Automated systems that continue producing while you're away
- Multiple progression paths with different expansion opportunities
- Clean, responsive UI that works on mobile and desktop devices
- Ultra-fast progression designed for casual gameplay sessions

## Installation
```bash
# Clone the repository
git clone https://github.com/aikazu/ikan-kan.git
cd ikan-kan

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack
- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit with localStorage persistence
- **Styling**: CSS with Flexbox/Grid for responsive layouts
- **Build Tools**: Vite with ESLint/Prettier

See `PLANNING.md` for detailed technical architecture and decisions.

## Project Structure
```
ikan-kan/
├── public/         # Static assets
├── src/            # Source code
│   ├── components/ # UI components
│   │   ├── FishTank.tsx       # Main gameplay area
│   │   ├── FishCollection.tsx # Discovered fish display
│   │   ├── GameStatistics.tsx # Stats and metrics
│   │   ├── FloatingUpgrades.tsx # Upgrade buttons
│   │   └── ResourcePanel.tsx  # Resource counters
│   ├── store/      # Redux store configuration
│   │   └── gameSlice.ts       # Game state management
│   ├── hooks/      # Custom React hooks
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Utility functions
└── docs/           # Documentation
```

## Current Status
The project is in active development with these features implemented:
- Visual fish tank with individual fish icons
- Click-to-feed mechanics with disappearing tutorial indicator
- Fish collection with various fish types and special abilities
- Tank upgrades and auto-feeder system
- Streamlined UI optimized for both desktop and mobile
- Lucky Bubbles system for random gameplay bonuses
- Save/load system with offline progression
- Statistics tracking and detailed fish collection
- Enhanced type safety with strict TypeScript typing
- Improved development environment with comprehensive .gitignore

See `TASK.md` for current tasks and development status.

## Documentation
- [PLANNING.md](PLANNING.md) - Technical architecture and planning
- [TASK.md](TASK.md) - Current tasks and backlog
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

## License
MIT

## Contact
Your Name - [@Vystkailash](https://twitter.com/vystkailash) 