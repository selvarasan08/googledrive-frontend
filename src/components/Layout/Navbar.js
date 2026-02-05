import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { toast } from 'react-toastify';
import { FaCloud, FaSignOutAlt, FaUser } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left */}
        <div className="brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-icon">
            <FaCloud />
          </div>
          <span className="brand-text">Where your files feel at home</span>
        </div>

        {/* Right */}
        <div className="topbar-actions">
          <div className="user-chip">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-meta">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="user-role">Personal Account</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
