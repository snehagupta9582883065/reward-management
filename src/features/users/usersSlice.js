import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {
    id: 1,
    name: 'John Doe',
    points: 1500,
    rank: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  leaderboard: [
    { id: 1, name: 'John Doe', points: 1500, rank: 'Gold' },
    { id: 2, name: 'Jane Smith', points: 1200, rank: 'Silver' },
    { id: 3, name: 'Bob Johnson', points: 900, rank: 'Bronze' },
    { id: 4, name: 'Alice Williams', points: 850, rank: 'Bronze' },
    { id: 5, name: 'Charlie Brown', points: 780, rank: 'Bronze' },
    { id: 6, name: 'Diana Prince', points: 720, rank: 'Bronze' },
  ],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Simulated API call
  return initialState.leaderboard;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updatePoints: (state, action) => {
      state.currentUser.points += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaderboard = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.users.currentUser;

export const selectLeaderboard = (state) => state.users.leaderboard;

export const selectTopUsers = createSelector(
  [selectLeaderboard],
  (leaderboard) => [...leaderboard].sort((a, b) => b.points - a.points)
);

export const selectLoadingStatus = (state) => state.users.status;

export const selectError = (state) => state.users.error;

export const { updatePoints } = usersSlice.actions;
export default usersSlice.reducer;