// Use relative path in production, localhost in development
export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const getToken = () => localStorage.getItem("token");