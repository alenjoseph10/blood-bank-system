import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function DonorDashboard({ onLogout }) {
  const [donors, setDonors] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    bloodType: 'O+',
    category: 'Receiver',
    ailments: '',
    unitsRequired: 1,
  });

  useEffect(() => {
    fetchDonors();
    fetchMyRequests();
  }, []);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/donors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonors(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/requests/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRequests(response.data);
    } catch (err) {
      console.error('Error fetching user requests:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Request submitted successfully!');
      setFormData({
        name: '',
        age: '',
        email: '',
        phone: '',
        bloodType: 'O+',
        category: 'Receiver',
        ailments: '',
        unitsRequired: 1,
      });
      fetchMyRequests();
      setActiveTab('myRequests');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error submitting request');
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    onLogout();
    navigate('/');
  };

  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">🩸</span>
          <span className="brand-text">BloodBank</span>
        </div>
        <div className="admin-profile-section">
          <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">Registered Member</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            <span className="nav-icon">🔍</span> Available Donors
          </button>
          <button
            className={`nav-item ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <span className="nav-icon">✍️</span> Submit Request
          </button>
          <button
            className={`nav-item ${activeTab === 'myRequests' ? 'active' : ''}`}
            onClick={() => setActiveTab('myRequests')}
          >
            <span className="nav-icon">📋</span> My Requests
          </button>
        </nav>
        <button onClick={handleLogout} className="btn-sidebar-logout">
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>User Dashboard</h1>
            <p>Welcome back! You can search active donors or request blood units below.</p>
          </div>
        </header>

        {message && <div className="toast-message">{message}</div>}

        {activeTab === 'donors' && (
          <div className="dashboard-card animated fade-in">
            <div className="card-header">
              <h3>Available Blood Donors</h3>
            </div>
            {loading ? (
              <div className="loading-spinner">Loading donors...</div>
            ) : donors.length === 0 ? (
              <div className="empty-state">No blood donors are currently available.</div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Blood Group</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Units Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor._id}>
                        <td className="font-semibold">{donor.name}</td>
                        <td>
                          <span className={`blood-badge badge-${donor.bloodType.replace('+', 'p').replace('-', 'n')}`}>
                            {donor.bloodType}
                          </span>
                        </td>
                        <td>{donor.email}</td>
                        <td>{donor.phone}</td>
                        <td className="font-bold">{donor.unitsAvailable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'request' && (
          <div className="dashboard-card animated fade-in">
            <div className="card-header">
              <h3>Submit Blood Request</h3>
            </div>
            <form onSubmit={handleSubmitRequest} className="premium-form">
              <h4 className="form-title">Medical Details Form</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 30"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. +123456789"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Type Required</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Donor">Donor (Offering Blood)</option>
                    <option value="Receiver">Receiver (Requesting Blood)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ailments / Health Conditions (Optional)</label>
                  <input
                    type="text"
                    name="ailments"
                    value={formData.ailments}
                    onChange={handleInputChange}
                    placeholder="e.g. None, Diabetes, Hypertension"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Units Required</label>
                  <input
                    type="number"
                    name="unitsRequired"
                    value={formData.unitsRequired}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'myRequests' && (
          <div className="dashboard-card animated fade-in">
            <div className="card-header">
              <h3>My Requests History</h3>
            </div>
            {myRequests.length === 0 ? (
              <div className="empty-state">You have not submitted any blood requests yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Blood Group</th>
                      <th>Category</th>
                      <th>Units</th>
                      <th>Status</th>
                      <th>Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((req) => (
                      <tr key={req._id}>
                        <td>
                          <span className={`blood-badge badge-${req.bloodType.replace('+', 'p').replace('-', 'n')}`}>
                            {req.bloodType}
                          </span>
                        </td>
                        <td>
                          <span className={`category-badge category-${req.category.toLowerCase()}`}>
                            {req.category}
                          </span>
                        </td>
                        <td className="font-bold">{req.unitsRequired}</td>
                        <td>
                          <span className={`status-pill status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default DonorDashboard;
