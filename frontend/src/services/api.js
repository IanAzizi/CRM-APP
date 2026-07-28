import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // آدرس بک‌اند تو رو بزار اینجا
  headers: {
    'Content-Type': 'application/json',
  }
});

// اگر توکن داشته باشیم، برای درخواست‌ها اضافه کن
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
