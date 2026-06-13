import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setUsers(response.data.recent_users);
      setLoginLogs(response.data.login_logs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const verifyUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.total_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Verified Users</h3>
          <p className="stat-number">{stats.verified_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Unverified Users</h3>
          <p className="stat-number">{stats.unverified_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Logins</h3>
          <p className="stat-number">{stats.today_logins || 0}</p>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('users')}>Users Management</button>
        <button onClick={() => setActiveTab('logs')}>Login Logs</button>
      </div>
      
      {activeTab === 'users' && (
        <div className="users-table">
          <h2>All Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.is_verified ? 
                      <span className="badge-success">Verified</span> : 
                      <span className="badge-warning">Unverified</span>
                    }
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    {!user.is_verified && (
                      <button onClick={() => verifyUser(user.id)}>Verify</button>
                    )}
                    <button onClick={() => deleteUser(user.id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'logs' && (
        <div className="logs-table">
          <h2>Login Attempts</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loginLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.email}</td>
                  <td>
                    <span className={log.status === 'success' ? 'badge-success' : 'badge-danger'}>
                      {log.status}
                    </span>
                  </td>
                  <td>{log.ip_address || 'N/A'}</td>
                  <td>{new Date(log.login_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;