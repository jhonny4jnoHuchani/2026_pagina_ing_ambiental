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

// Interceptor: manejo global de errores de respuesta CON REDIRECCIÓN
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignorar cancelaciones (ej. desmontaje de componente): no son errores reales
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Determinar si es un error de mantenimiento/servidor
    let isMaintenanceError = false;
    let errorCode = '';

    if (error.response) {
      const status = error.response.status;
      errorCode = status.toString();

      if (status === 500 || status === 502 || status === 503 || status === 504) {
        isMaintenanceError = true;
      }
    } else if (error.request) {
      isMaintenanceError = true;
      errorCode = 'network';
    }

    if (isMaintenanceError && typeof window !== 'undefined') {
      localStorage.setItem('service_error', errorCode);
      localStorage.setItem('service_error_time', Date.now().toString());

      const isAlreadyOnMaintenance = window.location.pathname === '/mantenimiento';
      if (!isAlreadyOnMaintenance) {
        window.location.href = '/mantenimiento';
      }
    }

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