// src/api/http.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// نضيف التوكن تلقائيًا في كل طلب
api.interceptors.request.use((config) => {
  // ✳️ لو اسم المفتاح في localStorage غير "token" عدّله هنا
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
