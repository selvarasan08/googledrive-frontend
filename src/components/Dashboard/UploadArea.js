import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import '../styles/UploadArea.css';

const UploadArea = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      onFileUpload(file);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-area ${isDragActive ? 'upload-area-active' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="upload-content">
        <div className="upload-icon-wrapper">
          <FaCloudUploadAlt className="upload-cloud-icon" />
          <div className="upload-icon-ring"></div>
        </div>
        
        {isDragActive ? (
          <div className="upload-text-active">
            <p className="upload-title-active">Drop your files here</p>
            <p className="upload-subtitle-active">Release to upload</p>
          </div>
        ) : (
          <div className="upload-text">
            <p className="upload-title">
              Drag & drop files here
            </p>
            <p className="upload-subtitle">
              or click to browse from your computer
            </p>
            <p className="upload-info">
              All file types supported • Max 100MB per file
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;