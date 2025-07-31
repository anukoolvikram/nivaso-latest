import axios from 'axios';
import apiClient from './apiClient'; 

export const loginForAll = (email, password, userType) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { email, password, userType });
};

export const fetchUserInfo = async () => {
  const response = await apiClient.get('/auth/user-info');
  return response.data;
};
