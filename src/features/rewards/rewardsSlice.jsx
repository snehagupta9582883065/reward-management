import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rewardsAPI } from './rewardsAPI';

const initialState = {
  rewards: [],
  filteredRewards: [],
  currentReward: null,
  redemptionHistory: [],
  cart: [],
  filters: {
    category: 'all',
    search: '',
    sort: 'points-asc'
  },
  status: {
    rewards: 'idle',
    currentReward: 'idle',
    redemption: 'idle',
    history: 'idle'
  },
  error: null
};

export const fetchRewards = createAsyncThunk(
  'rewards/fetchRewards',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().rewards;
      const data = await rewardsAPI.getRewards(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRewardDetails = createAsyncThunk(
  'rewards/fetchRewardDetails',
  async (rewardId, { rejectWithValue }) => {
    try {
      const data = await rewardsAPI.getRewardById(rewardId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const redeemRewards = createAsyncThunk(
  'rewards/redeemRewards',
  async ({ rewardIds, userDetails }, { rejectWithValue }) => {
    try {
      const result = await rewardsAPI.redeemReward(rewardIds, userDetails);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRedemptionHistory = createAsyncThunk(
  'rewards/fetchRedemptionHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await rewardsAPI.getRedemptionHistory();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    applyRewardsFilter: (state) => {
      let filtered = [...state.rewards];

      // Apply category filter
      if (state.filters.category && state.filters.category !== 'all') {
        filtered = filtered.filter(reward => reward.category === state.filters.category);
      }

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(reward =>
          reward.name.toLowerCase().includes(searchLower) ||
          reward.description.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (state.filters.sort) {
        switch (state.filters.sort) {
          case 'points-asc':
            filtered.sort((a, b) => a.points - b.points);
            break;
          case 'points-desc':
            filtered.sort((a, b) => b.points - a.points);
            break;
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            break;
        }
      }

      state.filteredRewards = filtered;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch rewards cases
      .addCase(fetchRewards.pending, (state) => {
        state.status.rewards = 'loading';
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.status.rewards = 'succeeded';
        state.rewards = action.payload;
        state.error = null;
        // Apply filters to the newly fetched rewards
        state.filteredRewards = [...action.payload];
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.status.rewards = 'failed';
        state.error = action.payload;
      })

      // Fetch reward details cases
      .addCase(fetchRewardDetails.pending, (state) => {
        state.status.currentReward = 'loading';
      })
      .addCase(fetchRewardDetails.fulfilled, (state, action) => {
        state.status.currentReward = 'succeeded';
        state.currentReward = action.payload;
        state.error = null;
      })
      .addCase(fetchRewardDetails.rejected, (state, action) => {
        state.status.currentReward = 'failed';
        state.error = action.payload;
      })

      // Redeem rewards cases
      .addCase(redeemRewards.pending, (state) => {
        state.status.redemption = 'loading';
      })
      .addCase(redeemRewards.fulfilled, (state, action) => {
        state.status.redemption = 'succeeded';
        state.cart = [];
        state.error = null;
      })
      .addCase(redeemRewards.rejected, (state, action) => {
        state.status.redemption = 'failed';
        state.error = action.payload;
      })

      // Fetch redemption history cases
      .addCase(fetchRedemptionHistory.pending, (state) => {
        state.status.history = 'loading';
      })
      .addCase(fetchRedemptionHistory.fulfilled, (state, action) => {
        state.status.history = 'succeeded';
        state.redemptionHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchRedemptionHistory.rejected, (state, action) => {
        state.status.history = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  applyRewardsFilter
} = rewardsSlice.actions;

export default rewardsSlice.reducer;