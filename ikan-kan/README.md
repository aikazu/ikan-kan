# Ikan-Kan: Fish Clicker Game

A relaxing incremental clicker game where you catch fish, upgrade your equipment, and become a fishing master!

## Overview

Ikan-Kan is a browser-based idle clicker game built with React and Redux. Players click to catch fish, which can be spent on various upgrades to increase production rate, click power, and unlock special features.

## Key Features

- **Simple clicking mechanics** with satisfying feedback and animations
- **Upgradeable equipment** to increase fish-catching efficiency
- **Automatic fish collection** from upgrades like fishing rods and staff
- **Attractive water-themed UI** with animations and visual effects
- **Offline progress** that continues even when you're not playing

## Installation

```bash
# Clone the repository
git clone https://github.com/aikazu/ikan-kan.git

# Navigate to project directory
cd ikan-kan

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

```javascript
// Game usage is simple:
// 1. Click the fish button to catch fish
// 2. Use earned fish to purchase upgrades
// 3. Upgrades increase click power or auto-fishing rate
// 4. Unlock special abilities as you progress
```

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **State Management**: Redux/Redux Toolkit
- **UI Components**: Material UI 7.1.0
- **Animations**: Framer Motion
- **Styling**: CSS-in-JS with Emotion
- **Build/Deployment**: Create React App, GitHub Pages

## Project Structure

```
ikan-kan/
├── public/            # Static assets and HTML template
├── src/
│   ├── components/    # React components for UI elements
│   ├── store/         # Redux store and slices for state management
│   ├── game/          # Core game mechanics and logic
│   ├── data/          # Game data, upgrades, and configuration
│   └── utils/         # Helper utilities and functions
├── PLANNING.md        # Project vision and roadmap
├── TASK.md            # Current tasks and project progress
└── CHANGELOG.md       # Version history and changes
```

## Live Demo

Play the game at [https://aikazu.github.io/ikan-kan/](https://aikazu.github.io/ikan-kan/)

## License

MIT License

## Contact

Project maintained by [aikazu](https://github.com/aikazu)
