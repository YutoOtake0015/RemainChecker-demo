import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  const token = localStorage.getItem("auth_token");
  if (token) {
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
}

export default apiClient;
