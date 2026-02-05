import React, { useState } from 'react';
import { 
  FaFolder, 
  FaFile, 
  FaEllipsisV, 
  FaTrash, 
  FaDownload, 
  FaStar,
  FaRegStar,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileVideo,
  FaFileAudio,
  FaFileCode
} from 'react-icons/fa';
import { downloadFile } from '../../services/fileService';
import { toast } from 'react-toastify';
import '../styles/FileGrid.css';

const FileGrid = ({ 
  files, 
  onFolderClick, 
  onDelete, 
  onRefresh,
  onToggleStarred,
  viewMode = 'grid',
  // NEW: Drag and drop props
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null); // NEW: Track which folder is being dragged over

  const getFileIcon = (file) => {
    if (file.type === 'folder') return <FaFolder className="file-icon folder-icon" />;
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    const iconMap = {
      pdf: <FaFilePdf className="file-icon pdf-icon" />,
      jpg: <FaFileImage className="file-icon image-icon" />,
      jpeg: <FaFileImage className="file-icon image-icon" />,
      png: <FaFileImage className="file-icon image-icon" />,
      gif: <FaFileImage className="file-icon image-icon" />,
      doc: <FaFileWord className="file-icon word-icon" />,
      docx: <FaFileWord className="file-icon word-icon" />,
      xls: <FaFileExcel className="file-icon excel-icon" />,
      xlsx: <FaFileExcel className="file-icon excel-icon" />,
      zip: <FaFileArchive className="file-icon archive-icon" />,
      rar: <FaFileArchive className="file-icon archive-icon" />,
      mp4: <FaFileVideo className="file-icon video-icon" />,
      avi: <FaFileVideo className="file-icon video-icon" />,
      mp3: <FaFileAudio className="file-icon audio-icon" />,
      wav: <FaFileAudio className="file-icon audio-icon" />,
      js: <FaFileCode className="file-icon code-icon" />,
      jsx: <FaFileCode className="file-icon code-icon" />,
      py: <FaFileCode className="file-icon code-icon" />,
      html: <FaFileCode className="file-icon code-icon" />,
      css: <FaFileCode className="file-icon code-icon" />,
    };
    
    return iconMap[extension] || <FaFile className="file-icon default-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const handleDownload = async (file) => {
    try {
      const response = await downloadFile(file._id);
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        toast.success('Download started');
      }
    } catch (error) {
      toast.error('Download failed');
    }
    setActiveMenu(null);
  };

  const handleMenuToggle = (e, fileId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === fileId ? null : fileId);
  };

  const handleItemClick = (file) => {
    if (file.type === 'folder') {
      onFolderClick(file);
    }
    setActiveMenu(null);
  };

  // NEW: Handle drag over folder with visual feedback
  const handleDragOverFolder = (e, folder) => {
    if (folder.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      setDragOverFolder(folder._id);
      onDragOver && onDragOver(e);
    }
  };

  // NEW: Handle drag leave folder
  const handleDragLeaveFolder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
  };

  // NEW: Handle drop on folder
  const handleDropOnFolder = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
    onDrop && onDrop(e, folder);
  };

  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <h3>No files or folders</h3>
        <p>Upload files or create a folder to get started</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="file-list-view">
        <div className="file-list-header">
          <div className="list-col-name">Name</div>
          <div className="list-col-owner">Owner</div>
          <div className="list-col-modified">Last modified</div>
          <div className="list-col-size">File size</div>
          <div className="list-col-actions"></div>
        </div>
        
        <div className="file-list-body">
          {files.map((file) => (
            <div 
              key={file._id} 
              className={`file-list-item ${dragOverFolder === file._id ? 'drag-over' : ''}`}
              onClick={() => handleItemClick(file)}
              // NEW: Make items draggable
              draggable={true}
              onDragStart={(e) => onDragStart && onDragStart(e, file)}
              onDragEnd={(e) => onDragEnd && onDragEnd(e)}
              onDragOver={(e) => handleDragOverFolder(e, file)}
              onDragLeave={handleDragLeaveFolder}
              onDrop={(e) => handleDropOnFolder(e, file)}
            >
              <div className="list-col-name">
                {getFileIcon(file)}
                <span className="file-name">{file.name}</span>
                <button 
                  className="star-btn-inline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStarred(file._id);
                  }}
                >
                  {file.isStarred ? <FaStar className="starred" /> : <FaRegStar />}
                </button>
              </div>
              
              <div className="list-col-owner">me</div>
              
              <div className="list-col-modified">
                {formatDate(file.updatedAt)}
              </div>
              
              <div className="list-col-size">
                {file.type === 'folder' ? '—' : formatFileSize(file.size)}
              </div>
              
              <div className="list-col-actions">
                <button 
                  className="menu-btn"
                  onClick={(e) => handleMenuToggle(e, file._id)}
                >
                  <FaEllipsisV />
                </button>
                
                {activeMenu === file._id && (
                  <div className="file-menu">
                    {file.type === 'file' && (
                      <button onClick={() => handleDownload(file)}>
                        <FaDownload /> Download
                      </button>
                    )}
                    <button onClick={() => onToggleStarred(file._id)}>
                      {file.isStarred ? <FaStar /> : <FaRegStar />}
                      {file.isStarred ? 'Remove from starred' : 'Add to starred'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        onDelete(file._id);
                        setActiveMenu(null);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="file-grid">
      {files.map((file) => (
        <div 
          key={file._id} 
          className={`file-card ${dragOverFolder === file._id ? 'drag-over' : ''}`}
          onClick={() => handleItemClick(file)}
          // NEW: Make items draggable
          draggable={true}
          onDragStart={(e) => onDragStart && onDragStart(e, file)}
          onDragEnd={(e) => onDragEnd && onDragEnd(e)}
          onDragOver={(e) => handleDragOverFolder(e, file)}
          onDragLeave={handleDragLeaveFolder}
          onDrop={(e) => handleDropOnFolder(e, file)}
        >
          <div className="file-card-header">
            <button 
              className="star-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStarred(file._id);
              }}
            >
              {file.isStarred ? <FaStar className="starred" /> : <FaRegStar />}
            </button>
            
            <button 
              className="menu-btn"
              onClick={(e) => handleMenuToggle(e, file._id)}
            >
              <FaEllipsisV />
            </button>
            
            {activeMenu === file._id && (
              <div className="file-menu">
                {file.type === 'file' && (
                  <button onClick={() => handleDownload(file)}>
                    <FaDownload /> Download
                  </button>
                )}
                <button onClick={() => onToggleStarred(file._id)}>
                  {file.isStarred ? <FaStar /> : <FaRegStar />}
                  {file.isStarred ? 'Remove from starred' : 'Add to starred'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => {
                    onDelete(file._id);
                    setActiveMenu(null);
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
          
          <div className="file-card-body">
            {getFileIcon(file)}
            <div className="file-info">
              <div className="file-name" title={file.name}>{file.name}</div>
              <div className="file-meta">
                {file.type === 'folder' ? (
                  <span>Folder</span>
                ) : (
                  <>
                    <span>{formatFileSize(file.size)}</span>
                    <span className="meta-separator">•</span>
                    <span>{formatDate(file.updatedAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;