# ESLint Issues Implementation Plan

Based on the ESLint report, we have identified 32 warnings across the codebase. This document outlines a systematic approach to addressing these issues.

## Issue Categories

1. **Functions Exceeding Line Limits (19 warnings)**
   - Maximum allowed lines per function: 50
   - Functions with this issue are spread across multiple components and utility files

2. **Unused Variables (5 warnings)**
   - Several unused variables, primarily in component props
   - Need to either use these variables or remove/rename them with underscore prefix

3. **Console Statements (9 warnings)**
   - Console.log statements should be removed or replaced with proper logging

4. **Import Order Issues (4 warnings)**
   - Import ordering doesn't follow the configured rules
   - Need to organize imports by standard library → third-party → local modules

## Implementation Approach

### Phase 1: Fix Simple Issues First (Import Order & Console Statements)

1. **Fix Import Order Issues**:
   - Correct the import order in:
     - src/index.tsx
     - src/store/gameSlice.ts
   - Follow the pattern: builtin → external → internal

2. **Address Console Statements**:
   - Review each console statement to determine if it's needed for debugging
   - For necessary logging, implement a proper logging utility
   - For temporary debug statements, remove them
   - Files to address:
     - src/game/GameSetup.tsx
     - src/store/reducers/navigationReducers.ts
     - src/store/reducers/purchaseReducers.ts
     - src/utils/gameStorage.ts

### Phase 2: Address Unused Variables

1. **Review and Fix Unused Variables**:
   - In FishRenderer.tsx: Review 'breedingEvent' usage
   - In GameControls.tsx: Review 'capacityReached', 'isMaxTankLevel', 'controlsVisible'
   - In breedingReducers.ts: Review 'FishSpecies'
   - Either utilize these variables or rename with underscore prefix (e.g., '_breedingEvent')

### Phase 3: Tackle Function Length Issues

1. **Refactor Large Arrow Functions**:
   - Identify the large arrow functions in each file
   - Break them down into smaller, more focused functions
   - Extract reusable logic into utility functions
   - Key files to address:
     - src/components/Aquarium.tsx
     - src/components/ControlPanel.tsx
     - src/components/FishRenderer.tsx
     - src/components/GameControls.tsx
     - src/components/LocationBox.tsx
     - src/components/SingleLocationView.tsx
     - src/components/TankRenderer.tsx
     - src/store/reducers/breedingReducers.ts
     - src/utils/tankDecorations.ts

## Priority Order

1. First pass: Import order and console statement fixes (simplest)
2. Second pass: Unused variable resolution (intermediate)  
3. Third pass: Function length refactoring (most complex)

## Testing Approach

After each phase:
1. Run ESLint to verify fixes: `npm run lint`
2. Run the application to ensure functionality is preserved: `npm start`
3. Test key game features to ensure no regressions

## Additional Considerations

- Consider updating ESLint rules if certain patterns are intentional (e.g., allowing longer functions in specific cases)
- Document complex refactoring decisions for future reference
- Ensure that component splitting follows logical boundaries 