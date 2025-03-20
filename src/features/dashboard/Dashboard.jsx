import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Award, Target, TrendingUp, Calendar, Activity,
  Search, Filter, ChevronRight, Clock, ChevronDown, X, History
} from 'lucide-react';
import { fetchUsers } from '../users/usersSlice';
import { fetchActivities } from '../activities/activitiesSlice';
import { formatDistanceToNow, format } from 'date-fns';

const getActivityIcon = (type) => {
  switch (type) {
    case 'task': return <Activity className="w-4 h-4 text-green-500" />;
    case 'login': return <Calendar className="w-4 h-4 text-blue-500" />;
    case 'content': return <Award className="w-4 h-4 text-purple-500" />;
    case 'community': return <Trophy className="w-4 h-4 text-amber-500" />;
    default: return <Activity className="w-4 h-4 text-gray-500" />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'task': return 'green';
    case 'login': return 'blue';
    case 'content': return 'purple';
    case 'community': return 'amber';
    default: return 'gray';
  }
};

const useFilteredLeaderboard = (leaderboard, searchTerm, filterCriteria, limit = 5) => {
  return useMemo(() => {
    let filtered = [...leaderboard];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.rank.toLowerCase().includes(term)
      );
    }

    if (filterCriteria.rank) {
      filtered = filtered.filter(user => user.rank === filterCriteria.rank);
    }

    filtered = filtered.sort((a, b) => b.points - a.points);

    return limit ? filtered.slice(0, limit) : filtered;
  }, [leaderboard, searchTerm, filterCriteria, limit]);
};

const useFilteredActivities = (activities, userId, limit = 5) => {
  return useMemo(() =>
    activities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit),
    [activities, userId, limit]
  );
};

const DashboardHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24" />
      <div className="px-6 py-6 relative">
        <div className="absolute -top-12 left-6 border-4 border-white rounded-full overflow-hidden shadow-lg">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
            alt={user.name}
            className="w-24 h-24 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
            }}
          />
        </div>
        <div className="md:ml-28 mt-12 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {user.rank}
                </span>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+125 pts this week</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/rewards')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Redeem Points
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, progressValue }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-800">{value}</h3>
          {trend && trendValue && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className={`w-4 h-4 text-${trend === 'up' ? 'green' : 'red'}-500`} />
              <span className={`text-${trend === 'up' ? 'green' : 'red'}-600 font-medium`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
      {progressValue !== undefined && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${color}-600 h-2 rounded-full`}
            style={{ width: `${Math.min(100, progressValue)}%` }}
          />
        </div>
      )}
    </div>
  );
};

const SearchAndFilter = ({ searchTerm, setSearchTerm, filterCriteria, setFilterCriteria }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const rankOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`p-2 rounded-lg flex items-center ${showFilterMenu || Object.values(filterCriteria).some(Boolean) ? 'bg-blue-100 text-blue-700' : 'bg-white hover:bg-gray-100 text-gray-700'} border border-gray-200`}
        >
          <Filter className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Filter</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>

        {showFilterMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-100">
            <div className="p-4">
              <h3 className="font-medium text-gray-700 mb-2">Filter by Rank</h3>
              <div className="space-y-2">
                {rankOptions.map(rank => (
                  <div key={rank} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rank-${rank}`}
                      checked={filterCriteria.rank === rank}
                      onChange={() => setFilterCriteria(prev => ({
                        ...prev,
                        rank: prev.rank === rank ? null : rank
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <label htmlFor={`rank-${rank}`} className="text-sm text-gray-700">
                      {rank}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    setFilterCriteria({});
                    setShowFilterMenu(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {Object.values(filterCriteria).some(Boolean) && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
            {Object.values(filterCriteria).filter(Boolean).length}
          </div>
        )}
      </div>
    </div>
  );
};

const UserLeaderboard = ({ users, currentUserId, searchTerm, setSearchTerm, filterCriteria, setFilterCriteria }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCriteria={filterCriteria}
          setFilterCriteria={setFilterCriteria}
        />
      </div>

      {users.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCriteria({});
            }}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${user.id === currentUserId ? 'bg-blue-50' : ''
                }`}
            >
              <div className="w-10 text-center">
                <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                  {index < 3 ? (
                    <Trophy className={`w-5 h-5 mx-auto ${index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                          'text-amber-700'
                      }`} />
                  ) : (
                    `#${index + 1}`
                  )}
                </span>
              </div>
              <div className="ml-4 flex-1 flex items-center">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                  }}
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.rank}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-gray-800">{user.points}</span>
                  <span className="text-xs text-gray-500 ml-1">pts</span>
                </div>
                {user.id === currentUserId && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    You
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-gray-50 text-center">
        <button
          onClick={() => navigate('/leaderboard')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          See Full Leaderboard
        </button>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => {

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      {activities.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p>No recent activities</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg bg-${getActivityColor(activity.type)}-100 mr-4`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <span className={`text-${getActivityColor(activity.type)}-600 font-bold`}>
                      +{activity.points} pts
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PointHistory = ({ pointHistory }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <History className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Point History</h2>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {pointHistory.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p>No point history available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Running Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-1 rounded-md bg-${getActivityColor(entry.type)}-100 mr-2`}>
                        {getActivityIcon(entry.type)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{entry.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-${entry.points > 0 ? 'green' : 'red'}-600 font-medium`}>
                      {entry.points > 0 ? '+' : ''}{entry.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.runningTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const calculatePointHistory = (activities) => {
  const history = [];
  let runningTotal = 0;

  const sortedActivities = [...activities].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  sortedActivities.forEach(activity => {
    runningTotal += activity.points;
    history.push({
      id: activity.id,
      timestamp: activity.timestamp,
      description: activity.title,
      type: activity.type,
      points: activity.points,
      runningTotal
    });
  });
  return history.reverse();
};

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({});

  const { currentUser, leaderboard, status: userStatus } = useSelector(state => state.users);
  const { activities, status: activityStatus } = useSelector(state => state.activities);

  const topUsers = useFilteredLeaderboard(leaderboard, searchTerm, filterCriteria);
  const userActivities = useFilteredActivities(activities, currentUser.id);

  const pointHistory = useMemo(() =>
    calculatePointHistory(userActivities),
    [userActivities]
  );

  const nextMilestone = 2000;
  const milestoneProgress = Math.round((currentUser.points / nextMilestone) * 100);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
    if (activityStatus === 'idle') {
      dispatch(fetchActivities());
    }
  }, [dispatch, userStatus, activityStatus]);

  if (userStatus === 'loading' || activityStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <DashboardHeader user={currentUser} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Current Rank"
          value={currentUser.rank}
          icon={Trophy}
          color="blue"
          trend="up"
          trendValue="Up 2 places"
        />
        <StatCard
          title="Total Points"
          value={currentUser.points}
          icon={Award}
          color="green"
          trend="up"
          trendValue="+230 this month"
        />
        <StatCard
          title="Next Milestone"
          value={nextMilestone}
          icon={Target}
          color="purple"
          progressValue={milestoneProgress}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserLeaderboard
          users={topUsers}
          currentUserId={currentUser.id}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCriteria={filterCriteria}
          setFilterCriteria={setFilterCriteria}
        />
        <ActivityFeed activities={userActivities} />
      </div>
      <PointHistory pointHistory={pointHistory} />
    </div>
  );
}

export default React.memo(Dashboard);