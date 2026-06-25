import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function AdminDashboard({ onLogout }) {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');
  const [loading, setLoading] = useState(true);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [message, setMessage] = useState('');
  const [editDonorId, setEditDonorId] = useState(null);
  const navigate = useNavigate();

  const [donorForm, setDonorForm] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    bloodType: 'O+',
    ailments: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetchDonors(token);
      await fetchRequests(token);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const fetchDonors = async (token) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/donors`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDonors(response.data);
  };

  const fetchRequests = async (token) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/requests`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequests(response.data);
  };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editDonorId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/donors/${editDonorId}`,
          donorForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('✅ Donor updated successfully!');
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/donors`,
          donorForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('✅ Donor added successfully!');
      }
      setDonorForm({
        name: '',
        age: '',
        email: '',
        phone: '',
        bloodType: 'O+',
        ailments: '',
      });
      setEditDonorId(null);
      setShowAddDonor(false);
      fetchDonors(token);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(editDonorId ? '❌ Error updating donor' : '❌ Error adding donor');
      console.error('Error:', err);
    }
  };

  const handleEditClick = (donor) => {
    setEditDonorId(donor._id);
    setDonorForm({
      name: donor.name,
      age: donor.age,
      email: donor.email,
      phone: donor.phone,
      bloodType: donor.bloodType,
      ailments: donor.ailments || '',
    });
    setShowAddDonor(true);
  };

  const handleDeleteDonor = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/donors/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('✅ Donor deleted successfully!');
        fetchDonors(token);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('❌ Error deleting donor');
        console.error('Error:', err);
      }
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/requests/${id}`,
        { status: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Request approved!');
      fetchRequests(token);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error approving request');
      console.error('Error:', err);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/requests/${id}`,
        { status: 'Rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Request rejected!');
      fetchRequests(token);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error rejecting request');
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

  // On-the-fly statistics
  const stats = {
    totalDonors: donors.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'Pending').length,
    approvedRequests: requests.filter(r => r.status === 'Approved').length,
  };

  const adminName = localStorage.getItem('userName') || 'Administrator';

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">🩸</span>
          <span className="brand-text">BloodBank</span>
        </div>
        <div className="admin-profile-section">
          <div className="avatar">A</div>
          <div className="profile-info">
            <span className="profile-name">{adminName}</span>
            <span className="profile-role">System Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            <span className="nav-icon">👥</span> Manage Donors
          </button>
          <button
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <span className="nav-icon">📋</span> Manage Requests
          </button>
        </nav>
        <button onClick={handleLogout} className="btn-sidebar-logout">
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Admin Control Panel</h1>
            <p>Monitor blood inventories, manage donor registries, and verify medical requests.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon red-glow">👥</div>
            <div className="stat-data">
              <span className="stat-value">{stats.totalDonors}</span>
              <span className="stat-label">Total Donors</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber-glow">📋</div>
            <div className="stat-data">
              <span className="stat-value">{stats.totalRequests}</span>
              <span className="stat-label">Total Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow-glow">⚡</div>
            <div className="stat-data">
              <span className="stat-value text-amber">{stats.pendingRequests}</span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green-glow">✓</div>
            <div className="stat-data">
              <span className="stat-value text-green">{stats.approvedRequests}</span>
              <span className="stat-label">Requests Approved</span>
            </div>
          </div>
        </section>

        {message && <div className="toast-message">{message}</div>}

        {activeTab === 'donors' && (
          <div className="dashboard-card animated fade-in">
            <div className="card-header">
              <h3>Donor Registry</h3>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (showAddDonor) {
                    setShowAddDonor(false);
                    setEditDonorId(null);
                    setDonorForm({ name: '', age: '', email: '', phone: '', bloodType: 'O+', ailments: '' });
                  } else {
                    setShowAddDonor(true);
                  }
                }}
              >
                {showAddDonor ? 'Cancel' : '+ Register Donor'}
              </button>
            </div>

            {showAddDonor && (
              <form onSubmit={handleAddDonor} className="premium-form animated slide-down">
                <h4 className="form-title">{editDonorId ? 'Update Donor Record' : 'Register New Donor'}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={donorForm.name}
                      onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                      required
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={donorForm.age}
                      onChange={(e) => setDonorForm({ ...donorForm, age: e.target.value })}
                      required
                      placeholder="e.g. 25"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={donorForm.email}
                      onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                      required
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      required
                      placeholder="e.g. +1234567890"
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Type</label>
                    <select
                      value={donorForm.bloodType}
                      onChange={(e) => setDonorForm({ ...donorForm, bloodType: e.target.value })}
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
                    <label>Ailments</label>
                    <input
                      type="text"
                      value={donorForm.ailments}
                      onChange={(e) => setDonorForm({ ...donorForm, ailments: e.target.value })}
                      placeholder="e.g. None"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editDonorId ? 'Update Record' : 'Register Donor'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddDonor(false);
                      setEditDonorId(null);
                      setDonorForm({ name: '', age: '', email: '', phone: '', bloodType: 'O+', ailments: '' });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="loading-spinner">Loading donors...</div>
            ) : donors.length === 0 ? (
              <div className="empty-state">No donors currently registered.</div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Blood Group</th>
                      <th>Ailments</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor._id}>
                        <td className="font-semibold">{donor.name}</td>
                        <td>{donor.age}</td>
                        <td>
                          <span className={`blood-badge badge-${donor.bloodType.replace('+', 'p').replace('-', 'n')}`}>
                            {donor.bloodType}
                          </span>
                        </td>
                        <td>{donor.ailments || 'None'}</td>
                        <td>{donor.email}</td>
                        <td>{donor.phone}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-success btn-small"
                              onClick={() => handleEditClick(donor)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteDonor(donor._id)}
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
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="dashboard-card animated fade-in">
            <div className="card-header">
              <h3>Blood Donation / Receiver Requests</h3>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="empty-state">No requests submitted.</div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Category</th>
                      <th>Ailments</th>
                      <th>Units Needed</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id}>
                        <td className="font-semibold">{req.name}</td>
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
                        <td>{req.ailments || 'None'}</td>
                        <td className="font-bold">{req.unitsRequired}</td>
                        <td>
                          <span className={`status-pill status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'Pending' ? (
                            <div className="table-actions">
                              <button
                                className="btn btn-success btn-small"
                                onClick={() => handleApproveRequest(req._id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-small"
                                onClick={() => handleRejectRequest(req._id)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted">Processed</span>
                          )}
                        </td>
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

export default AdminDashboard;
