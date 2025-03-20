// rewardsAPI.js
const BASE_URL = '/api/rewards';

export const rewardsAPI = {
  getRewards: async (filters = {}) => {
    // In a real implementation, these parameters would be added to the request
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.sort) {
      queryParams.append('sort', filters.sort);
    }
    
    // Simulated API call with more comprehensive data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Premium Subscription',
            points: 500,
            category: 'digital',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300',
            description: 'One month of premium access to all features',
            availability: 'In Stock',
            expiryDays: 30
          },
          {
            id: 2,
            name: 'Company Swag Box',
            points: 1000,
            category: 'physical',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300',
            description: 'T-shirt, stickers, and other branded merchandise',
            availability: 'Limited Stock',
            shippingDays: '3-5'
          },
          {
            id: 3,
            name: 'Virtual Meeting with CEO',
            points: 2000,
            category: 'experience',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300',
            description: '30-minute virtual meeting with company CEO',
            availability: 'By Appointment',
            bookingWindow: '14 days'
          },
          {
            id: 4,
            name: 'Noise Cancelling Headphones',
            points: 3500,
            category: 'physical',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
            description: 'High-quality wireless headphones for focused work',
            availability: 'In Stock',
            shippingDays: '5-7'
          },
          {
            id: 5,
            name: 'Online Course Credit',
            points: 1200,
            category: 'digital',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300',
            description: 'Credit for professional development courses',
            availability: 'In Stock',
            expiryDays: 90
          },
          {
            id: 6,
            name: 'Charity Donation',
            points: 500,
            category: 'experience',
            image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=300',
            description: 'Donate to a charity of your choice',
            availability: 'Always Available'
          }
        ]);
      }, 500);
    });
  },

  getRewardById: async (id) => {
    // Simulated API call for single reward
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          name: id === '1' ? 'Premium Subscription' : 'Company Swag Box',
          points: id === '1' ? 500 : 1000,
          category: id === '1' ? 'digital' : 'physical',
          image: id === '1' 
            ? 'https://images.unsplash.com/photo-1526741720177-6e9c1f6c2c08?w=300'
            : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300',
          description: id === '1' 
            ? 'One month of premium access to all features'
            : 'T-shirt, stickers, and other branded merchandise',
          longDescription: id === '1'
            ? 'Enjoy premium access to all platform features for a full month. Includes priority support, unlimited exports, and advanced analytics.'
            : 'A curated box of company-branded merchandise including a high-quality t-shirt, laptop stickers, notebook, and water bottle.',
          availability: id === '1' ? 'In Stock' : 'Limited Stock',
          details: id === '1' 
            ? { expiryDays: 30, activationSteps: '1. Redeem code, 2. Activate in account settings' }
            : { shippingDays: '3-5', sizes: ['S', 'M', 'L', 'XL'] }
        });
      }, 300);
    });
  },

  redeemReward: async (rewardIds, userDetails) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          items: rewardIds.length,
          redemptionDate: new Date().toISOString(),
          status: 'Processing'
        });
      }, 800);
    });
  },

  getRedemptionHistory: async () => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'ORD-193842',
            date: '2025-03-15T14:23:11Z',
            items: [
              { id: 1, name: 'Premium Subscription', status: 'Completed' }
            ],
            totalPoints: 500,
            status: 'Completed'
          },
          {
            id: 'ORD-183756',
            date: '2025-02-28T09:45:22Z',
            items: [
              { id: 2, name: 'Company Swag Box', status: 'Shipped' },
              { id: 6, name: 'Charity Donation', status: 'Completed' }
            ],
            totalPoints: 1500,
            status: 'Partial'
          }
        ]);
      }, 600);
    });
  }
};