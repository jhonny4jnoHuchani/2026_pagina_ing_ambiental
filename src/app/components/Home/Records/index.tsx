'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { getContenido, getInstitucionPrincipal } from '@/services/ambientalService'
import { UbicacionType, InstitucionType } from '@/app/types/ambiental.types'
import RecordSkeleton from '../../Skeleton/Record'

const Ubicacion = () => {
  const [ubicacion, setUbicacion] = useState<UbicacionType | null>(null)
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const [contenidoData, principalData] = await Promise.all([
          getContenido(source.token),
          getInstitucionPrincipal(source.token),
        ])
        setUbicacion(contenidoData.ubicacion[0] ?? null)
        setInstitucion(principalData.Descripcion)
        setError(null)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching ubicacion:', error)
          setError(error instanceof Error ? error.message : 'Error al cargar la ubicación')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => source.cancel('Ubicacion desmontado')
  }, [])

  // ⚠️ PANTALLA DE ERROR
  if (error) {
    return (
      <section id='ubicacion' className='scroll-mt-12 min-h-[60vh] flex items-center justify-center'>
        <div className='text-center p-8 max-w-md'>
          <div className='text-5xl mb-4'>⚠️</div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
            Error al cargar la ubicación
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
    <section id='ubicacion' className='scroll-mt-12'>
      <div className='container'>

        <div className='mb-8 text-center'>
          <h2>{ubicacion?.ubicacion_titulo ?? 'Ubicación'}</h2>

        </div>

        {loading ? (
          <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <RecordSkeleton key={i} />
            ))}
          </div>
        ) : institucion?.institucion_api_google_map ? (
          <div className='w-full rounded-2xl overflow-hidden shadow-lg border border-darkblue/10 dark:border-white/10'>
            <iframe
              src={institucion.institucion_api_google_map}
              width='100%'
              height='500'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title={ubicacion?.ubicacion_titulo ?? 'Ubicación Ingeniería Ambiental'}
            />
          </div>
        ) : (
          <p className='text-center text-lightgrey'>Mapa no disponible.</p>
        )}

      </div>
    </section>
  )
}

export default Ubicacion