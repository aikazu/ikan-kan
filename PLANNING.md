# Ikan Kan: Mancing Mania - Planning Document

## Project Vision
Create an engaging and addictive incremental game that combines the satisfaction of idle mechanics with strategic depth and educational elements about marine ecosystems. The game will progress from simple fishing in a pond to managing a vast oceanic empire.

## Goals
- Develop a polished, responsive web-based game accessible on desktop and mobile devices
- Create a satisfying progression system with meaningful choices
- Balance idle mechanics with active gameplay elements
- Implement educational elements about marine ecosystems without compromising fun
- Build a scalable architecture that can support future expansions

## Key Milestones and Timeline

### Phase 1: Foundation (Weeks 1-2)
- Set up project architecture and development environment
- Implement core game loop (clicking, basic resource generation)
- Create basic UI components
- Implement save/load functionality

### Phase 2: Core Game Mechanics (Weeks 3-4)
- Implement currency system (Fish, Scales, Knowledge)
- Build basic upgrade system
- Create first set of automation tools
- Implement initial fish collection mechanics

### Phase 3: Progression System (Weeks 5-6)
- Implement phase progression (Pond → Lake → Coastal Waters)
- Add diverse fish species with different properties
- Implement basic research mechanics
- Add staff hiring and management

### Phase 4: Advanced Features (Weeks 7-8)
- Implement ecosystem management mechanics
- Add events system
- Create achievements system
- Implement deep sea exploration mechanics

### Phase 5: Polish and Launch (Weeks 9-10)
- Optimize performance
- Add sound and visual effects
- Conduct user testing and balancing
- Prepare for initial release

## Non-Functional Requirements (NFRs)

### Performance
- The game must function smoothly on mid-tier mobile devices
- Idle progression calculations must be efficient enough to not drain battery
- Game should load within 3 seconds on average connections

### Usability
- UI must be responsive and adapt to different screen sizes
- Touch targets must be appropriate for mobile use
- Game progression must be intuitive without extensive tutorials

### Reliability
- Save system must prevent data loss
- Offline progression must work reliably
- Game must handle browser refresh without losing state

### Security
- Player save data must be protected against tampering
- Any server communications must be secured appropriately

### Scalability
- Architecture must support adding new fish species, upgrades, and game features
- Database design (if used) must accommodate growing player populations
- Code structure must support future expansion of game mechanics

## Development Approach

### Methodology
We will use an Agile approach with 1-week sprints. Each sprint will focus on implementing specific features that can be tested independently. We will prioritize features based on their impact on the core game loop.

### Tech Stack Strategy
- Frontend: React for UI components, Redux for state management
- Game Engine: Custom built on Canvas/DOM with requestAnimationFrame
- Storage: LocalStorage for basic saves, optional Firebase for cloud saves
- Build Tools: Webpack, Babel for modern JavaScript support

### Testing Strategy
- Unit Tests: Core game mechanics and calculations
- Integration Tests: UI components and state management
- Playtest Sessions: Regular sessions with potential players to gather feedback

### Deployment Strategy
- Development: Local development environment with hot reloading
- Staging: Deployed to staging environment for testing
- Production: Deployed to production hosting (GitHub Pages initially)

## Integration Points
- Browser LocalStorage for saving game state
- Optional Firebase integration for cloud saves
- Potential integration with social platforms for sharing

## Key Challenges and Approaches
1. **Game Balance**: Implement a configurable system for game parameters to facilitate easy balancing
2. **Performance**: Use efficient algorithms for idle calculations and limit DOM updates
3. **Engagement**: Carefully design progression curve to maintain interest over time
4. **Scope Management**: Prioritize core features and prepare modular architecture for future expansions

## References
- [Game Design Document](IDEA.md)
- [Technical Architecture](ARCHITECTURE.md)
- [Technology Stack Details](TECH-STACK.md) 