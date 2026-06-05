import axios from 'axios'; 
import axiosInstance from "./axiosConfig";

/**
 * Types importables desde '@/app/types/ambiental.types'
 * - getInstitucionPrincipal → InstitucionPrincipalResponse
 * - getContenido           → ContenidoResponse
 * - getRecursos            → RecursosResponse
 * - getGacetaEventos       → GacetaEventosResponse
 * - getAllData              → AllDataType
 */

const ID = process.env.NEXT_PUBLIC_ID_INSTITUCION;

// ============================================================
// FUNCIÓN AUXILIAR PARA MANEJAR ERRORES (NUEVO)
// ============================================================
const handleError = (error, endpointName) => {
  // Si es cancelación, no hacer nada
  if (axios.isCancel(error)) {
    throw error;
  }
  
  // Si el error ya tiene un mensaje personalizado, usarlo
  if (error.message && !error.response && !error.request) {
    throw error;
  }
  
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      throw new Error(`No se encontraron datos de ${endpointName}`);
    } else if (status === 401 || status === 403) {
      throw new Error(`No tienes permiso para acceder a ${endpointName}`);
    } else if (status >= 500) {
      throw new Error(`El servidor está experimentando problemas. Por favor, intenta más tarde.`);
    } else {
      throw new Error(`Error ${status} al cargar ${endpointName}`);
    }
  } else if (error.request) {
    throw new Error(`No se pudo conectar al servidor. Verifica tu conexión a internet.`);
  } else {
    throw new Error(`Error inesperado: ${error.message}`);
  }
};

// ============================================================
// ENDPOINT 1: Información principal de la institución
// GET /institucionesPrincipal/:id
// Retorna: descripción, misión, visión, objetivos, colores, redes
// ============================================================
export const getInstitucionPrincipal = async (cancelToken = null) => {
  try {
    const response = await axiosInstance.get(`institucionesPrincipal/${ID}`, {
      cancelToken: cancelToken
    });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      throw handleError(error, 'información institucional');
    }
    throw error;
  }
};

// ============================================================
// ENDPOINT 2: Contenido de la institución
// GET /institucion/:id/contenido
// Retorna: autoridad, portada, ubicación, videos
// ============================================================
export const getContenido = async (cancelToken = null) => {
  try {
    const response = await axiosInstance.get(`institucion/${ID}/contenido`, {
      cancelToken: cancelToken
    });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      throw handleError(error, 'contenido institucional');
    }
    throw error;
  }
};

// ============================================================
// ENDPOINT 3: Recursos de la institución
// GET /institucion/:id/recursos
// Retorna: publicaciones, links externos, links internos
// ============================================================
export const getRecursos = async (cancelToken = null) => {
  try {
    const response = await axiosInstance.get(`institucion/${ID}/recursos`, {
      cancelToken: cancelToken
    });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      throw handleError(error, 'recursos institucionales');
    }
    throw error;
  }
};

// ============================================================
// ENDPOINT 4: Gaceta y eventos
// GET /institucion/:id/gacetaEventos
// Retorna: gaceta, eventos, cursos, convocatorias, servicios, ofertas
// ============================================================
export const getGacetaEventos = async (cancelToken = null) => {
  try {
    const response = await axiosInstance.get(`institucion/${ID}/gacetaEventos`, {
      cancelToken: cancelToken
    });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      throw handleError(error, 'gaceta y eventos');
    }
    throw error;
  }
};

// ============================================================
// CARGA COMPLETA: todos los endpoints en paralelo
// Útil para el HomeView donde se necesitan todos los datos
// ============================================================
export const getAllData = async (cancelToken = null) => {
  try {
    const [principal, contenido, recursos, gacetaEventos] = await Promise.all([
      getInstitucionPrincipal(cancelToken),
      getContenido(cancelToken),
      getRecursos(cancelToken),
      getGacetaEventos(cancelToken),
    ]);
    return { principal, contenido, recursos, gacetaEventos };
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error('Error en getAllData:', error);
      throw new Error('No se pudieron cargar todos los datos. Por favor, recarga la página.');
    }
    throw error;
  }
};