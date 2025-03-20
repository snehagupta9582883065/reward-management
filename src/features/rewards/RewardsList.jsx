import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Gift, ShoppingCart, Tag, AlertTriangle } from 'lucide-react';
import { fetchRewards, applyRewardsFilter, addToCart } from './rewardsSlice';

function RewardsList() {
  const dispatch = useDispatch();
  const {
    filteredRewards,
    status,
    error,
    filters
  } = useSelector((state) => state.rewards);
  const { points: userPoints } = useSelector((state) => state.users);

  useEffect(() => {
    if (status.rewards === 'idle') {
      dispatch(fetchRewards());
    }
  }, [status.rewards, dispatch]);

  useEffect(() => {
    dispatch(applyRewardsFilter());
  }, [filters, dispatch]);

  const handleAddToCart = (reward) => {
    dispatch(addToCart(reward));
  };

  const getCategoryBadge = (category) => {
    let color;
    switch (category) {
      case 'digital':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'physical':
        color = 'bg-green-100 text-green-800';
        break;
      case 'experience':
        color = 'bg-orange-100 text-orange-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}>
        <Tag className="w-3 h-3 mr-1" />
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  if (status.rewards === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status.rewards === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertTriangle className="w-12 h-12 mb-2" />
        <p>Failed to load rewards: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => dispatch(fetchRewards())}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredRewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Gift className="w-12 h-12 mb-2" />
        <p>No rewards found matching your criteria.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => dispatch(setFilters({ category: 'all', search: '' }))}
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRewards.map((reward) => {
        const isAffordable = userPoints >= reward.points;

        return (
          <div
            key={reward.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                {getCategoryBadge(reward.category)}
              </div>
              {!isAffordable && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {reward.points - userPoints} more points needed
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <h3 className="text-xl font-bold truncate">{reward.name}</h3>
              </div>
              <p className="text-gray-600 mt-2 h-12 overflow-hidden">
                {reward.description}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {reward.availability}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-blue-600">{reward.points} points</span>
                <div className="flex space-x-2">
                  <Link
                    to={`/rewards/${reward.id}`}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Details
                  </Link>
                  <button
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleAddToCart(reward)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RewardsList;