'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [principalData, gacetaData, recursosData] = await Promise.all([
          getInstitucionPrincipal(),
          getGacetaEventos(),
          getRecursos(),
        ])
        setInstitucion(principalData.Descripcion)
        setConvocatorias(gacetaData.convocatorias)
        setCursos(gacetaData.cursos)
        setEventos(gacetaData.upea_evento)
        setGaceta(gacetaData.upea_gaceta_universitaria)
        setServicios(gacetaData.serviciosCarrera)
        setOfertas(gacetaData.ofertasAcademicas)
        setPublicaciones(recursosData.upea_publicaciones)
        // videos vienen de contenido — si ya los tienes en contexto global pásalos como prop
        // por ahora dejamos vacío hasta que lo conectes
        setVideos([])
      } catch (error) {
        console.error('Error fetching Review data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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