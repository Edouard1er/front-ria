import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('jwt_token');
const headers = { Authorization: `Bearer ${token}` };

export const ApiService = {

  get: (url) => {
    return axios.get(`${API_BASE_URL}${url}`, { headers });
  },

  post: (url, data) => {
    return axios.post(`${API_BASE_URL}${url}`, data, { headers });
  },

  put: (url, data) => {
    return axios.put(`${API_BASE_URL}${url}`, data, { headers });
  },

  remove: (url) => {
    return axios.delete(`${API_BASE_URL}${url}`, { headers });
  }
};
