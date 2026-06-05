'use client'

import { useEffect, useState } from 'react'
import axios from 'axios' 
import { getGacetaEventos, getInstitucionPrincipal } from '@/services/ambientalService'
import {
  ConvocatoriaType, CursoType, EventoType, GacetaType,
  PublicacionType, ServicioType, OfertaAcademicaType,
  VideoType, InstitucionType
} from '@/app/types/ambiental.types'
import { getRecursos } from '@/services/ambientalService'
import CategoriesExplorer from '../Categories/CategoriesExplorer'
import MisionVisionAcordion from '../Categories/MisionVisionAcordion'

const Review = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [convocatorias, setConvocatorias] = useState<ConvocatoriaType[]>([])
  const [cursos, setCursos] = useState<CursoType[]>([])
  const [eventos, setEventos] = useState<EventoType[]>([])
  const [gaceta, setGaceta] = useState<GacetaType[]>([])
  const [publicaciones, setPublicaciones] = useState<PublicacionType[]>([])
  const [servicios, setServicios] = useState<ServicioType[]>([])
  const [ofertas, setOfertas] = useState<OfertaAcademicaType[]>([])
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const [principalData, gacetaData, recursosData] = await Promise.all([
          getInstitucionPrincipal(source.token),
          getGacetaEventos(source.token),
          getRecursos(source.token),
        ])
        setInstitucion(principalData.Descripcion)
        setConvocatorias(gacetaData.convocatorias)
        setCursos(gacetaData.cursos)
        setEventos(gacetaData.upea_evento)
        setGaceta(gacetaData.upea_gaceta_universitaria)
        setServicios(gacetaData.serviciosCarrera)
        setOfertas(gacetaData.ofertasAcademicas)
        setPublicaciones(recursosData.upea_publicaciones)
        setVideos([])
        setError(null)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching Review data:', error)
          setError(error instanceof Error ? error.message : 'Error al cargar los datos')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => source.cancel('Review desmontado')
  }, [])

  // ⚠️ PANTALLA DE ERROR
  if (error) {
    return (
      <section className='bg-secondary dark:bg-darklight py-16 min-h-[60vh] flex items-center justify-center'>
        <div className='text-center p-8 max-w-md'>
          <div className='text-5xl mb-4'>⚠️</div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
            Error al cargar
          </h3>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 rounded-lg text-white transition-colors'
            style={{ backgroundColor: 'var(--color-primario)' }}
          >
            Reintentar
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-secondary dark:bg-darklight py-16'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>

          {/* Categorías */}
          <div>
            <p
              className='font-semibold text-sm uppercase tracking-widest mb-2'
              style={{ color: 'var(--color-primario)' }}
            >
              Explorar contenido
            </p>
            <h2 className='text-3xl font-bold text-darkblue dark:text-white mb-8'>
              Categorías
            </h2>
            <CategoriesExplorer
              convocatorias={convocatorias}
              cursos={cursos}
              eventos={eventos}
              gaceta={gaceta}
              publicaciones={publicaciones}
              servicios={servicios}
              ofertas={ofertas}
              videos={videos}
              loading={loading}
            />
          </div>

          {/* Misión / Visión / Objetivos */}
          <div>
            <p
              className='font-semibold text-sm uppercase tracking-widest mb-2'
              style={{ color: 'var(--color-primario)' }}
            >
              Universidad Pública de El Alto
            </p>
            <h2 className='text-3xl font-bold text-darkblue dark:text-white mb-8'>
              {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
            </h2>
            <MisionVisionAcordion institucion={institucion} loading={loading} />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Review