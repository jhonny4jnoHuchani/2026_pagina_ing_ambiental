// src/app/gaceta/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileText, Calendar, Download, Eye,
  Leaf, Wind, Droplets, ChevronRight,
} from 'lucide-react'
import { getGacetaEventos, getContenido } from '@/services/ambientalService'
import { GacetaType, PortadaType } from '@/app/types/ambiental.types'
import Image from 'next/image'

// ── Helpers ───────────────────────────────────────────────
const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

// ── Partícula decorativa ──────────────────────────────────
const EnvParticle = ({ icon: Icon, x, y, delay, size = 20 }: {
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
const GacetaSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 6 }).map((_, i) => (
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

// ── Card ──────────────────────────────────────────────────
const GacetaCard = ({ item, index }: { item: GacetaType; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6 }}
  >
    <div className='group flex flex-col h-full bg-white dark:bg-lightdarkblue rounded-2xl
                    overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
                    border border-darkblue/10 dark:border-white/10'>

      {/* Vista previa PDF como iframe */}
      <div className='relative h-52 overflow-hidden bg-gray-50 dark:bg-darklight shrink-0'>
        <iframe
          src={`${item.gaceta_documento}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
          className='w-full h-full border-0 pointer-events-none scale-[1.0] origin-top'
          title={item.gaceta_titulo}
          loading='lazy'
        />
        {/* Overlay que evita interacción y da efecto hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent
                        to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Badge tipo */}
        <span className='absolute top-3 left-3 flex items-center gap-1 text-white
                         text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md
                         bg-gradient-to-r from-emerald-600 to-teal-600'>
          <FileText size={9} />
          {item.gaceta_tipo}
        </span>

        {/* Icono PDF hover */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0
                        group-hover:opacity-100 transition-opacity duration-300'>
          <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm
                          flex items-center justify-center'>
            <Eye size={20} className='text-white' />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className='flex flex-col flex-1 p-4'>
        <h5 className='font-bold text-darkblue dark:text-white text-sm mb-3 line-clamp-2
                       group-hover:text-primary transition-colors duration-200'>
          {item.gaceta_titulo}
        </h5>

        <div className='flex items-center gap-1.5 text-xs text-lightgrey mb-4'>
          <Calendar size={11} className='text-primary shrink-0' />
          <span>{formatFecha(item.gaceta_fecha)}</span>
        </div>

        {/* Botones */}
        <div className='flex items-center gap-2 mt-auto pt-3 border-t border-darkblue/10 dark:border-white/10'>
          <Link
            href={`/gaceta/${item.gaceta_id}`}
            className='flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                       text-xs font-semibold bg-primary/10 text-primary
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <Eye size={12} />
            Ver
          </Link>
          <Link
            href={item.gaceta_documento}
            target='_blank'
            rel='noopener noreferrer'
            className='flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                       text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                       hover:bg-emerald-500 hover:text-white transition-all duration-300'
          >
            <Download size={12} />
            Descargar
          </Link>
        </div>
      </div>

      {/* Barra inferior */}
      <div className='h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500' />
    </div>
  </motion.div>
)

// ══════════════════════════════════════════════════════════
export default function GacetaPage() {
  const [items, setItems]       = useState<GacetaType[]>([])
  const [portadas, setPortadas] = useState<PortadaType[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getGacetaEventos(), getContenido()])
      .then(([gacetaData, contenidoData]) => {
        const sorted = [...gacetaData.upea_gaceta_universitaria].sort(
          (a, b) => new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime()
        )
        setItems(sorted)
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

      {/* ── Hero ── */}
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
                alt={portadas[0].portada_titulo ?? 'Gaceta Universitaria'}
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
              <FileText size={30} className='text-white' />
            </motion.div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg'>
              Gaceta Universitaria
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '5rem' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='h-1 bg-primary rounded-full mx-auto'
            />
            <p className='text-gray-200 max-w-xl mx-auto text-base drop-shadow'>
              Documentos y resoluciones oficiales — Ingeniería Ambiental UPEA
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className='py-14'>
        <div className='container'>
          {loading ? (
            <GacetaSkeleton />
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10
                              flex items-center justify-center'>
                <FileText size={32} className='text-primary opacity-50' />
              </div>
              <p className='text-lightgrey'>No hay documentos disponibles.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {items.map((item, index) => (
                  <GacetaCard key={item.gaceta_id} item={item} index={index} />
                ))}
              </div>
            </AnimatePresence>
          )}

          {!loading && items.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-center mt-8 text-sm text-lightgrey'
            >
              {items.length} {items.length === 1 ? 'documento disponible' : 'documentos disponibles'}
            </motion.p>
          )}
        </div>
      </section>
    </div>
  )
}