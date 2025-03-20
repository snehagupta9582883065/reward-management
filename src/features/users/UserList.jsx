import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Award } from 'lucide-react';
import { useDebounce } from '../../app/hooks';

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useSelector((state) => state.users.leaderboard);

  const handleSearch = useDebounce((value) => {
    console.log('Searching for:', value);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.rank}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{user.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;