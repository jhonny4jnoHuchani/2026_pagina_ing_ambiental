import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ROOT_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega el token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_TOKEN;
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: manejo global de errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("[Network Error] No se obtuvo respuesta del servidor.");
    } else {
      console.error("[Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;