import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: 'https://floatchat-sih-69r4.onrender.com/api',
  withCredentials: true,
});

