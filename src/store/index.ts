import { configureStore } from '@reduxjs/toolkit';
import fishReducer from './slices/fishSlice';
import tankReducer from './slices/tankSlice';
import feederReducer from './slices/feederSlice';
import luckyBubbleReducer from './slices/luckyBubbleSlice';
import statisticsReducer from './slices/statisticsSlice';
import achievementReducer from './slices/achievementSlice';

export const store = configureStore({
  reducer: {
    fish: fishReducer,
    tank: tankReducer,
    feeder: feederReducer,
    luckyBubble: luckyBubbleReducer,
    statistics: statisticsReducer,
    achievement: achievementReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 