const BASE_URL = '/api/activities';

const mockActivities = [
  {
    id: 1,
    type: 'task',
    title: 'Completed Project Milestone',
    description: 'Finished implementing the user authentication system',
    points: 20,
    timestamp: '2024-03-10T10:30:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    verified: true
  },
  {
    id: 2,
    type: 'login',
    title: 'Daily Login Streak: Day 5',
    description: 'Maintained login streak for 5 consecutive days',
    points: 5,
    timestamp: '2024-03-10T09:00:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    streak: 5,
    verified: true
  },
  {
    id: 3,
    type: 'content',
    title: 'Published Blog Post',
    description: 'Published "Top 10 JavaScript Tips for 2024"',
    points: 50,
    timestamp: '2024-03-09T15:20:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    contentUrl: '/blog/javascript-tips-2024',
    verified: true
  },
  {
    id: 4,
    type: 'community',
    title: 'Answered Forum Question',
    description: 'Helped a new developer with React hooks',
    points: 15,
    timestamp: '2024-03-08T14:25:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    threadUrl: '/forum/react-hooks-question',
    verified: true
  },
  {
    id: 5,
    type: 'login',
    title: 'Daily Login Streak: Day 4',
    description: 'Maintained login streak for 4 consecutive days',
    points: 5,
    timestamp: '2024-03-09T08:45:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    streak: 4,
    verified: true
  },
  {
    id: 6,
    type: 'task',
    title: 'Fixed Critical Bug',
    description: 'Resolved the payment processing issue',
    points: 15,
    timestamp: '2024-03-07T11:30:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    verified: true
  },
  {
    id: 7,
    type: 'community',
    title: 'Organized Community Meetup',
    description: 'Organized and hosted a JavaScript developers meetup',
    points: 10,
    timestamp: '2024-03-06T18:00:00',
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    verified: true
  }
];

const calculateStreakBonus = (streak) => {
  if (streak % 7 === 0) return 15;
  if (streak % 30 === 0) return 50;
  return 0;
};

export const activityAPI = {
  getActivities: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockActivities);
      }, 500);
    });
  },

  logActivity: async (activity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newActivity = { 
          ...activity, 
          id: Date.now(),
          timestamp: new Date().toISOString(),
          verified: activity.type === 'login' ? true : false,
          userName: 'John Doe', 
          userAvatar: '/avatars/john.jpg',
        };
        
        if (activity.type === 'login') {
          const currentStreak = 6; 
          newActivity.streak = currentStreak;
          newActivity.title = `Daily Login Streak: Day ${currentStreak}`;
          
          const bonusPoints = calculateStreakBonus(currentStreak);
          if (bonusPoints > 0) {
            newActivity.points += bonusPoints;
            newActivity.description = `Maintained login streak for ${currentStreak} days! Bonus: +${bonusPoints} points`;
          } else {
            newActivity.description = `Maintained login streak for ${currentStreak} consecutive days`;
          }
        }
        
        resolve({ success: true, activity: newActivity });
      }, 500);
    });
  },

  verifyActivity: async (activityId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, activityId });
      }, 500);
    });
  },

  getActivityStats: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalPoints: mockActivities.reduce((sum, act) => sum + act.points, 0),
          totalActivities: mockActivities.length,
          streak: 6,
          activityBreakdown: {
            task: mockActivities.filter(a => a.type === 'task').length,
            login: mockActivities.filter(a => a.type === 'login').length,
            content: mockActivities.filter(a => a.type === 'content').length,
            community: mockActivities.filter(a => a.type === 'community').length,
          }
        });
      }, 500);
    });
  }
};