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
// ENDPOINT 1: Información principal de la institución
// GET /institucionesPrincipal/:id
// Retorna: descripción, misión, visión, objetivos, colores, redes
// ============================================================
export const getInstitucionPrincipal = async (cancelToken) => {
  const response = await axiosInstance.get(`institucionesPrincipal/${ID}`, {
    cancelToken: cancelToken
  });
  return response.data;
};


// ============================================================
// ENDPOINT 2: Contenido de la institución
// GET /institucion/:id/contenido
// Retorna: autoridad, portada, ubicación, videos
// ============================================================
export const getContenido = async (cancelToken) => {
  const response = await axiosInstance.get(`institucion/${ID}/contenido`, {
    cancelToken: cancelToken
  });
  return response.data;
};
// ============================================================
// ENDPOINT 3: Recursos de la institución
// GET /institucion/:id/recursos
// Retorna: publicaciones, links externos, links internos
// ============================================================
export const getRecursos = async (cancelToken ) => {
  const response = await axiosInstance.get(`institucion/${ID}/recursos`, {
    cancelToken: cancelToken
  });
  return response.data;
};

// ============================================================
// ENDPOINT 4: Gaceta y eventos
// GET /institucion/:id/gacetaEventos
// Retorna: gaceta, eventos, cursos, convocatorias, servicios, ofertas
// ============================================================
export const getGacetaEventos = async (cancelToken) => {
  const response = await axiosInstance.get(`institucion/${ID}/gacetaEventos`, {
    cancelToken: cancelToken
  });
  return response.data;
};

// ============================================================
// CARGA COMPLETA: todos los endpoints en paralelo
// Útil para el HomeView donde se necesitan todos los datos
// ============================================================
export const getAllData = async (cancelToken) => {
  const [principal, contenido, recursos, gacetaEventos] = await Promise.all([
    getInstitucionPrincipal(cancelToken),
    getContenido(cancelToken),
    getRecursos(cancelToken),
    getGacetaEventos(cancelToken),
  ]);

  return { principal, contenido, recursos, gacetaEventos };
};