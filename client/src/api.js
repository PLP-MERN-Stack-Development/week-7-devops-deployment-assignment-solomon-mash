import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mern-bug-backend.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
