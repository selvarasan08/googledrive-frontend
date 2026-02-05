import React from 'react';
import { 
  FaCloud, 
  FaFolderOpen, 
  FaStar
} from 'react-icons/fa';
import { formatBytes } from '../../utils/formatSize';
import '../styles/Sidebar.css';

const Sidebar = ({ user, className = '', activeView, onViewChange }) => {
  const used = user?.storageUsed || 0;
  const limit = user?.storageLimit || 5368709120; // Default 5GB

  const usagePercent = Math.min((used / limit) * 100, 100);
  
  // Determine storage status color
  const getStorageColor = () => {
    if (usagePercent >= 90) return '#d93025'; // Red
    if (usagePercent >= 75) return '#f9ab00'; // Yellow
    return '#1a73e8'; // Blue
  };

  return (
    <aside className={`gdrive-sidebar ${className}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FaCloud className="logo-icon" />
          <span className="logo-text">Cloud Drive</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-nav-item ${activeView === 'myDrive' ? 'active' : ''}`}
          onClick={() => onViewChange('myDrive')}
        >
          <FaFolderOpen className="nav-icon" />
          <span className="nav-text">My Drive</span>
        </button>
        
        <button 
          className={`sidebar-nav-item ${activeView === 'starred' ? 'active' : ''}`}
          onClick={() => onViewChange('starred')}
        >
          <FaStar className="nav-icon" />
          <span className="nav-text">Starred</span>
        </button>
      </nav>

      {/* Divider */}
      <div className="sidebar-divider"></div>

      {/* Storage Section */}
      <div className="sidebar-storage">
        <div className="storage-header">
          <h4 className="storage-title">Storage</h4>
        </div>

        <div className="storage-bar-container">
          <div className="storage-bar-track">
            <div 
              className="storage-bar-fill" 
              style={{ 
                width: `${usagePercent}%`,
                backgroundColor: getStorageColor()
              }}
            />
          </div>
        </div>

        <div className="storage-info">
          <p className="storage-text">
            <span className="storage-used">{formatBytes(used)}</span>
            {' of '}
            <span className="storage-total">{formatBytes(limit)}</span>
            {' used'}
          </p>
          
          {usagePercent >= 75 && (
            <p className="storage-warning">
              {usagePercent >= 90 ? '⚠️ Almost full' : '⚠️ Running low'}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;