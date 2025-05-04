import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Achievement, Statistics } from '../../types/game';
import { createAchievements, checkAchievementCompletion } from '../../utils/achievementUtils';

interface AchievementState {
  achievements: Achievement[];
  recentlyCompletedAchievements: Achievement[];
}

const initialState: AchievementState = {
  achievements: createAchievements(),
  recentlyCompletedAchievements: []
};

export const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    // Check achievements against current statistics
    checkAchievements: (state, action: PayloadAction<Statistics>) => {
      const statistics = action.payload;
      const newlyCompleted: Achievement[] = [];
      
      state.achievements.forEach(achievement => {
        if (!achievement.completed && checkAchievementCompletion(achievement, statistics)) {
          // Mark as completed
          achievement.completed = true;
          achievement.completedAt = Date.now();
          
          // Add to newly completed list
          newlyCompleted.push(achievement);
        }
      });
      
      // Add newly completed achievements to the recently completed list
      if (newlyCompleted.length > 0) {
        state.recentlyCompletedAchievements = [
          ...state.recentlyCompletedAchievements,
          ...newlyCompleted
        ];
      }
    },
    
    // Check a specific achievement
    checkAchievement: (state, action: PayloadAction<{achievementId: string, statistics: Statistics}>) => {
      const { achievementId, statistics } = action.payload;
      const achievement = state.achievements.find(a => a.id === achievementId);
      
      if (achievement && !achievement.completed) {
        // Check if the achievement is completed
        if (checkAchievementCompletion(achievement, statistics)) {
          // Mark the achievement as completed
          achievement.completed = true;
          achievement.completedAt = Date.now();
          
          // Add to recently completed achievements
          state.recentlyCompletedAchievements.push(achievement);
        }
      }
    },
    
    // Mark an achievement as seen and remove from recent completions
    acknowledgeAchievement: (state, action: PayloadAction<string>) => {
      const achievementId = action.payload;
      state.recentlyCompletedAchievements = state.recentlyCompletedAchievements.filter(
        a => a.id !== achievementId
      );
    },
    
    // Add a new achievement
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const newAchievement = action.payload;
      state.achievements.push(newAchievement);
    },
    
    // Reset the recent achievements (e.g., after awarding points)
    clearRecentAchievements: (state) => {
      state.recentlyCompletedAchievements = [];
    },
    
    // Action to help deserialize saved state
    updateAchievementState: (state, action: PayloadAction<Partial<AchievementState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

export const { 
  checkAchievements, 
  checkAchievement, 
  acknowledgeAchievement,
  addAchievement,
  clearRecentAchievements,
  updateAchievementState
} = achievementSlice.actions;

export default achievementSlice.reducer; 