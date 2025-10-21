import axios from 'axios';

export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://floatchat-sih-ydpy.onrender.com/api',
  withCredentials: true,
});

