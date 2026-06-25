import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function HomePage() {
  return (
    <div className="home-page animated fade-in">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1><span>🩸</span> BloodBank</h1>
        </div>
        <div className="navbar-buttons">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/signup" className="btn btn-primary">Join as Donor</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Give Blood, Save Lives</h1>
          <p>
            Your contribution can give a new lease of life to someone in need. 
            Connect with a network of local donors and medical facilities instantly.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-large">Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-large" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', border: '1px solid', background: 'transparent' }}>
              Donor Login
            </Link>
          </div>
        </div>
        <div className="hero-image">
          🩸
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Donors</h3>
            <p>Search a vetted directory of active blood donors filtered by location and blood group.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Quick Request</h3>
            <p>Submit immediate receiver requests directly to the centralized database for approvals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Automated Workflows</h3>
            <p>Experience real-time verification and status updates for fast distribution of blood resources.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Blood Bank Management System. Built with compassion to support healthcare.</p>
      </footer>
    </div>
  );
}

export default HomePage;
