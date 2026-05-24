'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Megaphone, FileText, Bell, GraduationCap,
  Users, Calendar, BookOpen, Newspaper,
  Heart, Briefcase, Video, ArrowRight,
  Sparkles, TrendingUp, Flame
} from 'lucide-react'
import {
  ConvocatoriaType, CursoType, EventoType,
  GacetaType, PublicacionType, ServicioType,
  OfertaAcademicaType, VideoType
} from '@/app/types/ambiental.types'

const iconMap: Record<string, { icon: React.ElementType; gradient: string }> = {
  'Convocatorias': { icon: Megaphone,     gradient: 'from-rose-500 to-orange-500' },
  'Comunicados':   { icon: FileText,      gradient: 'from-blue-500 to-indigo-500' },
  'Avisos':        { icon: Bell,          gradient: 'from-amber-500 to-yellow-500' },
  'Cursos':        { icon: GraduationCap, gradient: 'from-emerald-500 to-teal-500' },
  'Seminarios':    { icon: Users,         gradient: 'from-purple-500 to-fuchsia-500' },
  'Eventos':       { icon: Calendar,      gradient: 'from-pink-500 to-rose-500' },
  'Publicaciones': { icon: BookOpen,      gradient: 'from-slate-600 to-gray-600' },
  'Gaceta':        { icon: Newspaper,     gradient: 'from-stone-600 to-neutral-600' },
  'Servicios':     { icon: Heart,         gradient: 'from-green-500 to-emerald-500' },
  'Ofertas':       { icon: Briefcase,     gradient: 'from-cyan-500 to-sky-500' },
  'Videos':        { icon: Video,         gradient: 'from-red-500 to-rose-500' },
}

interface Props {
  convocatorias: ConvocatoriaType[]
  cursos: CursoType[]
  eventos: EventoType[]
  gaceta: GacetaType[]
  publicaciones: PublicacionType[]
  servicios: ServicioType[]
  ofertas: OfertaAcademicaType[]
  videos: VideoType[]
  loading: boolean
}

export default function CategoriesExplorer({
  convocatorias = [],
  cursos = [],
  eventos = [],
  gaceta = [],
  publicaciones = [],
  servicios = [],
  ofertas = [],
  videos = [],
  loading,
}: Props) {
  const categories = [
    { label: 'Convocatorias', href: '/#convocatorias', count: convocatorias.filter(c => c.con_estado === '1').length },
    { label: 'Comunicados',   href: '/#convocatorias', count: convocatorias.filter(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === 'COMUNICADOS').length },
    { label: 'Avisos',        href: '/#convocatorias', count: convocatorias.filter(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === 'AVISOS').length },
    { label: 'Cursos',        href: '/#cursos',        count: cursos.filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'CURSOS').length },
    { label: 'Seminarios',    href: '/#cursos',        count: cursos.filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'SEMINARIOS').length },
    { label: 'Eventos',       href: '/#eventos',       count: eventos.length },
    { label: 'Publicaciones', href: '/#publicaciones', count: publicaciones.length },
    { label: 'Gaceta',        href: '/#gaceta',        count: gaceta.length },
    { label: 'Servicios',     href: '/#servicios',     count: servicios.length },
    { label: 'Ofertas',       href: '/#ofertas',       count: ofertas.length },
    { label: 'Videos',        href: '/#videos',        count: videos.length },
  ]

  const maxCount = Math.max(...categories.map(c => c.count), 1)

  const getPopularityLevel = (count: number) => {
    if (count === 0) return 0
    if (count >= maxCount * 0.7) return 3
    if (count >= maxCount * 0.4) return 2
    return 1
  }

  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className='h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse' />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2.5'>
      {categories.map((cat, index) => {
        const IconComponent = iconMap[cat.label]?.icon ?? Sparkles
        const gradient = iconMap[cat.label]?.gradient ?? 'from-emerald-500 to-teal-500'
        const popularity = getPopularityLevel(cat.count)

        return (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.4, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.01, x: 4 }}
          >
            <Link
              href={cat.href}
              className='group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-white dark:bg-lightdarkblue border border-darkblue/10 dark:border-white/10 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden'
            >
              {/* Gradiente hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Brillo láser */}
              <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent' style={{ transform: 'skewX(-20deg)' }} />

              {/* Izquierda */}
              <div className='relative z-10 flex items-center gap-3'>
                <motion.div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <IconComponent size={18} />
                </motion.div>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold text-darkblue dark:text-white'>
                    {cat.label}
                  </span>
                  {popularity > 0 && (
                    <div className='flex items-center gap-1'>
                      {popularity === 3 && <Flame size={10} className='text-orange-500' />}
                      {popularity === 2 && <TrendingUp size={10} className='text-green-500' />}
                      <span className='text-[10px] text-lightgrey'>
                        {popularity === 3 && 'Muy popular'}
                        {popularity === 2 && 'Popular'}
                        {popularity === 1 && 'Activo'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Derecha */}
              <div className='relative z-10 flex items-center gap-3'>
                {popularity > 0 && (
                  <div className='hidden sm:block w-16 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / maxCount) * 100}%` }}
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      transition={{ delay: index * 0.04, duration: 0.8 }}
                    />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradient} shadow-md`}
                >
                  <span className='text-xs font-black text-white'>{cat.count}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className='text-lightgrey'
                >
                  <ArrowRight size={16} />
                </motion.div>
              </div>

              {/* Barra lateral */}
              <motion.div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r bg-gradient-to-b ${gradient}`}
                animate={{ height: 0 }}
                whileHover={{ height: 32 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}