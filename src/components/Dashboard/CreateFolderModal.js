import React, { useState } from 'react';
import { FaFolder, FaTimes } from 'react-icons/fa';
import '../styles/CreateFolderModal.css';

const CreateFolderModal = ({ onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-icon-wrapper">
            <FaFolder className="modal-folder-icon" />
          </div>
          <h2 className="modal-title">Create New Folder</h2>
          <p className="modal-subtitle">Enter a name for your new folder</p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="folderName" className="form-label">
              Folder Name
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Documents, Photos, Projects..."
              className="form-input"
              autoFocus
              required
            />
          </div>
          

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-create"
              disabled={!folderName.trim()}
            >
              <FaFolder className="btn-icon" />
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;