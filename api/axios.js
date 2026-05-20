import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "/api", // ← no localhost:5000, uses Next.js proxy
  withCredentials: true,
});

export default api;