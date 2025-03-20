import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityAPI } from './activityAPI';

export const ACTIVITY_TYPES = {
  TASK: {
    id: 'task',
    label: 'Task Completion',
    icon: 'CheckCircle',
    pointRange: { min: 5, max: 20 }
  },
  LOGIN: {
    id: 'login',
    label: 'Daily Login',
    icon: 'Calendar',
    pointRange: { min: 5, max: 5 }
  },
  CONTENT: {
    id: 'content',
    label: 'Content Creation',
    icon: 'FileText',
    pointRange: { min: 10, max: 50 }
  },
  COMMUNITY: {
    id: 'community',
    label: 'Community Engagement',
    icon: 'Users',
    pointRange: { min: 5, max: 15 }
  }
};

const initialState = {
  activities: [],
  filteredActivities: [],
  currentFilter: 'all',
  status: 'idle',
  error: null,
  stats: {
    totalPoints: 0,
    activityCounts: {
      task: 0,
      login: 0,
      content: 0,
      community: 0
    }
  }
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async () => {
    return await activityAPI.getActivities();
  }
);

export const logNewActivity = createAsyncThunk(
  'activities/logNewActivity',
  async (activity) => {
    return await activityAPI.logActivity(activity);
  }
);

const calculateStats = (activities) => {
  const stats = {
    totalPoints: 0,
    activityCounts: {
      task: 0,
      login: 0,
      content: 0,
      community: 0
    }
  };

  activities.forEach(activity => {
    stats.totalPoints += activity.points;
    stats.activityCounts[activity.type] = (stats.activityCounts[activity.type] || 0) + 1;
  });

  return stats;
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    filterActivities: (state, action) => {
      state.currentFilter = action.payload;
      if (action.payload === 'all') {
        state.filteredActivities = state.activities;
      } else {
        state.filteredActivities = state.activities.filter(
          activity => activity.type === action.payload
        );
      }
    },
    sortActivities: (state, action) => {
      const { field, direction } = action.payload;
      state.filteredActivities = [...state.filteredActivities].sort((a, b) => {
        if (field === 'timestamp') {
          return direction === 'asc'
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
        }
        if (field === 'points') {
          return direction === 'asc'
            ? a.points - b.points
            : b.points - a.points;
        }
        return 0;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activities = action.payload.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        state.filteredActivities = state.activities;
        state.stats = calculateStats(state.activities);
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logNewActivity.fulfilled, (state, action) => {
        const newActivity = action.payload.activity;
        state.activities.unshift(newActivity);
        
        if (state.currentFilter === 'all') {
          state.filteredActivities = state.activities;
        } else {
          state.filteredActivities = state.activities.filter(
            activity => activity.type === state.currentFilter
          );
        }
        
        state.stats = calculateStats(state.activities);
      });
  }
});

export const { filterActivities, sortActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;