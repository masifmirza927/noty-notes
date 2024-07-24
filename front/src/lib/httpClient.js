import axios from "axios"
import { getToken } from "../utils";


// creating axios client with headers
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  timeout: 5000,
});

// Add a request interceptor
httpClient.interceptors.request.use(function (config) {
  const token = getToken();
  // Do something before request is sent
  if (token != null) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
