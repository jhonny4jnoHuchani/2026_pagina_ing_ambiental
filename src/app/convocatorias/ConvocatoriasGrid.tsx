'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, ChevronRight, Leaf, Wind, Droplets, Search, Filter } from 'lucide-react'
import { getGacetaEventos, getContenido } from '@/services/ambientalService'
import { ConvocatoriaType, PortadaType } from '@/app/types/ambiental.types'
import {
  TipoConvocatoria, formatFecha, isExpired, isActive,
  getTypeStyle, filterByTipo, Chip, SectionIn, ConvocatoriasSkeleton,
} from './_shared'

// ── Partícula decorativa ──────────────────────────────────
const EnvParticle = ({
  icon: Icon, x, y, delay, size = 20,
}: {
  icon: React.ElementType; x: string; y: string; delay: number; size?: number
}) => (
  <motion.div
    className='absolute pointer-events-none z-0 text-primary opacity-5 dark:opacity-10'
    style={{ left: x, top: y }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Icon size={size} />
  </motion.div>
)

// ── Título por tipo ───────────────────────────────────────
const titleMap: Record<TipoConvocatoria, string> = {
  CONVOCATORIAS: 'Convocatorias',
  COMUNICADOS:   'Comunicados',
  AVISOS:        'Avisos',
}

// ── Card individual ───────────────────────────────────────
const ConvocatoriaCard = ({ item, index }: { item: ConvocatoriaType; index: number }) => {
  const tipo      = item.tipo_conv_comun?.tipo_conv_comun_titulo as TipoConvocatoria
  const typeStyle = getTypeStyle(tipo)
  const TypeIcon  = typeStyle.icon
  const expired   = isExpired(item.con_fecha_fin)
  const active    = isActive(item.con_fecha_inicio, item.con_fecha_fin)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/convocatorias/${item.idconvocatorias}`}
        className='group flex flex-col h-full bg-white dark:bg-lightdarkblue rounded-2xl overflow-hidden
                   shadow-md hover:shadow-xl transition-all duration-300
                   border border-darkblue/10 dark:border-white/10'
      >
        {/* Imagen */}
        <div className='relative h-44 overflow-hidden bg-gray-100 dark:bg-darklight shrink-0'>
          {item.con_foto_portada ? (
            <>
              <Image
                src={item.con_foto_portada}
                alt={item.con_titulo}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </>
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-primary/5 dark:bg-primary/10'>
              <TypeIcon size={40} className='text-primary opacity-30' />
            </div>
          )}

          {/* Badge tipo */}
          <span className={`absolute top-3 left-3 flex items-center gap-1 text-white text-[10px]
                            font-bold px-2.5 py-1 rounded-full shadow-md bg-gradient-to-r ${typeStyle.gradient}`}>
            <TypeIcon size={9} />
            {typeStyle.label}
          </span>

          {/* Badge estado */}
          {active && (
            <span className='absolute top-3 right-3 bg-emerald-500 text-white text-[10px]
                             font-bold px-2 py-1 rounded-full shadow-md'>
              ACTIVO
            </span>
          )}
          {expired && (
            <span className='absolute top-3 right-3 bg-red-500 text-white text-[10px]
                             font-bold px-2 py-1 rounded-full shadow-md'>
              FINALIZADO
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className='flex flex-col flex-1 p-4'>
          <h5 className='font-bold text-darkblue dark:text-white text-sm mb-2 line-clamp-2
                         group-hover:text-primary transition-colors duration-200'>
            {item.con_titulo}
          </h5>

          <div className='flex items-center gap-1.5 text-xs text-lightgrey mb-3'>
            <Calendar size={11} className='text-primary shrink-0' />
            <span>{formatFecha(item.con_fecha_inicio)}</span>
            {item.con_fecha_fin && (
              <>
                <span>—</span>
                <span>{formatFecha(item.con_fecha_fin)}</span>
              </>
            )}
          </div>

          {item.con_descripcion && (
            <p className='text-xs text-lightgrey line-clamp-2 mb-3 flex-1'
              dangerouslySetInnerHTML={{
                __html: item.con_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...',
              }}
            />
          )}

          {/* Footer card */}
          <div className='flex items-center justify-end pt-3 mt-auto border-t border-darkblue/10 dark:border-white/10'>
            <motion.div
              whileHover={{ x: 3 }}
              className='flex items-center gap-1 text-xs font-semibold text-primary'
            >
              {/* 🎨 COLOR DINÁMICO FUTURO: text-primary → colorinstitucion[0].color_primario */}
              Ver detalles
              <ChevronRight size={12} />
            </motion.div>
          </div>
        </div>

        {/* Barra inferior animada */}
        {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
        <div className='h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500' />
      </Link>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL REUTILIZABLE
// ══════════════════════════════════════════════════════════
export default function ConvocatoriasGrid({ tipo }: { tipo: TipoConvocatoria }) {
  const [allItems, setAllItems]       = useState<ConvocatoriaType[]>([])
  const [filtered, setFiltered]       = useState<ConvocatoriaType[]>([])
  const [portadas, setPortadas]       = useState<PortadaType[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [showActivos, setShowActivos] = useState(false)

  const title     = titleMap[tipo]
  const typeStyle = getTypeStyle(tipo)
  const TypeIcon  = typeStyle.icon

  useEffect(() => {
    Promise.all([getGacetaEventos(), getContenido()])
      .then(([gacetaData, contenidoData]) => {
        const items = filterByTipo(gacetaData.convocatorias, tipo)
        setAllItems(items)
        setFiltered(items)
        setPortadas(contenidoData.portada)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tipo])

  // Filtros
  useEffect(() => {
    let result = [...allItems]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        i => i.con_titulo.toLowerCase().includes(q) ||
             i.con_descripcion?.toLowerCase().includes(q)
      )
    }
    if (showActivos) {
      result = result.filter(i => isActive(i.con_fecha_inicio, i.con_fecha_fin))
    }
    setFiltered(result)
  }, [search, showActivos, allItems])

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas decorativas */}
      <EnvParticle icon={Leaf}     x='3%'  y='12%' delay={0}   size={32} />
      <EnvParticle icon={Wind}     x='88%' y='20%' delay={1}   size={28} />
      <EnvParticle icon={Droplets} x='82%' y='65%' delay={2}   size={24} />
      <EnvParticle icon={Leaf}     x='8%'  y='75%' delay={0.5} size={36} />

      {/* ── Hero con portada de fondo ── */}
      <section className='relative h-72 md:h-80 lg:h-96 w-full overflow-hidden'>

        {/* Imagen de fondo */}
        {portadas[0]?.portada_imagen ? (
          <>
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              className='absolute inset-0'
            >
              <Image
                src={portadas[0].portada_imagen}
                alt={portadas[0].portada_titulo ?? title}
                fill
                priority
                className='object-cover object-center'
              />
            </motion.div>
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70' />
          </>
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-darkblue to-darklight dark:from-darkmode dark:to-darklight' />
        )}

        {/* Patrón punteado */}
        <div
          className='absolute inset-0 opacity-10 pointer-events-none'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className='relative h-full flex flex-col items-center justify-center container text-center z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-4'
          >
            {/* Icono animado */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className='inline-flex items-center justify-center w-16 h-16 rounded-2xl
                         bg-white/10 backdrop-blur-sm mb-2'
            >
              <TypeIcon size={30} className='text-white' />
            </motion.div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg'>
              {title}
            </h1>

            {/* Línea animada */}
            {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '5rem' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='h-1 bg-primary rounded-full mx-auto'
            />

            <p className='text-gray-200 max-w-xl mx-auto text-base drop-shadow'>
              Listado oficial de {title.toLowerCase()} de la Carrera de Ingeniería Ambiental — UPEA
            </p>
          </motion.div>

          
        </div>
      </section>

      {/* ── Filtros ── */}
      <section className='py-6 bg-white dark:bg-darklight border-b border-darkblue/10 dark:border-white/5 sticky top-0 z-20'>
        <div className='container flex flex-col sm:flex-row gap-3 items-center justify-between'>
          {/* Búsqueda */}
          <div className='relative w-full sm:max-w-sm'>
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-lightgrey' />
            <input
              type='text'
              placeholder={`Buscar ${title.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full pl-9 pr-4 py-2 text-sm rounded-lg
                         border border-lightgrey/20 focus:border-primary outline-none
                         bg-transparent text-darkblue dark:text-white
                         placeholder:text-lightgrey/50 transition-colors'
            />
          </div>

          <div className='flex items-center gap-3'>
            {/* Toggle activos */}
            <button
              onClick={() => setShowActivos(!showActivos)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${showActivos
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
            >
              <Filter size={13} />
              Solo activos
            </button>

            {/* Contador */}
            <span className='text-xs text-lightgrey'>
              {loading ? '...' : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </section>

      {/* ── Grid de resultados ── */}
      <section className='py-14'>
        <div className='container'>
          {loading ? (
            <ConvocatoriasSkeleton />
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center'>
                <TypeIcon size={32} className='text-primary opacity-50' />
              </div>
              <p className='text-lightgrey'>
                {search ? 'No se encontraron resultados para tu búsqueda.' : `No hay ${title.toLowerCase()} disponibles.`}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='mt-4 text-sm text-primary hover:underline'
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filtered.map((item, i) => (
                  <ConvocatoriaCard key={item.idconvocatorias} item={item} index={i} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}