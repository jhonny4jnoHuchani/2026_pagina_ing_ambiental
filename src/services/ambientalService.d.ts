import { CancelToken } from 'axios';

declare module './ambientalService' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getInstitucionPrincipal(cancelToken?: CancelToken): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getContenido(cancelToken?: CancelToken): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getRecursos(cancelToken?: CancelToken): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getGacetaEventos(cancelToken?: CancelToken): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getAllData(cancelToken?: CancelToken): Promise<any>;
}