import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes, FaCloudUploadAlt, FaFile, FaTrash, FaCheckCircle } from 'react-icons/fa';
import '../styles/UploadModal.css';

const UploadModal = ({ onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const filesWithPreview = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles.map(f => f.file));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="upload-modal-header">
          <h2 className="upload-modal-title">
            <FaCloudUploadAlt className="title-icon" />
            Upload Files
          </h2>
          <button className="upload-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="upload-modal-body">
          <div
            {...getRootProps()}
            className={`upload-dropzone ${isDragActive ? 'dropzone-active' : ''} ${selectedFiles.length > 0 ? 'dropzone-compact' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="dropzone-content">
              <div className="dropzone-icon-wrapper">
                <FaCloudUploadAlt className="dropzone-icon" />
              </div>
              
              {isDragActive ? (
                <div className="dropzone-text">
                  <p className="dropzone-title">Drop files here</p>
                </div>
              ) : (
                <div className="dropzone-text">
                  <p className="dropzone-title">Drag files here</p>
                  <p className="dropzone-subtitle">or</p>
                  <button type="button" className="dropzone-browse-btn">
                    Browse files
                  </button>
                  <p className="dropzone-info">Maximum file size: 100MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="selected-files-section">
              <div className="selected-files-header">
                <h3>Selected Files ({selectedFiles.length})</h3>
              </div>
              
              <div className="selected-files-list">
                {selectedFiles.map((fileObj) => (
                  <div key={fileObj.id} className="file-item">
                    <div className="file-item-preview">
                      {fileObj.preview ? (
                        <img src={fileObj.preview} alt={fileObj.file.name} />
                      ) : (
                        <FaFile className="file-item-icon" />
                      )}
                    </div>
                    
                    <div className="file-item-info">
                      <p className="file-item-name">{fileObj.file.name}</p>
                      <p className="file-item-size">{formatFileSize(fileObj.file.size)}</p>
                    </div>
                    
                    <button
                      className="file-item-remove"
                      onClick={() => removeFile(fileObj.id)}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="upload-modal-footer">
          <button
            className="upload-modal-btn btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="upload-modal-btn btn-upload"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            <FaCheckCircle />
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;