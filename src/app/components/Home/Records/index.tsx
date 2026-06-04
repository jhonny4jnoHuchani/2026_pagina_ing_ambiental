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
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching ubicacion:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => source.cancel('Ubicacion desmontado')
  }, [])

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