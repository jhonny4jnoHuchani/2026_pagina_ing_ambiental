// RUTA: src/app/servicios/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Phone, ChevronRight, Leaf, Wind, Droplets, Wrench } from 'lucide-react'
import { getGacetaEventos, getContenido } from '@/services/ambientalService'
import { ServicioType, PortadaType } from '@/app/types/ambiental.types'

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
const ServiciosSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className='rounded-2xl bg-white dark:bg-lightdarkblue overflow-hidden shadow-md animate-pulse'>
        <div className='h-48 bg-gray-200 dark:bg-white/10' />
        <div className='p-4 space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2' />
        </div>
      </div>
    ))}
  </div>
)

// ══════════════════════════════════════════════════════════
export default function ServiciosPage() {
  const [items, setItems]         = useState<ServicioType[]>([])
  const [portadas, setPortadas]   = useState<PortadaType[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([getGacetaEventos(), getContenido()])
      .then(([gacetaData, contenidoData]) => {
        const activos = [...gacetaData.serviciosCarrera]
          .filter(s => s.serv_active === '1')
          .sort((a, b) => b.serv_id - a.serv_id)
        setItems(activos)
        setPortadas(contenidoData.portada)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
                alt={portadas[0].portada_titulo ?? 'Servicios'}
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
              <Wrench size={30} className='text-white' />
            </motion.div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg'>
              Servicios
            </h1>

            {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '5rem' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='h-1 bg-primary rounded-full mx-auto'
            />

            <p className='text-gray-200 max-w-xl mx-auto text-base drop-shadow'>
              Servicios ofrecidos por la Carrera de Ingeniería Ambiental — UPEA
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className='py-14'>
        <div className='container'>
          {loading ? (
            <ServiciosSkeleton />
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center'>
                <Wrench size={32} className='text-primary opacity-50' />
              </div>
              <p className='text-lightgrey'>No hay servicios disponibles.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {items.map((item, index) => (
                  <motion.div
                    key={item.serv_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={`/servicios/${item.serv_id}`}
                      className='group flex flex-col h-full bg-white dark:bg-lightdarkblue rounded-2xl
                                 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
                                 border border-darkblue/10 dark:border-white/10'
                    >
                      {/* Imagen */}
                      <div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-darklight shrink-0'>
                        {item.serv_imagen ? (
                          <>
                            <Image
                              src={item.serv_imagen}
                              alt={item.serv_nombre}
                              fill
                              className='object-cover group-hover:scale-105 transition-transform duration-500'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent
                                            to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                          </>
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-primary/5'>
                            <Wrench size={48} className='text-primary opacity-20' />
                          </div>
                        )}

                        {/* Badge activo */}
                        <span className='absolute top-3 left-3 bg-emerald-500 text-white text-[10px]
                                         font-bold px-2.5 py-1 rounded-full shadow-md'>
                          ACTIVO
                        </span>
                      </div>

                      {/* Contenido */}
                      <div className='flex flex-col flex-1 p-4'>
                        <h5 className='font-bold text-darkblue dark:text-white text-sm mb-3 line-clamp-2
                                       group-hover:text-primary transition-colors duration-200'>
                          {item.serv_nombre}
                        </h5>

                        {item.serv_nro_celular > 0 && (
                          <div className='flex items-center gap-1.5 text-xs text-lightgrey mb-3'>
                            <Phone size={11} className='text-primary shrink-0' />
                            <span>{item.serv_nro_celular}</span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className='flex items-center justify-end pt-3 mt-auto
                                        border-t border-darkblue/10 dark:border-white/10'>
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
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* Contador */}
          {!loading && items.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-center mt-8 text-sm text-lightgrey'
            >
              {items.length} {items.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
            </motion.p>
          )}
        </div>
      </section>
    </div>
  )
}