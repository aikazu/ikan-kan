| ID   | Description                                       | Priority | Status      | Dependencies | Progress |
|------|---------------------------------------------------|----------|-------------|--------------|----------|
| T001 | Project Setup, Documentation & Code Review        | HIGH     | COMPLETED   | -            | 100%     |
| T002 | Implement Phase 1: The Pond - Manual Clicking      | HIGH     | COMPLETED   | T001         | 100%     |
| T003 | Implement Phase 1: The Pond - Basic Automation     | HIGH     | COMPLETED   | T002         | 100%     |
| T004 | Implement Phase 1: Pond Upgrades for Fish Diversity | MEDIUM   | COMPLETED   | T003         | 100%     |
| T005 | Implement Game Phase Transition to Lake             | HIGH     | COMPLETED   | T004         | 100%     |
| T006 | Introduce "Knowledge" Currency & Research Mechanic  | HIGH     | COMPLETED   | T005         | 100%     |
| T007 | Implement Boat Mechanic for Lake Fishing            | MEDIUM   | COMPLETED   | T006         | 100%     |
| T008 | Design and Implement Rare Lake Fish Species         | MEDIUM   | COMPLETED   | T006         | 100%     |
| T009 | Basic Fish Market Mechanic (Passive Boost)          | LOW      | COMPLETED   | T006         | 100%     |
| T010 | Implement Game Phase Transition to Coastal Waters   | HIGH     | COMPLETED   | T009         | 100%     |
| T011 | Commercial Fishing Fleet Mechanic                   | HIGH     | COMPLETED   | T010         | 100%     |
| T012 | Marine Biology Research & Basic Fish Breeding Intro | MEDIUM   | TODO        | T010         | 0%       |
| T013 | Basic Sustainable Fishing Practices Mechanic        | LOW      | TODO        | T012         | 0%       |
| T014 | Basic Fish Processing Facilities Mechanic           | MEDIUM   | TODO        | T011         | 0%       |

## Active Session Focus
Session S001: Initial codebase analysis complete. Preparing for T012.
Currently working on: T012 - Marine Biology Research & Basic Fish Breeding Intro.
- [x] Define new research items in `data/research.js` for marine biology.
- [x] Determine effects (e.g., unlock new coastal fish, passive bonuses related to fish populations).
- [x] Update `gameLogicMiddleware` or related systems if new effect types are introduced.

## Completed Tasks:
| ID   | Description                                       | Completed | Notes                                                              |
|------|---------------------------------------------------|-----------|--------------------------------------------------------------------|
| T001 | Project Setup, Documentation & Code Review        | ✓         | Core docs created, codebase reviewed.                              |
| T002 | Implement Phase 1: The Pond - Manual Clicking      | ✓         | Existing codebase covers manual click mechanic.                    |
| T003 | Implement Phase 1: The Pond - Basic Automation     | ✓         | Existing codebase and `upgrades.js` cover this.                    |
| T004 | Implement Phase 1: Pond Upgrades for Fish Diversity | ✓         | Added `attract_new_fish` upgrade and logic.                        |
| T005 | Implement Game Phase Transition to Lake             | ✓         | Added logic to `upgradeMiddleware` to transition to Lake phase.    |
| T006 | Introduce "Knowledge" Currency & Research Mechanic  | ✓         | Knowledge, research data, state, middleware, and panel UI implemented. |
| T007 | Implement Boat Mechanic for Lake Fishing            | ✓         | Boat upgrades added to data and UpgradePanel; effects handled by middleware. |
| T008 | Design and Implement Rare Lake Fish Species         | ✓         | Lake fish defined, unlock paths set, bonus logic in `catchFish` added. |
| T009 | Basic Fish Market Mechanic (Passive Boost)          | ✓         | `market_stall` upgrade added, `globalMultiplier` effect handled.     |
| T010 | Implement Game Phase Transition to Coastal Waters   | ✓         | Logic for phase change and default coastal fish discovery added.   |
| T011 | Commercial Fishing Fleet Mechanic                   | ✓         | Commercial vessel upgrades added to data; effects handled by existing logic. |
