// RUTA: src/app/publicaciones/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Calendar, ChevronRight, Leaf, Wind,
  Droplets, Newspaper, User, Search,
} from 'lucide-react'
import { getRecursos, getContenido } from '@/services/ambientalService'
import { PublicacionType, PortadaType } from '@/app/types/ambiental.types'

// ── Helpers ───────────────────────────────────────────────
const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

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

// ── Skeleton ──────────────────────────────────────────────
const PublicacionesSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='rounded-2xl bg-white dark:bg-lightdarkblue overflow-hidden shadow-md animate-pulse'>
        <div className='h-48 bg-gray-200 dark:bg-white/10' />
        <div className='p-4 space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-full' />
        </div>
      </div>
    ))}
  </div>
)

// ══════════════════════════════════════════════════════════
export default function PublicacionesPage() {
  const [allItems, setAllItems] = useState<PublicacionType[]>([])
  const [filtered, setFiltered] = useState<PublicacionType[]>([])
  const [portadas, setPortadas] = useState<PortadaType[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    Promise.all([getRecursos(), getContenido()])
      .then(([recursosData, contenidoData]) => {
        const sorted = [...recursosData.upea_publicaciones].sort(
          (a, b) => new Date(b.publicaciones_fecha).getTime() - new Date(a.publicaciones_fecha).getTime()
        )
        setAllItems(sorted)
        setFiltered(sorted)
        setPortadas(contenidoData.portada)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Filtro por búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(allItems)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      allItems.filter(
        i => i.publicaciones_titulo.toLowerCase().includes(q) ||
             i.publicaciones_descripcion?.toLowerCase().includes(q) ||
             i.publicaciones_autor?.toLowerCase().includes(q)
      )
    )
  }, [search, allItems])

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas */}
      <EnvParticle icon={Leaf}     x='3%'  y='12%' delay={0}   size={32} />
      <EnvParticle icon={Wind}     x='88%' y='20%' delay={1}   size={28} />
      <EnvParticle icon={Droplets} x='82%' y='65%' delay={2}   size={24} />
      <EnvParticle icon={Leaf}     x='8%'  y='75%' delay={0.5} size={36} />

      {/* ── Hero con portada de fondo ── */}
      <section className='relative h-72 md:h-80 lg:h-96 w-full overflow-hidden'>
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
                alt={portadas[0].portada_titulo ?? 'Publicaciones'}
                fill priority
                className='object-cover object-center'
              />
            </motion.div>
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70' />
          </>
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-darkblue to-darklight' />
        )}

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
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className='inline-flex items-center justify-center w-16 h-16 rounded-2xl
                         bg-white/10 backdrop-blur-sm mb-2'
            >
              <Newspaper size={30} className='text-white' />
            </motion.div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg'>
              Publicaciones
            </h1>

            {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '5rem' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='h-1 bg-primary rounded-full mx-auto'
            />

            <p className='text-gray-200 max-w-xl mx-auto text-base drop-shadow'>
              Noticias y publicaciones de la Carrera de Ingeniería Ambiental — UPEA
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Barra de búsqueda ── */}
      <section className='py-5 bg-white dark:bg-darklight border-b border-darkblue/10
                          dark:border-white/5 sticky top-0 z-20'>
        <div className='container flex flex-col sm:flex-row gap-3 items-center justify-between'>
          <div className='relative w-full sm:max-w-sm'>
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-lightgrey' />
            <input
              type='text'
              placeholder='Buscar publicaciones...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full pl-9 pr-4 py-2 text-sm rounded-lg
                         border border-lightgrey/20 focus:border-primary outline-none
                         bg-transparent text-darkblue dark:text-white
                         placeholder:text-lightgrey/50 transition-colors'
            />
          </div>
          <span className='text-xs text-lightgrey'>
            {loading ? '...' : `${filtered.length} publicación${filtered.length !== 1 ? 'es' : ''}`}
          </span>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className='py-14'>
        <div className='container'>
          {loading ? (
            <PublicacionesSkeleton />
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10
                              flex items-center justify-center'>
                <Newspaper size={32} className='text-primary opacity-50' />
              </div>
              <p className='text-lightgrey'>
                {search ? 'No se encontraron resultados.' : 'No hay publicaciones disponibles.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='mt-3 text-sm text-primary hover:underline'
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filtered.map((item, index) => (
                  <motion.div
                    key={item.publicaciones_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={`/publicaciones/${item.publicaciones_id}`}
                      className='group flex flex-col h-full bg-white dark:bg-lightdarkblue rounded-2xl
                                 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
                                 border border-darkblue/10 dark:border-white/10'
                    >
                      {/* Imagen */}
                      <div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-darklight shrink-0'>
                        {item.publicaciones_imagen ? (
                          <>
                            <Image
                              src={item.publicaciones_imagen}
                              alt={item.publicaciones_titulo}
                              fill
                              className='object-cover group-hover:scale-105 transition-transform duration-500'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent
                                            to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                          </>
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-primary/5'>
                            <Newspaper size={48} className='text-primary opacity-20' />
                          </div>
                        )}

                        {/* Badge tipo */}
                        <span className='absolute top-3 left-3 flex items-center gap-1 text-white
                                         text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md
                                         bg-gradient-to-r from-emerald-500 to-teal-500 capitalize'>
                          <Newspaper size={9} />
                          {item.publicaciones_titulo}
                        </span>
                      </div>

                      {/* Contenido */}
                      <div className='flex flex-col flex-1 p-4'>

                        {/* Fecha + autor */}
                        <div className='flex items-center gap-3 mb-3 flex-wrap'>
                          <div className='flex items-center gap-1.5 text-xs text-lightgrey'>
                            <Calendar size={11} className='text-primary shrink-0' />
                            <span>{formatFecha(item.publicaciones_fecha)}</span>
                          </div>
                          {item.publicaciones_autor && (
                            <div className='flex items-center gap-1.5 text-xs text-lightgrey'>
                              <User size={11} className='text-primary shrink-0' />
                              <span className='capitalize'>{item.publicaciones_autor}</span>
                            </div>
                          )}
                        </div>

                        {/* Descripción */}
                        {item.publicaciones_descripcion && (
                          <p
                            className='text-sm text-lightgrey line-clamp-3 mb-3 flex-1 leading-relaxed'
                            dangerouslySetInnerHTML={{
                              __html: item.publicaciones_descripcion
                                .replace(/<[^>]*>/g, '')
                                .substring(0, 140) + '...',
                            }}
                          />
                        )}

                        {/* Footer */}
                        <div className='flex items-center justify-between pt-3 mt-auto
                                        border-t border-darkblue/10 dark:border-white/10'>
                          <span className='text-xs text-lightgrey/60 uppercase tracking-wider'>
                            {item.publicaciones_tipo}
                          </span>
                          <motion.div
                            whileHover={{ x: 3 }}
                            className='flex items-center gap-1 text-xs font-semibold text-primary'
                          >
                            {/* 🎨 COLOR DINÁMICO FUTURO: text-primary → colorinstitucion[0].color_primario */}
                            Leer más
                            <ChevronRight size={12} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Barra inferior animada */}
                      {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
                      <div className='h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500' />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}