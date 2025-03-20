import React from 'react';
import { useSelector } from 'react-redux';
import { Medal, Clock, Award } from 'lucide-react';

function UserProfile() {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-600 mt-2">Member since January 2024</p>
            <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
              <span className="flex items-center text-blue-600">
                <Medal className="w-5 h-5 mr-1" />
                {currentUser.rank}
              </span>
              <span className="flex items-center text-green-600">
                <Award className="w-5 h-5 mr-1" />
                {currentUser.points} Points
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Activity History</h2>
        <div className="space-y-4">
          {[
            { activity: 'Completed Daily Login', points: 5, date: '2024-03-10' },
            { activity: 'Created Blog Post', points: 50, date: '2024-03-09' },
            { activity: 'Helped Community Member', points: 15, date: '2024-03-08' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-semibold">{item.activity}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+{item.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;