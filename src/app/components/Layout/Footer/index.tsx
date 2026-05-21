'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'

// Links rápidos de navegación (reemplaza FooterLinkData estático)
const quickLinks = [
  {
    section: 'Carrera',
    links: [
      { label: 'Publicaciones', href: '/#publicaciones' },
      { label: 'Convocatorias', href: '/#convocatorias' },
      { label: 'Cursos',        href: '/#cursos'        },
      { label: 'Eventos',       href: '/#eventos'       },
    ],
  },
  {
    section: 'Recursos',
    links: [
      { label: 'Servicios', href: '/#servicios' },
      { label: 'Gaceta',    href: '/#gaceta'    },
      { label: 'Videos',    href: '/#videos'    },
      { label: 'Ofertas',   href: '/#ofertas'   },
    ],
  },
]

const Footer = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInstitucionPrincipal()
        setInstitucion(data.Descripcion)
      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <footer>
      <div className='container py-14'>

        {/* ── Fila superior: Logo + Links plataformas ── */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-20 gap-5'>

          {/* Logo institucional */}
          <div className='w-fit flex items-center gap-3'>
            {loading ? (
              <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse' />
            ) : institucion?.institucion_logo ? (
              <Image
                src={institucion.institucion_logo}
                alt={institucion.institucion_nombre}
                width={40}
                height={40}
                className='rounded-full object-contain'
              />
            ) : null}
            <p className='text-darkblue dark:text-white font-semibold text-sm'>
              {loading ? '...' : institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
            </p>
          </div>

          {/* Links externos: Inscripciones, Campus Virtual, Web */}
          {/* 🎨 COLOR DINÁMICO FUTURO: border-primary, bg-primary → colorinstitucion[0].color_primario */}
          <div className='flex sm:flex-row flex-col sm:items-center gap-4'>
            <p className='text-darkblue dark:text-white text-lg font-medium'>
              Plataformas
            </p>
            <div className='flex items-center gap-3'>
              {[
                { label: 'Inscripciones',  href: 'https://inscripcionesambiental.upea.bo/' },
                { label: 'Campus Virtual', href: 'https://virtualambiental.upea.bo/'       },
                { label: 'Página Web',     href: 'https://ambiental.upea.edu.bo/'          },
              ].map((pl, i) => (
                <a
                  key={i}
                  href={pl.href}
                  target='_blank'
                  rel='noreferrer'
                  className='px-4 py-2 text-sm font-medium text-white border rounded-lg border-primary bg-primary
                             hover:bg-transparent hover:text-primary duration-300'
                >
                  {pl.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid 3 columnas ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 xl:gap-8'>

          {/* COLUMNA 1 — Redes sociales */}
          <div className='lg:col-span-4 sm:col-span-2 flex flex-col gap-5'>

            {/* Universidad */}
            <div>
              <p className='text-darkblue dark:text-white text-xl font-semibold mb-1'>
                {loading ? '...' : institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
              </p>
              <p className='text-lightgrey text-sm'>Universidad Pública de El Alto</p>
            </div>

            {/* Redes sociales con iconos del template */}
            {/* 🎨 COLOR DINÁMICO FUTURO: hover:text-primary → colorinstitucion[0].color_primario */}
            <div className='flex gap-4'>
              {institucion?.institucion_facebook && (
                <Link href={institucion.institucion_facebook} target='_blank'>
                  <Icon
                    icon='tabler:brand-facebook'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2
                               hover:text-primary dark:hover:text-primary duration-300'
                  />
                </Link>
              )}
              {institucion?.institucion_youtube && (
                <Link href={institucion.institucion_youtube} target='_blank'>
                  <Icon
                    icon='tabler:brand-youtube-filled'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2
                               hover:text-primary dark:hover:text-primary duration-300'
                  />
                </Link>
              )}
              {/* institucion_twitter en realidad es Telegram */}
              {institucion?.institucion_twitter && (
                <Link href={institucion.institucion_twitter} target='_blank'>
                  <Icon
                    icon='tabler:brand-telegram'
                    width={45}
                    height={45}
                    className='text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2
                               hover:text-primary dark:hover:text-primary duration-300'
                  />
                </Link>
              )}
            </div>

            {/* Logo UTIC */}
            <motion.a
              href='https://utic.upea.bo/'
              target='_blank'
              rel='noreferrer'
              whileHover={{ opacity: 0.7 }}
              className='inline-flex items-center gap-2 text-xs text-lightgrey hover:text-primary duration-300'
            >
              <Image
                src='/logo/utic.png'
                alt='UTIC'
                width={24}
                height={24}
                className='rounded-full opacity-60'
              />
              UTIC — Unidad de Tecnologías de Información
            </motion.a>
          </div>

          {/* COLUMNA 2 — Links rápidos */}
          {/* 🎨 COLOR DINÁMICO FUTURO: hover:text-primary → colorinstitucion[0].color_primario */}
          <div className='lg:col-span-4 col-span-1'>
            <div className='flex gap-20'>
              {quickLinks.map((group, i) => (
                <div key={i} className='group relative col-span-2'>
                  <p className='text-xl font-semibold mb-9'>
                    {group.section}
                  </p>
                  <ul>
                    {group.links.map((item, j) => (
                      <li key={j} className='mb-3'>
                        <Link
                          href={item.href}
                          className='text-darkblue/60 dark:text-white/60 hover:text-primary dark:hover:text-primary text-base font-normal'
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
          {/* 🎨 COLOR DINÁMICO FUTURO: hover:text-primary → colorinstitucion[0].color_primario */}
          <div className='lg:col-span-4 col-span-1'>

            {/* Dirección */}
            {institucion?.institucion_direccion && (
              <div className='flex gap-2'>
                <Icon icon='tabler:map-pin' width={22} height={22} className='text-lightgrey shrink-0 mt-0.5' />
                <p className='text-base font-normal text-darkblue/70 dark:text-white/70'>
                  {institucion.institucion_direccion}
                </p>
              </div>
            )}

            {/* Celular 1 */}
            {institucion?.institucion_celular1 ? (
              <div className='flex gap-2 mt-10'>
                <Icon icon='tabler:phone' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link href={`tel:${institucion.institucion_celular1}`}>
                  <p className='text-base font-normal text-darkblue/70 dark:text-white/70 hover:text-primary dark:hover:text-primary'>
                    {institucion.institucion_celular1}
                  </p>
                </Link>
              </div>
            ) : null}

            {/* Celular 2 */}
            {institucion?.institucion_celular2 ? (
              <div className='flex gap-2 mt-4'>
                <Icon icon='tabler:phone' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link href={`tel:${institucion.institucion_celular2}`}>
                  <p className='text-base font-normal text-darkblue/70 dark:text-white/70 hover:text-primary dark:hover:text-primary'>
                    {institucion.institucion_celular2}
                  </p>
                </Link>
              </div>
            ) : null}

            {/* Correo 1 */}
            {institucion?.institucion_correo1 && (
              <div className='flex gap-2 mt-10'>
                <Icon icon='tabler:mail' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link href={`mailto:${institucion.institucion_correo1}`}>
                  <p className='text-base font-normal text-darkblue/70 dark:text-white/70 hover:text-primary dark:hover:text-primary break-all'>
                    {institucion.institucion_correo1}
                  </p>
                </Link>
              </div>
            )}

            {/* Correo 2 */}
            {institucion?.institucion_correo2 && (
              <div className='flex gap-2 mt-4'>
                <Icon icon='tabler:mail' width={22} height={22} className='text-lightgrey shrink-0' />
                <Link href={`mailto:${institucion.institucion_correo2}`}>
                  <p className='text-base font-normal text-darkblue/70 dark:text-white/70 hover:text-primary dark:hover:text-primary break-all'>
                    {institucion.institucion_correo2}
                  </p>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      {/* 🎨 COLOR DINÁMICO FUTURO: hover:text-primary → colorinstitucion[0].color_primario */}
      <div className='py-3 border-t border-lightgrey/20'>
        <p className='text-center text-sm text-lightgrey'>
          © {new Date().getFullYear()} — Todos los derechos reservados{' '}
          <Link
            href='https://utic.upea.bo/'
            target='_blank'
            className='hover:text-primary dark:hover:text-primary duration-300 font-medium'
          >
            UTIC · Universidad Pública de El Alto
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer