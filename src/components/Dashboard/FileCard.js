import React from 'react';
import {
  FaFolder,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileVideo,
  FaFileAudio,
  FaDownload,
  FaTrash,
  FaEllipsisV,
} from 'react-icons/fa';
import { formatFileSize, formatDate, downloadFile } from '../../services/fileService';
import { toast } from 'react-toastify';
import '../styles/FileCard.css';

const FileCard = ({ file, onClick, onDelete, onRefresh, viewMode = 'grid' }) => {
  const getFileIcon = () => {
    if (file.type === 'folder') {
      return <FaFolder className="file-icon folder-icon" />;
    }

    const ext = file.name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
      return <FaFileImage className="file-icon image-icon" />;
    }
    if (ext === 'pdf') {
      return <FaFilePdf className="file-icon pdf-icon" />;
    }
    if (['doc', 'docx'].includes(ext)) {
      return <FaFileWord className="file-icon word-icon" />;
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return <FaFileExcel className="file-icon excel-icon" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
      return <FaFileVideo className="file-icon video-icon" />;
    }
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return <FaFileAudio className="file-icon audio-icon" />;
    }

    return <FaFileAlt className="file-icon default-icon" />;
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await downloadFile(file._id);
      if (response.success) {
        window.open(response.data.downloadUrl, '_blank');
        toast.success('Download started');
      }
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(file._id);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={`gdrive-file-list-item ${onClick ? 'clickable' : ''}`}
      >
        <div className="file-list-icon">
          {getFileIcon()}
        </div>
        
        <div className="file-list-name">
          <span title={file.name}>{file.name}</span>
        </div>
        
        <div className="file-list-owner">
          <span>me</span>
        </div>
        
        <div className="file-list-modified">
          <span>{formatDate(file.createdAt)}</span>
        </div>
        
        <div className="file-list-size">
          <span>{file.type === 'file' ? formatFileSize(file.size) : '—'}</span>
        </div>
        
        <div className="file-list-actions">
          {file.type === 'file' && (
            <button
              onClick={handleDownload}
              className="list-action-btn"
              title="Download"
            >
              <FaDownload />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="list-action-btn delete"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      className={`gdrive-file-card ${onClick ? 'clickable' : ''}`}
    >
      <div className="file-card-preview">
        <div className="file-card-icon-wrapper">
          {getFileIcon()}
        </div>
      </div>

      <div className="file-card-details">
        <div className="file-card-info">
          <h4 className="file-card-name" title={file.name}>
            {file.name}
          </h4>
          
          <div className="file-card-meta">
            {file.type === 'file' && (
              <span className="file-meta-size">{formatFileSize(file.size)}</span>
            )}
            <span className="file-meta-date">{formatDate(file.createdAt)}</span>
          </div>
        </div>

        <div className="file-card-actions-menu">
          <button className="menu-trigger">
            <FaEllipsisV />
          </button>
          
          <div className="file-card-menu">
            {file.type === 'file' && (
              <button onClick={handleDownload} className="menu-item">
                <FaDownload /> Download
              </button>
            )}
            <button onClick={handleDelete} className="menu-item delete">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;