'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import axios from 'axios' 
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'

const quickLinks = [
  {
    section: 'Carrera',
    links: [
      { label: 'Publicaciones', href: '/#publicaciones' },
      { label: 'Convocatorias', href: '/#convocatorias' },
      { label: 'Cursos', href: '/#cursos' },
      { label: 'Eventos', href: '/#eventos' },
    ],
  },
  {
    section: 'Recursos',
    links: [
      { label: 'Servicios', href: '/#servicios' },
      { label: 'Gaceta', href: '/#gaceta' },
      { label: 'Videos', href: '/#videos' },
      { label: 'Ofertas', href: '/#ofertas' },
    ],
  },
]

const Footer = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const data = await getInstitucionPrincipal(source.token);
        setInstitucion(data.Descripcion);
        setError(null);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching footer data:', error);
          setError(error instanceof Error ? error.message : 'Error al cargar los datos del pie de página');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => source.cancel('Footer desmontado');
  }, []);

  const primaryColor = institucion?.colorinstitucion?.[0]?.color_primario ?? '#4F8D40'

  const hoverOn = (e: React.MouseEvent<Element>) => { (e.currentTarget as HTMLElement).style.color = primaryColor }
  const hoverOff = (e: React.MouseEvent<Element>) => { (e.currentTarget as HTMLElement).style.color = '' }

  // ⚠️ PANTALLA DE ERROR
  if (error) {
    return (
      <footer className='py-10'>
        <div className='container text-center p-8'>
          <div className='text-5xl mb-4'>⚠️</div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
            Error al cargar el pie de página
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
      </footer>
    )
  }

  return (
    <footer>
      <div className='container py-8'>

        {/* ── Fila superior ── */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5'>

          {/* Logo institucional */}
          <div className='w-fit flex items-center gap-3'>
            {loading ? (
              <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse' />
            ) : institucion?.institucion_logo ? (
              <Image
                src={institucion.institucion_logo}
                alt={institucion.institucion_nombre}
                width={100}
                height={100}
                className='rounded-full object-contain'
              />
              
            ) : null}
                        <motion.a
              href='https://utic.upea.bo/'
              target='_blank'
              rel='noreferrer'
              whileHover={{ opacity: 0.7 }}
              className='inline-flex items-center gap-2 text-xs text-lightgrey duration-300'
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <Image
                src='/logo/logo_utic_cir.png'
                alt='UTIC'
                width={100}
                height={100}
                className='rounded-full opacity-100'
              />
            </motion.a>
          </div>

          {/* Plataformas */}
          <div className='flex sm:flex-row flex-col sm:items-center gap-4'>
            <p className='text-darkblue dark:text-white text-lg font-medium'>Plataformas</p>
            <div className='flex items-center gap-3'>
              {[
                { label: 'Inscripciones', href: 'https://inscripcionesambiental.upea.bo/' },
                { label: 'Campus Virtual', href: 'https://virtualambiental.upea.bo/' },
                { label: 'Página Web', href: 'https://ambiental.upea.edu.bo/' },
              ].map((pl, i) => (
                <a
                  key={i}
                  href={pl.href}
                  target='_blank'
                  rel='noreferrer'
                  className='px-4 py-2 text-sm font-medium rounded-lg border duration-300'
                  style={{
                    color: '#ffffff',
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = primaryColor
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = primaryColor
                    e.currentTarget.style.color = '#ffffff'
                  }}
                >
                  {pl.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid 3 columnas ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8'>

          {/* COLUMNA 1 — Redes sociales */}
          <div className='lg:col-span-4 sm:col-span-2 flex flex-col gap-5'>
            <div>
              <p className='text-darkblue dark:text-white text-xl font-semibold mb-1'>
                {loading ? '...' : institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
              </p>
              <p className='text-lightgrey text-sm'>Universidad Pública de El Alto</p>
            </div>

            <div className='flex gap-4'>
              {institucion?.institucion_facebook && (
                <Link href={institucion.institucion_facebook} target='_blank'>
                  <Icon
                    icon='tabler:brand-facebook'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 duration-300'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  />
                </Link>
              )}
              {institucion?.institucion_youtube && (
                <Link href={institucion.institucion_youtube} target='_blank'>
                  <Icon
                    icon='tabler:brand-youtube-filled'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 duration-300'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  />
                </Link>
              )}
              {institucion?.institucion_twitter && (
                <Link href={institucion.institucion_twitter} target='_blank'>
                  <Icon
                    icon='tabler:brand-telegram'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 duration-300'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  />
                </Link>
              )}
            </div>


          </div>

          {/* COLUMNA 2 — Links rápidos */}
          <div className='lg:col-span-4 col-span-1'>
            <div className='flex gap-10 sm:gap-16'>
              {quickLinks.map((group, i) => (
                <div key={i} className='group relative col-span-2'>
                  <p className='text-xl font-semibold mb-4'>{group.section}</p>
                  <ul>
                    {group.links.map((item, j) => (
                      <li key={j} className='mb-3'>
                        <Link
                          href={item.href}
                          className='text-darkblue/60 dark:text-white/60 text-base font-normal duration-300'
                          onMouseEnter={hoverOn}
                          onMouseLeave={hoverOff}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA 3 — Contacto */}
          <div className='lg:col-span-4 col-span-1'>

            {institucion?.institucion_direccion && (
              <div className='flex gap-2'>
                <Icon icon='tabler:map-pin' width={22} height={22} className='text-lightgrey shrink-0 mt-0.5' />
                <p className='text-base font-normal text-darkblue/70 dark:text-white/70'>
                  {institucion.institucion_direccion}
                </p>
              </div>
            )}

            {institucion?.institucion_celular1 ? (
              <div className='flex gap-2 mt-4'>
                <Icon icon='tabler:phone' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link
                  href={`tel:${institucion.institucion_celular1}`}
                  className='text-base font-normal text-darkblue/70 dark:text-white/70 duration-300'
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {institucion.institucion_celular1}
                </Link>
              </div>
            ) : null}

            {institucion?.institucion_celular2 ? (
              <div className='flex gap-2 mt-2'>
                <Icon icon='tabler:phone' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link
                  href={`tel:${institucion.institucion_celular2}`}
                  className='text-base font-normal text-darkblue/70 dark:text-white/70 duration-300'
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {institucion.institucion_celular2}
                </Link>
              </div>
            ) : null}

            {institucion?.institucion_correo1 && (
              <div className='flex gap-2 mt-4'>
                <Icon icon='tabler:mail' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link
                  href={`mailto:${institucion.institucion_correo1}`}
                  className='text-base font-normal text-darkblue/70 dark:text-white/70 duration-300 break-all'
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {institucion.institucion_correo1}
                </Link>
              </div>
            )}

            {institucion?.institucion_correo2 && (
              <div className='flex gap-2 mt-2'>
                <Icon icon='tabler:mail' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link
                  href={`mailto:${institucion.institucion_correo2}`}
                  className='text-base font-normal text-darkblue/70 dark:text-white/70 duration-300 break-all'
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {institucion.institucion_correo2}
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className='py-3 border-t border-lightgrey/20'>
        <p className='text-center text-sm text-lightgrey flex flex-wrap items-center justify-center gap-1'>
          © Universidad Pública de El Alto {new Date().getFullYear()}
          <span className='opacity-40'>|</span>
          <Link
            href='https://utic.upea.bo/'
            target='_blank'
            rel='noreferrer'
            className='duration-300 font-medium'
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            UTIC
          </Link>
          <span className='opacity-40'>·</span>
          <span>Web Developer:</span>
          <Link
            href='https://www.linkedin.com/in/jhonny-ajno-huchani-6545903a2/'
            target='_blank'
            rel='noreferrer'
            className='duration-300 font-semibold'
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            JhonnyAH
          </Link>
          <span className='opacity-40'>·</span>
          Todos los Derechos Reservados
        </p>
      </div>
    </footer>
  )
}

export default Footer