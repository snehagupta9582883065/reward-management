import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Filter, Search, Gift, AlertCircle } from 'lucide-react';
import { fetchRewards, setFilters, applyRewardsFilter } from './rewardsSlice';
import RewardsList from './RewardsList';
import ShoppingCartComponent from './ShoppingCart';

function RewardsMarketplace() {
  const dispatch = useDispatch();
  const { filters, cart, status } = useSelector((state) => state.rewards);
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(applyRewardsFilter());
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
    dispatch(applyRewardsFilter());
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sort: e.target.value }));
    dispatch(applyRewardsFilter());
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Gift className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Rewards Marketplace</h1>
        </div>
        <button 
          className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          onClick={toggleCart}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          <span>Cart</span>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <form 
            className="flex-1"
            onSubmit={handleSearchSubmit}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rewards..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="border rounded-lg px-3 py-2"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                <option value="all">All Categories</option>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
                <option value="experience">Experience</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort:</span>
              <select
                className="border rounded-lg px-3 py-2"
                value={filters.sort}
                onChange={handleSortChange}
              >
                <option value="points-asc">Points: Low to High</option>
                <option value="points-desc">Points: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">

        <div className="flex-1">
          <RewardsList />
        </div>

        {isCartOpen && (
          <div className="w-full lg:w-96 bg-white rounded-xl shadow-md p-6">
            <ShoppingCartComponent onClose={toggleCart} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RewardsMarketplace;