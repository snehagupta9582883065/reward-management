const BASE_URL = '/api/users';

export const userAPI = {
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'John Doe',
            points: 1500,
            rank: 'Gold',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          },
          {
            id: 2,
            name: 'Jane Smith',
            points: 1200,
            rank: 'Silver',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
          },
          {
            id: 3,
            name: 'Bob Johnson',
            points: 900,
            rank: 'Bronze',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
          },
        ]);
      }, 500);
    });
  },

  updateUser: async (userId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  getUserPoints: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ points: 1500 });
      }, 500);
    });
  },
};