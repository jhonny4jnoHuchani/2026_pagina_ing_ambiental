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
    // Determinar si es un error de mantenimiento/servidor
    let isMaintenanceError = false;
    let errorCode = '';
    
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      errorCode = status.toString();
      
      if (status === 500 || status === 502 || status === 503 || status === 504) {
        isMaintenanceError = true; // Error de servidor
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (sin internet, servidor caído)
      isMaintenanceError = true;
      errorCode = 'network';
    }
    
    // Si es error de mantenimiento, redirigir a página de mantenimiento
    if (isMaintenanceError && typeof window !== 'undefined') {
      // Guardar información del error
      localStorage.setItem('service_error', errorCode);
      localStorage.setItem('service_error_time', Date.now().toString());
      
      // Evitar redirección infinita
      const isAlreadyOnMaintenance = window.location.pathname === '/mantenimiento';
      if (!isAlreadyOnMaintenance) {
        window.location.href = '/mantenimiento';
      }
    }
    
    // Log para desarrollo
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