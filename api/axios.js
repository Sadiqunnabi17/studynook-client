import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://studynook-server-yxr0.onrender.com/api", // ← no localhost:5000, uses Next.js proxy
  withCredentials: true,
});

export default api;