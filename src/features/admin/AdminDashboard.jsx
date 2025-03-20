import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // State for different entities
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState({
    pointDistribution: [],
    redemptionTrends: []
  });
  const [activeTab, setActiveTab] = useState('users');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', points: 1250 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', points: 850 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', points: 2100 },
    ]);
    
    setRewards([
      { id: 1, name: 'Gift Card', points: 500, available: 25 },
      { id: 2, name: 'Premium Subscription', points: 1000, available: 10 },
      { id: 3, name: 'Product Discount', points: 300, available: 50 },
    ]);
    
    setCampaigns([
      { id: 1, name: 'Summer Special', startDate: '2025-06-01', endDate: '2025-08-31', active: true },
      { id: 2, name: 'New User Bonus', startDate: '2025-01-01', endDate: '2025-12-31', active: true },
      { id: 3, name: 'Holiday Promotion', startDate: '2025-11-15', endDate: '2025-12-25', active: false },
    ]);
    
    setAnalytics({
      pointDistribution: [
        { month: 'Jan', earned: 4500, redeemed: 3200 },
        { month: 'Feb', earned: 5200, redeemed: 3800 },
        { month: 'Mar', earned: 6100, redeemed: 4500 },
      ],
      redemptionTrends: [
        { reward: 'Gift Card', count: 48 },
        { reward: 'Premium Subscription', count: 24 },
        { reward: 'Product Discount', count: 72 },
      ]
    });
  }, []);

  const handleCreate = (entityType) => {
    setSelectedEntity(entityType);
    setIsFormOpen(true);
    setFormData({});
  };

  const handleEdit = (entityType, item) => {
    setSelectedEntity(entityType);
    setIsFormOpen(true);
    setFormData(item);
  };

  const handleDelete = (entityType, id) => {
    switch(entityType) {
      case 'users':
        setUsers(users.filter(user => user.id !== id));
        break;
      case 'rewards':
        setRewards(rewards.filter(reward => reward.id !== id));
        break;
      case 'campaigns':
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = Math.floor(Math.random() * 1000);
    
    switch(selectedEntity) {
      case 'users':
        if (formData.id) {
          setUsers(users.map(user => user.id === formData.id ? formData : user));
        } else {
          setUsers([...users, { ...formData, id: newId }]);
        }
        break;
      case 'rewards':
        if (formData.id) {
          setRewards(rewards.map(reward => reward.id === formData.id ? formData : reward));
        } else {
          setRewards([...rewards, { ...formData, id: newId }]);
        }
        break;
      case 'campaigns':
        if (formData.id) {
          setCampaigns(campaigns.map(campaign => campaign.id === formData.id ? formData : campaign));
        } else {
          setCampaigns([...campaigns, { ...formData, id: newId, active: true }]);
        }
        break;
      default:
        break;
    }
    
    setIsFormOpen(false);
  };

  const handlePointAdjustment = (userId, points, reason) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, points: user.points + parseInt(points) };
      }
      return user;
    }));

    console.log(`Adjusted ${points} points for user ${userId}. Reason: ${reason}`);
  };

  const renderForm = () => {
    if (!isFormOpen) return null;
    
    switch(selectedEntity) {
      case 'users':
        return (
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  className="w-full p-2 border rounded"
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="email" 
                  value={formData.email || ''} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="number" 
                  value={formData.points || 0} 
                  onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {formData.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'rewards':
        return (
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Edit Reward' : 'Add Reward'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  className="w-full p-2 border rounded"
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points Required</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="number" 
                  value={formData.points || 0} 
                  onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Available Quantity</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="number" 
                  value={formData.available || 0} 
                  onChange={(e) => setFormData({...formData, available: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {formData.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'campaigns':
        return (
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Edit Campaign' : 'Add Campaign'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  className="w-full p-2 border rounded"
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="date" 
                  value={formData.startDate || ''} 
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="date" 
                  value={formData.endDate || ''} 
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                  required 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  checked={formData.active || false} 
                  onChange={(e) => setFormData({...formData, active: e.target.checked})} 
                />
                <label htmlFor="active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {formData.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  // Point adjustment modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({ userId: null, points: 0, reason: '' });

  const renderPointAdjustmentModal = () => {
    if (!isAdjustmentModalOpen) return null;
    
    const user = users.find(u => u.id === adjustmentData.userId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Adjust Points for {user?.name}</h3>
          <form onSubmit={(e) => {
              e.preventDefault();
              handlePointAdjustment(
                adjustmentData.userId, 
                adjustmentData.points, 
                adjustmentData.reason
              );
              setIsAdjustmentModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Points</label>
                <input 
                  className="w-full p-2 border rounded bg-gray-100"
                  value={user?.points || 0} 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adjustment (+ or -)</label>
                <input 
                  className="w-full p-2 border rounded"
                  type="number" 
                  value={adjustmentData.points} 
                  onChange={(e) => setAdjustmentData({...adjustmentData, points: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input 
                  className="w-full p-2 border rounded"
                  value={adjustmentData.reason} 
                  onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})} 
                  required 
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Adjust Points
                </button>
              </div>
            </form>
        </div>
      </div>
    );
  };

  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      className={`px-4 py-2 rounded-t flex items-center gap-2 ${isActive ? 'bg-white border-t border-l border-r' : 'bg-gray-100'}`}
      onClick={() => setActiveTab(id)}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <input 
            className="p-2 border rounded w-64"
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button className="p-2 border rounded">
            🔍
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <TabButton id="users" label="Users" icon="👥" isActive={activeTab === 'users'} />
          <TabButton id="rewards" label="Rewards" icon="🎁" isActive={activeTab === 'rewards'} />
          <TabButton id="campaigns" label="Campaigns" icon="⚙️" isActive={activeTab === 'campaigns'} />
          <TabButton id="analytics" label="Analytics" icon="📊" isActive={activeTab === 'analytics'} />
        </div>
        
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button 
                onClick={() => handleCreate('users')} 
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
              >
                <span>➕</span>
                <span>Add User</span>
              </button>
            </div>
            
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Points</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => 
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.points}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => {
                                setAdjustmentData({ userId: user.id, points: 0, reason: '' });
                                setIsAdjustmentModalOpen(true);
                              }}
                            >
                              Points
                            </button>
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleEdit('users', user)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleDelete('users', user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {selectedEntity === 'users' && renderForm()}
          </div>
        )}
        
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reward Management</h2>
              <button 
                onClick={() => handleCreate('rewards')} 
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
              >
                <span>➕</span>
                <span>Add Reward</span>
              </button>
            </div>
            
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Points Required</th>
                    <th className="text-left p-4">Available</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards
                    .filter(reward => 
                      reward.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(reward => (
                      <tr key={reward.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{reward.name}</td>
                        <td className="p-4">{reward.points}</td>
                        <td className="p-4">{reward.available}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleEdit('rewards', reward)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleDelete('rewards', reward.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {selectedEntity === 'rewards' && renderForm()}
          </div>
        )}
        
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Campaign Management</h2>
              <button 
                onClick={() => handleCreate('campaigns')} 
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
              >
                <span>➕</span>
                <span>Add Campaign</span>
              </button>
            </div>
            
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Start Date</th>
                    <th className="text-left p-4">End Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns
                    .filter(campaign => 
                      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(campaign => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{campaign.name}</td>
                        <td className="p-4">{campaign.startDate}</td>
                        <td className="p-4">{campaign.endDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${campaign.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {campaign.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleEdit('campaigns', campaign)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-3 py-1 border rounded text-sm"
                              onClick={() => handleDelete('campaigns', campaign.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {selectedEntity === 'campaigns' && renderForm()}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Point Distribution Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.pointDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="earned" stroke="#8884d8" name="Points Earned" />
                      <Line type="monotone" dataKey="redeemed" stroke="#82ca9d" name="Points Redeemed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Redemption by Reward Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.redemptionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="reward" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Redemptions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-4">User Point Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={users}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" fill="#82ca9d" name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {renderPointAdjustmentModal()}
    </div>
  );
};

export default AdminDashboard;