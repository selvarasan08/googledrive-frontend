import axios from 'axios';

const API_URL = 'https://googledrive-backend-17kt.onrender.com/api'; // --- IGNORE ---

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all files and folders
 */
export const getFiles = async (folderId = null, search = '') => {
  try {
    const params = {};
    if (folderId) params.folderId = folderId;
    if (search) params.search = search;

    const response = await axios.get(`${API_URL}/files`, {
      headers: getAuthHeader(),
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get specific file/folder by ID
 */
export const getFileById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/files/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new folder
 */
export const createFolder = async (folderData) => {
  try {
    const response = await axios.post(`${API_URL}/files/folder`, folderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a file
 */
export const uploadFile = async (file, parentFolder = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (parentFolder) {
      formData.append('parentFolder', parentFolder);
    }

    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Download a file
 */
export const downloadFile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/files/download/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a file or folder
 */
export const deleteFile = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/files/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update file/folder (rename)
 */
export const updateFile = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/files/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle starred status
 */
export const toggleStarred = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/files/${id}/starred`, {}, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Move file/folder to another location
 */
export const moveFile = async (fileId, targetFolderId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/files/${fileId}/move`,
      { targetFolderId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};