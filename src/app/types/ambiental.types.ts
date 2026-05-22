// ============================================================
// TYPES - API Ingeniería Ambiental
// Basados en los endpoints reales
// ============================================================

// ---------- /institucionesPrincipal/30 ----------

export type ColorInstitucion = {
  id_color: number
  color_primario: string
  color_secundario: string
  color_terciario: string
}

export type InstitucionType = {
  institucion_id: number
  institucion_nombre: string
  institucion_iniciales: string
  institucion_nombre_iniciales: string
  institucion_logo: string
  institucion_historia: string
  institucion_mision: string
  institucion_vision: string
  institucion_facebook: string
  institucion_youtube: string
  institucion_twitter: string
  institucion_direccion: string
  institucion_celular1: number
  institucion_celular2: number
  institucion_correo1: string
  institucion_correo2: string
  institucion_api_google_map: string
  institucion_objetivos: string
  institucion_sobre_ins: string
  institucion_link_video_vision: string
  colorinstitucion: ColorInstitucion[]
}

// ---------- /institucion/30/contenido ----------

export type AutoridadType = {
  id_autoridad: number
  foto_autoridad: string
  nombre_autoridad: string
  cargo_autoridad: string
  facebook_autoridad: string
  celular_autoridad: string
  twiter_autoridad: string
}

export type PortadaType = {
  portada_id: number
  portada_imagen: string
  portada_titulo: string
  portada_subtitulo: string
}

export type UbicacionType = {
  id_ubicacion: number
  ubicacion_imagen: string
  ubicacion_titulo: string
  ubicacion_descripcion: string
  ubicacion_latitud: string
  ubicacion_longitud: string
  ubicacion_estado: string
}

export type VideoType = {
  video_id: number
  video_enlace: string
  video_titulo: string
  video_breve_descripcion: string
  video_estado: number
  video_tipo: string
}

// ---------- /institucion/30/recursos ----------

export type PublicacionType = {
  publicaciones_id: number
  publicaciones_titulo: string
  publicaciones_imagen: string
  publicaciones_descripcion: string
  publicaciones_documento: string
  publicaciones_fecha: string
  publicaciones_autor: string
  publicaciones_tipo: string
}

export type LinkExternoType = {
  id_link: number
  imagen: string
  nombre: string
  url_link: string
  estado: number
  tipo: string
}

// ---------- /institucion/30/gacetaEventos ----------

export type GacetaType = {
  gaceta_id: number
  gaceta_titulo: string
  gaceta_fecha: string
  gaceta_documento: string
  gaceta_tipo: string
}

export type EventoType = {
  evento_id: number
  evento_titulo: string
  evento_imagen: string
  evento_descripcion: string
  evento_fecha: string
  evento_hora: string
  evento_lugar: string
  tipo_evento: string
  galeria: unknown[]
}

export type TipoCursoType = {
  tipo_conv_curso_nombre: string
  tipo_conv_curso_estado: string
}

export type CursoType = {
  iddetalle_cursos_academicos: number
  det_img_portada: string
  det_titulo: string
  det_descripcion: string
  det_costo: number
  det_costo_ext: number       
  det_costo_profe: number   
  det_cupo_max: number
  det_carga_horaria: number
  det_lugar_curso: string    
  det_modalidad: string
  det_fecha_ini: string
  det_fecha_fin: string
  det_codigo: string
  det_hora_ini: string
  det_grupo_whatssap: string     
  det_version: string            
  det_estado: string
  idtipo_curso_otros: number      
  tipo_curso_otro: TipoCursoType
  facilitadores: unknown[]   
}

export type TipoConvComunType = {
  idtipo_conv_comun: number
  tipo_conv_comun_titulo: string
  tipo_conv_comun_estado: string
}

export type ConvocatoriaType = {
  idconvocatorias: number
  con_foto_portada: string
  con_titulo: string
  con_descripcion: string
  con_estado: string
  con_fecha_inicio: string
  con_fecha_fin: string
  tipo_conv_comun: TipoConvComunType
}

export type ServicioType = {
  serv_id: number
  serv_imagen: string
  serv_nombre: string
  serv_descripcion: string
  serv_nro_celular: number
  serv_active: string
}

export type OfertaAcademicaType = {
  ofertas_id: number
  ofertas_titulo: string
  ofertas_descripcion: string
  ofertas_inscripciones_ini: string
  ofertas_inscripciones_fin: string
  ofertas_fecha_examen: string
  ofertas_imagen: string
  ofertas_referencia: string
  ofertas_estado: number
}

// ---------- Respuestas completas por endpoint ----------

export type InstitucionPrincipalResponse = {
  Descripcion: InstitucionType
}

export type ContenidoResponse = {
  autoridad: AutoridadType[]
  portada: PortadaType[]
  ubicacion: UbicacionType[]
  upea_videos: VideoType[]
}

export type RecursosResponse = {
  upea_publicaciones: PublicacionType[]
  linksExternoInterno: LinkExternoType[]
  links: unknown[]
}

export type GacetaEventosResponse = {
  upea_gaceta_universitaria: GacetaType[]
  upea_evento: EventoType[]
  cursos: CursoType[]
  convocatorias: ConvocatoriaType[]
  serviciosCarrera: ServicioType[]
  ofertasAcademicas: OfertaAcademicaType[]
}

// ---------- Estado global de todos los datos ----------

export type AllDataType = {
  principal: InstitucionPrincipalResponse | null
  contenido: ContenidoResponse | null
  recursos: RecursosResponse | null
  gacetaEventos: GacetaEventosResponse | null
}