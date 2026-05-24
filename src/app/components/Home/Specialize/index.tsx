'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Calendar, Clock, Eye, Sparkles, Megaphone, FileText, Bell } from 'lucide-react'
import { getGacetaEventos, getInstitucionPrincipal } from '@/services/ambientalService'
import { ConvocatoriaType, CursoType, InstitucionType } from '@/app/types/ambiental.types'
import SpecializeSkeleton from '../../Skeleton/Specialize'

const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

const getRelativeTime = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  const diffDias = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDias === 0) return 'Hoy'
  if (diffDias === 1) return 'Ayer'
  if (diffDias < 7) return `Hace ${diffDias} días`
  if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`
  return formatFecha(fecha)
}

const isNew = (fecha: string) =>
  new Date(fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

const COLUMNAS = [
  { label: 'Convocatorias', icon: Megaphone, gradient: 'from-rose-500 to-orange-500',  href: '/#convocatorias' },
  { label: 'Comunicados',   icon: FileText,  gradient: 'from-blue-500 to-indigo-500',  href: '/#convocatorias' },
  { label: 'Avisos',        icon: Bell,      gradient: 'from-amber-500 to-yellow-500', href: '/#convocatorias' },
]

interface CardItem {
  id: number; titulo: string; imagen: string
  fecha: string; descripcion: string; href: string
}

const ItemCard = ({
  col, item,
}: {
  col: typeof COLUMNAS[0]
  item: CardItem | null
}) => {
  const [hovered, setHovered] = useState(false)
  const Icon = col.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 260 }}
    >
      <Link
        href={item ? item.href : col.href}
        className='group block bg-white dark:bg-lightdarkblue rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full'
        style={{ boxShadow: `0 10px 40px -15px color-mix(in srgb, var(--color-primario) 30%, transparent)` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Imagen */}
        <div className='relative h-44 overflow-hidden bg-gray-100 dark:bg-darklight'>
          {item?.imagen ? (
            <Image
              src={item.imagen}
              alt={item.titulo}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-700'
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${col.gradient} opacity-20`}>
              <Icon size={48} className='text-white opacity-60' />
            </div>
          )}

          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          <div className='absolute top-3 left-3 flex gap-2 items-center'>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg bg-gradient-to-r ${col.gradient} text-white flex items-center gap-1`}>
              <Icon size={11} />
              {col.label}
            </span>
            {item && isNew(item.fecha) && (
              <span className='flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-lg'>
                <Sparkles size={10} />
                NUEVO
              </span>
            )}
          </div>

          {item && (
            <div className='absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1'>
              <div className='flex items-center gap-1 text-white/80 text-[10px]'>
                <Eye size={10} />
                <span>Ver detalles</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className='p-4'>
          {item ? (
            <>
              {/* Título con hover dinámico */}
              <h5
                className='font-bold transition-colors line-clamp-2 mb-3 text-sm'
                style={{
                  color: hovered ? 'var(--color-primario)' : undefined,
                }}
              >
                {item.titulo}
              </h5>

              <div className='flex items-center justify-between gap-2 mb-3'>
                <div className='flex items-center gap-1.5 text-xs text-lightgrey'>
                  <Calendar size={12} />
                  <span>{formatFecha(item.fecha)}</span>
                </div>
                <div className='flex items-center gap-1.5 text-xs text-lightgrey/70'>
                  <Clock size={11} />
                  <span>{getRelativeTime(item.fecha)}</span>
                </div>
              </div>

              {item.descripcion && (
                <p className='text-xs text-lightgrey line-clamp-2 mb-3'>
                  {item.descripcion.replace(/<[^>]*>/g, '').substring(0, 90)}...
                </p>
              )}
            </>
          ) : (
            <p className='text-xs text-lightgrey italic mb-3'>
              Sin {col.label.toLowerCase()} disponibles.
            </p>
          )}

          {/* Footer */}
          <div className='flex items-center justify-between pt-2 border-t border-darkblue/10 dark:border-white/10'>
            <span className='text-xs font-medium' style={{ color: 'var(--color-primario)' }}>
              {item ? 'Leer más' : 'Ver sección'}
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className='w-7 h-7 rounded-full flex items-center justify-center'
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario) 10%, transparent)' }}
            >
              <ArrowRight size={13} style={{ color: 'var(--color-primario)' }} />
            </motion.div>
          </div>
        </div>

        {/* Borde inferior animado */}
        <motion.div
          className={`h-1 bg-gradient-to-r ${col.gradient}`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  )
}

const Specialize = () => {
  const [convocatorias, setConvocatorias] = useState<ConvocatoriaType[]>([])
  const [cursos, setCursos]               = useState<CursoType[]>([])
  const [institucion, setInstitucion]     = useState<InstitucionType | null>(null)
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gacetaData, principalData] = await Promise.all([
          getGacetaEventos(),
          getInstitucionPrincipal(),
        ])
        setConvocatorias(gacetaData.convocatorias)
        setCursos(gacetaData.cursos)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching Specialize:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getItem = (label: string): CardItem | null => {
    if (['Convocatorias', 'Comunicados', 'Avisos'].includes(label)) {
      const tipoMap: Record<string, string> = {
        Convocatorias: 'CONVOCATORIAS',
        Comunicados:   'COMUNICADOS',
        Avisos:        'AVISOS',
      }
      const found = convocatorias
        .filter(c => c.con_estado === '1' && c.tipo_conv_comun?.tipo_conv_comun_titulo === tipoMap[label])
        .sort((a, b) => new Date(b.con_fecha_inicio).getTime() - new Date(a.con_fecha_inicio).getTime())
        .at(0)
      if (!found) return null
      return {
        id: found.idconvocatorias, titulo: found.con_titulo,
        imagen: found.con_foto_portada, fecha: found.con_fecha_inicio,
        descripcion: found.con_descripcion, href: '/#convocatorias',
      }
    }
    if (['Cursos', 'Seminarios'].includes(label)) {
      const tipoMap: Record<string, string> = { Cursos: 'CURSOS', Seminarios: 'SEMINARIOS' }
      const found = cursos
        .filter(c => c.det_estado === '1' && c.tipo_curso_otro?.tipo_conv_curso_nombre === tipoMap[label])
        .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime())
        .at(0)
      if (!found) return null
      return {
        id: found.iddetalle_cursos_academicos, titulo: found.det_titulo,
        imagen: found.det_img_portada, fecha: found.det_fecha_ini,
        descripcion: found.det_descripcion, href: '/#cursos',
      }
    }
    return null
  }

  return (
    <section id='expertise' className='scroll-mt-12'>
      <div className='container'>
        <div className='text-center mb-10'>
          <h2 className='mb-4'>Lo más reciente</h2>
          <p className='text-lg font-normal max-w-2xl mx-auto text-lightgrey'>
            Convocatorias de la carrera de {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
          </p>
        </div>
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6'>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SpecializeSkeleton key={i} />)
            : COLUMNAS.map(col => (
                <ItemCard key={col.label} col={col} item={getItem(col.label)} />
              ))}
        </div>
      </div>
    </section>
  )
}

export default Specialize