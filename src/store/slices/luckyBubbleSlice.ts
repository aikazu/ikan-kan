import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Define Lucky Bubble types and effects
export enum LuckyBubbleType {
  FEEDING_FRENZY = 'feedingFrenzy',
  BREEDING_BOOM = 'breedingBoom',
  FISH_SHOWER = 'fishShower',
  SCHOOLS_IN = 'schoolsIn',
  VISITOR_RUSH = 'visitorRush',
}

export interface LuckyBubble {
  id: string;
  type: LuckyBubbleType;
  startTime: number;
  duration: number; // in milliseconds
}

interface LuckyBubbleState {
  activeLuckyBubbles: LuckyBubble[];
  lastLuckyBubbleTime: number;
  totalLuckyBubbles: number;
  totalActiveBubbleTime: number; // in seconds
}

const initialState: LuckyBubbleState = {
  activeLuckyBubbles: [],
  lastLuckyBubbleTime: Date.now(),
  totalLuckyBubbles: 0,
  totalActiveBubbleTime: 0
};

export const luckyBubbleSlice = createSlice({
  name: 'luckyBubble',
  initialState,
  reducers: {
    triggerLuckyBubble: {
      reducer: (state, action: PayloadAction<{
        bubbleType?: LuckyBubbleType;
        instantPoints?: number;
      }>) => {
        const { bubbleType } = action.payload || { bubbleType: undefined };
        
        // If bubbleType is not provided, randomly select a type
        const randomType = bubbleType || Object.values(LuckyBubbleType)[
          Math.floor(Math.random() * Object.values(LuckyBubbleType).length)
        ];
        
        // Calculate duration based on type (30 seconds to 2 minutes)
        let duration = 30000; // Default 30 seconds
        
        switch (randomType) {
          case LuckyBubbleType.FEEDING_FRENZY:
          case LuckyBubbleType.BREEDING_BOOM:
            duration = 30000; // 30 seconds
            break;
          case LuckyBubbleType.SCHOOLS_IN:
            duration = 120000; // 2 minutes
            break;
          case LuckyBubbleType.FISH_SHOWER:
          case LuckyBubbleType.VISITOR_RUSH:
            // These are instant effects, no duration needed
            // They don't get added to active bubbles
            break;
        }
        
        // For instant effects, we don't add them to active bubbles
        if (randomType !== LuckyBubbleType.FISH_SHOWER && randomType !== LuckyBubbleType.VISITOR_RUSH) {
          const newBubble: LuckyBubble = {
            id: uuidv4(),
            type: randomType,
            startTime: Date.now(),
            duration,
          };
          
          state.activeLuckyBubbles.push(newBubble);
        }
        
        // Update last bubble time and counters
        state.lastLuckyBubbleTime = Date.now();
        state.totalLuckyBubbles += 1;
      },
      prepare: (payload = {}) => ({ payload })
    },
    
    removeLuckyBubble: (state, action: PayloadAction<string>) => {
      // Find the bubble first
      const bubble = state.activeLuckyBubbles.find(b => b.id === action.payload);
      
      if (bubble) {
        // Update statistics for bubble time
        const now = Date.now();
        const bubbleActiveTime = Math.min(now - bubble.startTime, bubble.duration) / 1000; // Convert to seconds
        state.totalActiveBubbleTime += bubbleActiveTime;
      }
      
      state.activeLuckyBubbles = state.activeLuckyBubbles.filter(
        bubble => bubble.id !== action.payload
      );
    },
    
    cleanExpiredBubbles: (state) => {
      const now = Date.now();
      
      // Update total bubble time for expired bubbles
      state.activeLuckyBubbles.forEach(bubble => {
        if (now >= bubble.startTime + bubble.duration) {
          const bubbleActiveTime = Math.min(now - bubble.startTime, bubble.duration) / 1000; // Convert to seconds
          state.totalActiveBubbleTime += bubbleActiveTime;
        }
      });
      
      state.activeLuckyBubbles = state.activeLuckyBubbles.filter(
        bubble => now < bubble.startTime + bubble.duration
      );
    },
    
    // Action to help deserialize saved state
    updateLuckyBubbleState: (state, action: PayloadAction<Partial<LuckyBubbleState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

export const { 
  triggerLuckyBubble, 
  removeLuckyBubble, 
  cleanExpiredBubbles,
  updateLuckyBubbleState
} = luckyBubbleSlice.actions;

export default luckyBubbleSlice.reducer; 