import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getFiles,
  createFolder,
  uploadFile,
  deleteFile,
  toggleStarred,
  moveFile, // NEW: Import moveFile
} from '../../services/fileService';
import { getCurrentUser } from '../../services/authService';

import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';

import FileGrid from './FileGrid';
import CreateFolderModal from './CreateFolderModal';
import UploadModal from './UploadModal';

import { 
  FaPlus, 
  FaSearch, 
  FaCloud, 
  FaChevronRight, 
  FaHome,
  FaTh,
  FaList,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaBars
} from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('myDrive'); // 'myDrive' or 'starred'
  const [draggedItem, setDraggedItem] = useState(null); // NEW: Track dragged item

  useEffect(() => {
    setUser(getCurrentUser());
    fetchFiles();
  }, [currentFolder, searchQuery, activeView]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await getFiles(currentFolder, searchQuery);
      if (response.success) {
        let filteredFiles = response.data;
        
        // Filter for starred items if starred view is active
        if (activeView === 'starred') {
          filteredFiles = response.data.filter(file => file.isStarred);
        }
        
        setFiles(filteredFiles);
      }
    } catch {
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      const res = await createFolder({ name, parentFolder: currentFolder });
      if (res.success) {
        toast.success('Folder created');
        fetchFiles();
        setShowCreateFolder(false);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Create failed');
    }
  };

  const handleUpload = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const res = await uploadFile(file, currentFolder);
        if (res.success) {
          return { success: true, name: file.name };
        }
      } catch {
        return { success: false, name: file.name };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
      fetchFiles();
    }
    if (failCount > 0) {
      toast.error(`${failCount} file(s) failed to upload`);
    }
    
    setShowUploadModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await deleteFile(id);
      if (res.success) {
        toast.success(res.message);
        fetchFiles();
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleStarred = async (id) => {
    try {
      const res = await toggleStarred(id);
      if (res.success) {
        toast.success(res.data.isStarred ? 'Added to starred' : 'Removed from starred');
        fetchFiles();
      }
    } catch {
      toast.error('Failed to update starred');
    }
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder._id);
    setFolderPath([...folderPath, { id: folder._id, name: folder.name }]);
  };

  const navigateToRoot = () => {
    setCurrentFolder(null);
    setFolderPath([]);
  };

  const navigateToFolder = (index) => {
    if (index === -1) {
      navigateToRoot();
    } else {
      const targetFolder = folderPath[index];
      setCurrentFolder(targetFolder.id);
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    // Reset to root when switching views
    setCurrentFolder(null);
    setFolderPath([]);
  };

  // NEW: Drag and Drop Handlers
  const handleDragStart = (e, file) => {
    setDraggedItem(file);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
    
    // Add a dragging class for visual feedback
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetFolder) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    // Prevent dropping a folder into itself
    if (draggedItem._id === targetFolder._id) {
      toast.warning('Cannot move a folder into itself');
      return;
    }

    // Prevent dropping into a file (only folders can be drop targets)
    if (targetFolder.type !== 'folder') {
      toast.warning('Can only drop into folders');
      return;
    }

    try {
      const res = await moveFile(draggedItem._id, targetFolder._id);
      if (res.success) {
        toast.success(`Moved ${draggedItem.name} to ${targetFolder.name}`);
        fetchFiles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move item');
    }

    setDraggedItem(null);
  };

  // NEW: Handle drop on root/current folder area
  const handleDropOnRoot = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    // Don't do anything if already in root and dropping on root
    if (!currentFolder && !draggedItem.parentFolder) {
      return;
    }

    try {
      const res = await moveFile(draggedItem._id, currentFolder);
      if (res.success) {
        toast.success(`Moved ${draggedItem.name}`);
        fetchFiles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move item');
    }

    setDraggedItem(null);
  };

  return (
    <>
      <Navbar user={user} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="dashboard-layout">
        <Sidebar 
          user={user} 
          className={sidebarOpen ? 'open' : ''} 
          activeView={activeView}
          onViewChange={handleViewChange}
        />

        <main className="dashboard-content">
          {/* GOOGLE DRIVE STYLE HEADER */}
          <div className="gdrive-header">
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>

            <div className="gdrive-search-container">
              <div className="gdrive-search-box">
                <FaSearch className="search-icon" />
                <input
                  placeholder="Search in Drive"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="gdrive-search-input"
                />
              </div>
            </div>

            <div className="gdrive-header-actions">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <FaTh />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* BREADCRUMB & ACTION BAR */}
          <div className="gdrive-toolbar">
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-item" 
                onClick={navigateToRoot}
              >
                <FaHome className="breadcrumb-icon" />
                <span>{activeView === 'starred' ? 'Starred' : 'My Drive'}</span>
              </button>
              
              {folderPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <FaChevronRight className="breadcrumb-separator" />
                  <button
                    className="breadcrumb-item"
                    onClick={() => navigateToFolder(index)}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {activeView === 'myDrive' && (
              <div className="toolbar-actions">
                <button
                  className="gdrive-btn gdrive-btn-upload"
                  onClick={() => setShowUploadModal(true)}
                >
                  <FaCloudUploadAlt /> Upload
                </button>
                
                <button
                  className="gdrive-btn gdrive-btn-new"
                  onClick={() => setShowCreateFolder(true)}
                >
                  <FaPlus /> New Folder
                </button>
              </div>
            )}
          </div>

          {/* FILE CONTENT AREA - NEW: Added drag and drop handlers */}
          <div 
            className="gdrive-main-content"
            onDragOver={handleDragOver}
            onDrop={handleDropOnRoot}
          >
            {loading ? (
              <div className="gdrive-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            ) : (
              <FileGrid
                files={files}
                onFolderClick={handleFolderClick}
                onDelete={handleDelete}
                onRefresh={fetchFiles}
                onToggleStarred={handleToggleStarred}
                viewMode={viewMode}
                // NEW: Pass drag and drop handlers
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            )}
          </div>
        </main>
      </div>

      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </>
  );
};

export default Dashboard;