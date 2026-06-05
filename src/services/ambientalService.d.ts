import { CancelToken } from 'axios';

declare module './ambientalService' {
  export function getInstitucionPrincipal(cancelToken?: CancelToken | any): Promise<any>;
  export function getContenido(cancelToken?: CancelToken | any): Promise<any>;
  export function getRecursos(cancelToken?: CancelToken | any): Promise<any>;
  export function getGacetaEventos(cancelToken?: CancelToken | any): Promise<any>;
  export function getAllData(cancelToken?: CancelToken | any): Promise<any>;
}