import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Navbar from './components/layout/Navbar';
import Dashboard from './features/dashboard/Dashboard';
import UserProfile from './features/users/UserProfile';
import RewardsMarketplace from './features/rewards/RewardsMarketplace';
import ActivityFeed from './features/activities/ActivityFeed';
import AdminDashboard from './features/admin/AdminDashboard';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/rewards" element={<RewardsMarketplace />} />
              <Route path="/activities" element={<ActivityFeed />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;