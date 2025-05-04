# Ikan-kan

## Core Concept
Start with a single fish in a tiny bowl. Click to feed your fish, earning Fish Points (FP) and occasionally triggering fish reproduction. Upgrade to larger aquariums, automate feeding and breeding, expand to multiple locations, and build your aquatic empire - all within a single satisfying play session.

## Ultra-Compressed Progression System
The game is designed with a hyper-compressed progression curve optimized for short web sessions (2 hours or less):
- **Immediate Feedback**: First minute yields visible progress and first upgrade
- **Rapid Feature Unlocks**: All core mechanics accessible within 30 minutes
- **Milestone Rush**: Clear goals with rewards every 2-3 minutes
- **Parallel Systems**: Multiple gameplay avenues unlocked early for player choice
- **Complete Experience**: Full gameplay loop with prestige achievable in a single session

## Current Implementation Status

The project has implemented these core features:
- Project setup with React, TypeScript, Redux, and Vite
- Core game loop with click-to-feed mechanics
- Visual fish tank with individual fish icons that fill the tank based on count
- Comprehensive upgrade system with tank capacities and auto-feeders
- Fish entity system with diverse fish types, properties, and abilities
- Fish collection UI showing discovered species and their abilities
- Offline progression with welcome back modal for returning players
- Save/load system using localStorage for persistence
- Lucky Bubbles system providing random gameplay bonuses
- Enhanced visual feedback system with animated indicators
- Streamlined UI design optimized for both desktop and mobile
- Auto-feeder speed upgrade system replacing tiered feeders
- Adjusted tank capacities following a steeper progression (5→30→150→600→1800→3200)

## Core Gameplay Loop

### Clicking Phase (Initial) - First 1-2 minutes
- **Action**: Click the "Feed Fish" button
- **Feedback**: Each click:
  - Earns 2 Fish Points (FP)
  - Has a 20% chance to spawn a new fish (max capacity limited by tank size)
  - Simple visual of fish swimming toward food, bubble animation, and "plop" sound
- **Goal**: Accumulate enough FP to buy your first automated feeder (10 FP)
- **Timeframe**: Players should reach first automation within ~30 seconds
- **Engagement Hook**: Visible progress with every click

### Expansion Phase (Core Loop) - Minutes 2-10
- **Spend FP to expand your aquatic ecosystem**:
  - **Tank Upgrades**:
    - Fish Bowl (Starting): Holds 5 fish
    - Small Aquarium (Costs 20 FP): Holds 30 fish
    - Medium Aquarium (Costs 100 FP): Holds 150 fish
    - Large Aquarium (Costs 500 FP): Holds 600 fish
    - Home Pond (Costs 2,000 FP): Holds 1,800 fish
    - Indoor Reef System (Costs 8,000 FP): Holds 3,200 fish
  
  - **Passive FP Generation**: Each fish generates 0.5 FP per second
  - **Breeding Mechanic**: Fish have a 5% chance per minute to reproduce (if tank has capacity)
  - **Feedback**: Visual representation of your expanding aquatic system, more fish swimming
  - **Engagement Hook**: Watching numbers grow while making strategic upgrade choices

### Automation Phase - Minutes 3-20
- **Spend FP on automation**:
  - Auto-Feeder (Costs 10 FP): Feeds fish at base rate with upgradeable speed
  - Speed Upgrades: Multiply feeder efficiency (3x, 9x, 27x, 81x)
  
  - **Engagement Hook**: Each automation tier provides a noticeable boost in production

### Species Diversification - Minutes 10-30
- **Collect different fish species with unique benefits**:
  - Guppies (Starting): Basic fish (1× breeding rate, 1× FP generation)
  - Goldfish (Costs 75 FP): 1.5× FP generation
  - Tetras (Costs 300 FP): School together - each additional tetra gives +5% output
  - Angelfish (Costs 1,200 FP): 2× breeding rate
  - Clownfish (Costs 5,000 FP): Occasionally generates "Lucky Bubbles"
  - Discus (Costs 15,000 FP): Attracts visitors (new income stream)
  
  - **Engagement Hook**: Collection aspect drives continuous play

### Multi-Location & Advanced Features - Minutes 20-60
- **After reaching Medium Aquarium level, unlock parallel progression systems**:
  - Second Location (Costs 15,000 FP): Duplicate your setup with 75% starting efficiency
  - Expedition System: Send teams to discover rare fish species (unlocks at 7,500 FP)
  - Research Lab: Unlock genetic modifications and special tank technologies (10,000 FP)
  
  - **Engagement Hook**: Multiple systems to interact with simultaneously

### Prestige System ("Conservation Grants") - Minutes 45-90
- **Reset Mechanic**: Once reaching 30,000 FP total production, option to "donate" your fish empire
- **Permanent Rewards**: Gain "Conservation Influence" points that provide permanent bonuses
- **Accelerated Restart**: Each prestige makes early game 50% faster
- **New Content**: Unlock special facilities and species in future playthroughs
- **Timeframe**: First prestige achievable within 45-60 minutes of play

## Strategic Dopamine Triggers

### "Just One More" Mechanics
- **Visible Progress Bars**: Always showing how close you are to the next upgrade
- **Near-Miss Breeding**: Visual indication when breeding almost happened
- **Short-Term Goals**: Mini-tasks with rewards every 1-2 minutes

### Surprise and Variability
- **Lucky Bubbles**: Appear randomly every 1-2 minutes, providing varied bonuses:
  - "Feeding Frenzy": +500% clicking power for 30 seconds
  - "Breeding Boom": 20× breeding chance for 30 seconds
  - "Fish Shower": Instantly gain 60 seconds of production
  - "School's In": All fish produce double FP for 2 minutes
  - "Visitor Rush": Instant cash bonus (if visitors unlocked)

- **Random Events**: Mini-scenarios that appear every 3-5 minutes:
  - Algae bloom (temporary production decrease unless addressed)
  - Fish exhibition (chance for rare species or rewards)
  - Water quality challenge (quick mini-game for bonuses)

### Perfect Offline Balance
- **Offline Progress**: Generate 90% of your normal production while away
- **Comeback Bonus**: +150% production for 5 minutes when returning after 30+ minutes away
- **Idle Discoveries**: Chance to discover new fish species while away

## Addiction Optimization
- **Variable Reward Schedule**: Mix of predictable and unpredictable rewards
- **Achievable Micro-Goals**: Always something attainable within the next 1-2 minutes
- **Progression Overlapping**: As one system slows down, another one speeds up
- **Investment Mechanics**: Sunk cost feeling drives continued engagement
- **Collection Completionism**: Track discovered species in an encyclopedia
- **Meaningful Choices**: Strategic decisions that affect long-term trajectory
- **Save & Return**: Easy to play in short bursts with automatic progress saving

## Additional Features
- **Quick Achievements**: Milestone rewards that provide immediate bonuses
- **Visual Customization**: Decorate tanks, change backgrounds, add ornaments
- **Time-limited Events**: Daily special breeding opportunities or challenges
- **Community Features**: (Optional) Share rare fish or compete on leaderboards
- **Quick-Save**: One-click save and resume functionality for short play sessions
- **Progress Summary**: End-of-session summary of achievements and progress
- **Session Goals**: Optional objectives that can be completed in a single 10-minute session

## Monetization Potential (Optional)
- **Premium Currency**: Speed up certain processes or bypass waiting periods
- **Exclusive Fish Species**: Special variants with unique abilities (no direct power advantage)
- **Visual Enhancements**: Decorative items with minor gameplay bonuses
- **Offline Progression Boosts**: Extended offline collection time
- **Quick Start Packs**: Skip the very early game for returning players