'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight, Calendar, MapPin, Sparkles,
  ChevronRight, Zap, CalendarDays, PlayCircle
} from 'lucide-react'
import { getGacetaEventos, getInstitucionPrincipal } from '@/services/ambientalService'
import { CursoType, InstitucionType } from '@/app/types/ambiental.types'

const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

const getCursoStatus = (fechaInicio: string, fechaFin: string) => {
  if (!fechaInicio) return { text: '', icon: null, color: '' }
  const hoy    = new Date(); hoy.setHours(0,0,0,0)
  const inicio = new Date(fechaInicio); inicio.setHours(0,0,0,0)
  const fin    = fechaFin ? new Date(fechaFin) : null
  if (fin) fin.setHours(0,0,0,0)
  const diffInicio = (inicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)

  if (fin && hoy >= inicio && hoy <= fin)
    return { text: 'EN CURSO',     icon: PlayCircle,   color: 'from-blue-500 to-indigo-600'   }
  if (diffInicio >= 0 && diffInicio <= 7)
    return { text: 'PRÓXIMAMENTE', icon: CalendarDays, color: 'from-amber-500 to-orange-600'  }
  if (diffInicio < 0 && diffInicio >= -2)
    return { text: 'NUEVO',        icon: Zap,          color: 'from-emerald-500 to-green-600' }
  return { text: '', icon: null, color: '' }
}

const ContactForm = () => {
  const [cursos, setCursos]           = useState<CursoType[]>([])
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading]         = useState(true)
  const [hoveredCurso, setHoveredCurso] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gacetaData, principalData] = await Promise.all([
          getGacetaEventos(),
          getInstitucionPrincipal(),
        ])
        setCursos(gacetaData.cursos)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching cursos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const primaryColor   = institucion?.colorinstitucion?.[0]?.color_primario   ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'
  const gradientStyle  = { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }

  const activos = cursos.filter(c => c.det_estado === '1')
  const latestCurso = activos
    .filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'CURSOS')
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime())
    .at(0)
  const latestSeminario = activos
    .filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'SEMINARIOS')
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime())
    .at(0)

  const items = [latestCurso, latestSeminario].filter(Boolean) as CursoType[]

  if (loading) {
    return (
      <section id='contact' className='scroll-mt-12 py-10 bg-secondary dark:bg-darklight'>
        <div className='container'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {[1, 2].map(i => (
              <div key={i} className='h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse' />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section id='contact' className='scroll-mt-12 relative py-10 sm:py-12 lg:py-16 overflow-hidden bg-secondary dark:bg-darklight'>
      <div className='container'>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className='text-center mb-8'
        >
          <div
            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3'
            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
          >
            <Sparkles size={12} style={{ color: primaryColor }} />
            <span className='text-xs font-semibold uppercase tracking-wider' style={{ color: primaryColor }}>
              Recientes
            </span>
          </div>
          <h2 className='mb-3'>Cursos y Seminarios</h2>
          <div className='w-16 h-0.5 rounded-full mx-auto mb-3' style={gradientStyle} />
          <p className='text-base font-normal text-lightgrey max-w-xl mx-auto'>
            Capacitación y formación continua para profesionales y estudiantes de{' '}
            {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
          </p>
        </motion.div>

        {/* Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6'>
          {items.map((item, index) => {
            const status     = getCursoStatus(item.det_fecha_ini, item.det_fecha_fin)
            const StatusIcon = status.icon
            const isHovered  = hoveredCurso === item.iddetalle_cursos_academicos

            return (
              <motion.div
                key={item.iddetalle_cursos_academicos}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setHoveredCurso(item.iddetalle_cursos_academicos)}
                onMouseLeave={() => setHoveredCurso(null)}
              >
                <Link
                  href='/#cursos'
                  className='group block bg-white dark:bg-lightdarkblue rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-darkblue/10 dark:border-white/10'
                >
                  {/* Imagen */}
                  <div className='relative h-48 sm:h-52 overflow-hidden bg-gray-100 dark:bg-darklight'>
                    {item.det_img_portada ? (
                      <Image
                        src={item.det_img_portada}
                        alt={item.det_titulo}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    ) : (
                      <div
                        className='w-full h-full flex items-center justify-center'
                        style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)` }}
                      >
                        <span className='text-xl font-bold opacity-30' style={{ color: primaryColor }}>
                          {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                        </span>
                      </div>
                    )}

                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                    <span
                      className='absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md'
                      style={gradientStyle}
                    >
                      {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                    </span>

                    <span className='absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium'>
                      {item.det_modalidad}
                    </span>

                    {status.text && StatusIcon && (
                      <motion.div
                        initial={{ scale: 0, x: -15 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.15 }}
                        className={`absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full shadow-md bg-gradient-to-r ${status.color}`}
                      >
                        <StatusIcon size={10} className='text-white' />
                        <span className='text-white text-[10px] font-bold'>{status.text}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className='p-4'>
                    {/* Título con hover dinámico */}
                    <h5
                      className='font-bold text-sm sm:text-base mb-3 line-clamp-2 transition-colors'
                      style={{
                        color: isHovered ? primaryColor : undefined,
                      }}
                    >
                      {item.det_titulo}
                    </h5>

                    <div className='flex flex-col gap-1.5 text-xs text-lightgrey mb-3'>
                      <div className='flex items-center gap-1.5'>
                        <div
                          className='w-5 h-5 rounded-lg flex items-center justify-center shrink-0'
                          style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
                        >
                          <Calendar size={10} style={{ color: primaryColor }} />
                        </div>
                        <span>Inicio: <span className='font-medium text-darkblue dark:text-white'>{formatFecha(item.det_fecha_ini)}</span></span>
                      </div>
                      {item.det_fecha_fin && (
                        <div className='flex items-center gap-1.5'>
                          <div
                            className='w-5 h-5 rounded-lg flex items-center justify-center shrink-0'
                            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
                          >
                            <Calendar size={10} style={{ color: primaryColor }} />
                          </div>
                          <span>Fin: <span className='font-medium text-darkblue dark:text-white'>{formatFecha(item.det_fecha_fin)}</span></span>
                        </div>
                      )}
                      {item.det_lugar_curso && (
                        <div className='flex items-center gap-1.5'>
                          <div
                            className='w-5 h-5 rounded-lg flex items-center justify-center shrink-0'
                            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
                          >
                            <MapPin size={10} style={{ color: primaryColor }} />
                          </div>
                          <span className='truncate'>{item.det_lugar_curso}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-end pt-2 border-t border-darkblue/10 dark:border-white/10'>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold'
                        style={{
                          backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)`,
                          color: primaryColor,
                        }}
                      >
                        <span>Ver detalles</span>
                        <ChevronRight size={12} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Barra inferior */}
                  <motion.div
                    className='h-0.5 w-0 group-hover:w-full transition-all duration-500'
                    style={gradientStyle}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Ver todos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mt-8'
        >
          <Link
            href='/#cursos'
            className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 group border'
            style={{
              backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
              color: primaryColor,
              borderColor: `color-mix(in srgb, ${primaryColor} 30%, transparent)`,
            }}
          >
            Ver todos los cursos y seminarios
            <ArrowRight size={14} className='group-hover:translate-x-0.5 transition-transform' />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

export default ContactForm