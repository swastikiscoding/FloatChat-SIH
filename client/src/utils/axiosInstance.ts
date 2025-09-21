import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://floatchat-sih-69r4.onrender.com/api', 
  withCredentials: true,
});

