import { CancelToken } from 'axios';

declare module './ambientalService' {
  export function getInstitucionPrincipal(cancelToken?: CancelToken): Promise<any>;
  export function getContenido(cancelToken?: CancelToken): Promise<any>;
  export function getRecursos(cancelToken?: CancelToken): Promise<any>;
  export function getGacetaEventos(cancelToken?: CancelToken): Promise<any>;
  export function getAllData(cancelToken?: CancelToken): Promise<any>;
}