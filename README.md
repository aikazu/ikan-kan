# Ikan Kan: Mancing Mania

An incremental idle fishing game where you build your fishing empire from a small pond to ocean mastery.

## Problem Solved

Provides an engaging, relaxing experience combining idle gameplay with strategic depth and educational elements about marine ecosystems.

## Key Features

- **Deep Progression System**: Advance from a small pond to ruling the oceans
- **Rich Economy System**: Multiple currencies and upgrade paths
- **Fish Collection**: Discover and collect hundreds of unique fish species
- **Ecosystem Management**: Balance fishing with sustainability
- **Educational Elements**: Learn about marine life through gameplay

## Installation

### Prerequisites

- Node.js (v14.0 or higher)
- NPM (v6.0 or higher)

### Setup

```bash
# Clone the repository
git clone https://github.com/aikazu/ikan-kan.git

# Navigate to project directory
cd ikan-kan

# Install dependencies
npm install

# Start development server
npm run dev
```

## Basic Usage

```javascript
// Example code to add fish to your inventory
game.catchFish(1);

// Example code to purchase an upgrade
game.purchaseUpgrade('fishing_rod_1');
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, React
- **State Management**: Redux
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library
- **Storage**: LocalStorage, optional Firebase for cloud saves

## Project Structure

```bash
ikan-kan/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Game assets (images, sounds)
│   ├── components/     # React components
│   ├── store/          # Redux store
│   ├── game/           # Game logic
│   ├── screens/        # Game screens
│   └── utils/          # Utility functions
├── docs/               # Documentation
└── tests/              # Test files
```

## Documentation

- [Planning Document](PLANNING.md) - Project vision and roadmap
- [Architecture Document](ARCHITECTURE.md) - Technical architecture details
- [Tech Stack](TECH-STACK.md) - Detailed technology choices

## License

MIT License
