import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});