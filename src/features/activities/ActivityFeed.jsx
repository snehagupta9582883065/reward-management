import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  Filter,
  Award,
  CheckCircle,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
  BarChart2,
  RefreshCw,
  Plus,
  Search
} from 'lucide-react';
import {
  fetchActivities,
  logNewActivity,
  filterActivities,
  sortActivities,
  ACTIVITY_TYPES
} from './activitiesSlice';

const ActivityDashboard = () => {
  const dispatch = useDispatch();
  const {
    filteredActivities,
    status,
    stats,
    currentFilter
  } = useSelector(state => state.activities);

  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [sortOption, setSortOption] = useState({ field: 'timestamp', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchActivities());
    }
  }, [status, dispatch]);

  const handleFilterChange = (filterValue) => {
    dispatch(filterActivities(filterValue));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let newSort;

    if (value === 'recent') {
      newSort = { field: 'timestamp', direction: 'desc' };
    } else if (value === 'oldest') {
      newSort = { field: 'timestamp', direction: 'asc' };
    } else if (value === 'points-high') {
      newSort = { field: 'points', direction: 'desc' };
    } else if (value === 'points-low') {
      newSort = { field: 'points', direction: 'asc' };
    }

    setSortOption(newSort);
    dispatch(sortActivities(newSort));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'login':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'content':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'community':
        return <Users className="w-5 h-5 text-orange-500" />;
      default:
        return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredBySearch = searchQuery
    ? filteredActivities.filter(activity =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredActivities;

  return (
    <div className="space-y-6">
      <ActivityStats stats={stats} />
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Activity Feed</h2>
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {filteredActivities.length} Activities
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search activities..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full sm:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                  value={currentFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="task">Tasks</option>
                  <option value="login">Logins</option>
                  <option value="content">Content</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-gray-600" />
                <select
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                  value={
                    sortOption.field === 'timestamp'
                      ? (sortOption.direction === 'desc' ? 'recent' : 'oldest')
                      : (sortOption.direction === 'desc' ? 'points-high' : 'points-low')
                  }
                  onChange={handleSortChange}
                >
                  <option value="recent">Recent First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="points-high">Highest Points</option>
                  <option value="points-low">Lowest Points</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowNewActivityModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="space-y-4">
        {status === 'loading' ? (
          <div className="text-center py-10">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading activities...</p>
          </div>
        ) : filteredBySearch.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-md">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto" />
            <p className="mt-2 text-gray-600">No activities found</p>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        ) : (
          filteredBySearch.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
      {showNewActivityModal && (
        <NewActivityModal
          onClose={() => setShowNewActivityModal(false)}
          onSubmit={(activityData) => {
            dispatch(logNewActivity(activityData));
            setShowNewActivityModal(false);
          }}
        />
      )}
    </div>
  );
};

const ActivityCard = ({ activity }) => {
  const getActivityTypeStyles = (type) => {
    switch (type) {
      case 'task':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'login':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'content':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'community':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
            alt={activity.userName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{activity.userName}</h3>
              <span className={`px-2 py-0.5 text-xs rounded border ${getActivityTypeStyles(activity.type)}`}>
                {ACTIVITY_TYPES[activity.type.toUpperCase()]?.label || activity.type}
              </span>
            </div>
            <span className="flex items-center text-green-600 font-bold whitespace-nowrap">
              <Award className="w-4 h-4 mr-1" />
              +{activity.points} pts
            </span>
          </div>
          <div className="mt-1">
            <p className="font-medium text-gray-800">{activity.title}</p>
            {activity.description && (
              <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(activity.timestamp)}
            </span>
            {activity.contentUrl && (
              <a
                href={activity.contentUrl}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                View Content
              </a>
            )}
            {activity.threadUrl && (
              <a
                href={activity.threadUrl}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                View Thread
              </a>
            )}
            {activity.streak && (
              <span className="flex items-center text-sm text-orange-600">
                <Calendar className="w-4 h-4 mr-1" />
                {activity.streak} day streak
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium opacity-90">Total Points</h3>
          <Award className="w-8 h-8 opacity-80" />
        </div>
        <p className="text-3xl font-bold mt-2">{stats.totalPoints}</p>
        <div className="mt-4 text-sm opacity-80">
          From all activities
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-700">Current Streak</h3>
          <Calendar className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-3xl font-bold mt-2 text-gray-900">6 days</p>
        <div className="mt-4 text-sm text-gray-500">
          Keep logging in daily!
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-700">Activities Completed</h3>
          <CheckCircle className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-3xl font-bold mt-2 text-gray-900">{Object.values(stats.activityCounts).reduce((a, b) => a + b, 0)}</p>
        <div className="mt-4 text-sm text-gray-500">
          Across all categories
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-700">Activity Breakdown</h3>
          <BarChart2 className="w-8 h-8 text-purple-500" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 text-blue-500 mr-1" /> Tasks
            </span>
            <span className="text-sm font-medium">{stats.activityCounts.task || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 text-green-500 mr-1" /> Logins
            </span>
            <span className="text-sm font-medium">{stats.activityCounts.login || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <FileText className="w-4 h-4 text-purple-500 mr-1" /> Content
            </span>
            <span className="text-sm font-medium">{stats.activityCounts.content || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <Users className="w-4 h-4 text-orange-500 mr-1" /> Community
            </span>
            <span className="text-sm font-medium">{stats.activityCounts.community || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewActivityModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'task',
    title: '',
    description: '',
    points: 5
  });

  const activityTypesList = [
    { id: 'task', label: 'Task Completion', icon: CheckCircle, color: 'text-blue-500', points: { min: 5, max: 20 } },
    { id: 'login', label: 'Daily Login', icon: Calendar, color: 'text-green-500', points: { min: 5, max: 5 } },
    { id: 'content', label: 'Content Creation', icon: FileText, color: 'text-purple-500', points: { min: 10, max: 50 } },
    { id: 'community', label: 'Community Engagement', icon: Users, color: 'text-orange-500', points: { min: 5, max: 15 } }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      const activityType = activityTypesList.find(type => type.id === value);
      setFormData({
        ...formData,
        [name]: value,
        points: activityType.points.min
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getCurrentActivityType = () => {
    return activityTypesList.find(type => type.id === formData.type);
  };

  const currentType = getCurrentActivityType();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Log New Activity</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activityTypesList.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${formData.type === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                          }`}
                        onClick={() => handleChange({ target: { name: 'type', value: type.id } })}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-5 h-5 ${type.color}`} />
                          <span className="font-medium text-gray-800">{type.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What did you accomplish?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about your activity..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
                />
              </div>

              {formData.type !== 'login' && (
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                    Points ({formData.points})
                  </label>
                  <input
                    type="range"
                    id="points"
                    name="points"
                    min={currentType.points.min}
                    max={currentType.points.max}
                    value={formData.points}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{currentType.points.min}</span>
                    <span>{currentType.points.max}</span>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
                >
                  Log Activity
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ActivityManagement = () => {
  return (
    <div className="container mx-auto py-4 max-w-6xl">
      {/* <h1 className="text-2xl md:text-3xl font-bold mb-8">Activity Management</h1> */}
      <ActivityDashboard />
    </div>
  );
};

export default ActivityManagement;