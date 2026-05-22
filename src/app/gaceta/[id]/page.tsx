// src/app/gaceta/[id]/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeft, FileText, Calendar, Download,
  AlertCircle, Leaf, Wind, Droplets, Maximize2,
} from 'lucide-react'
import { getGacetaEventos } from '@/services/ambientalService'
import { GacetaType } from '@/app/types/ambiental.types'

// ── Helpers ───────────────────────────────────────────────
const mesesLargos = ['enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre']

const formatFechaLarga = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} de ${mesesLargos[d.getMonth()]} de ${d.getFullYear()}`
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

// ══════════════════════════════════════════════════════════
export default function DetalleGacetaPage() {
  const params                  = useParams()
  const id                      = Number(params.id)
  const [item, setItem]         = useState<GacetaType | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    getGacetaEventos()
      .then(data => {
        const found = data.upea_gaceta_universitaria.find((g: GacetaType) => g.gaceta_id === id)
        if (found) setItem(found)
        else setNotFound(true)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-12 h-12 rounded-full border-4 border-primary border-t-transparent'
        />
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <div className='text-center'>
          <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30
                          flex items-center justify-center'>
            <AlertCircle size={40} className='text-red-500' />
          </div>
          <h2 className='text-2xl font-bold text-darkblue dark:text-white mb-2'>No encontrado</h2>
          <p className='text-lightgrey mb-6'>El documento que buscas no existe.</p>
          <Link
            href='/gaceta'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-primary/10 text-primary border border-primary/20
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a gaceta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas */}
      <EnvParticle icon={Leaf}     x='3%'  y='10%' delay={0}   size={32} />
      <EnvParticle icon={Wind}     x='88%' y='20%' delay={1}   size={28} />
      <EnvParticle icon={Droplets} x='82%' y='65%' delay={2}   size={24} />
      <EnvParticle icon={Leaf}     x='8%'  y='75%' delay={0.5} size={36} />

      <div className='container relative z-10 py-12'>

        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className='mb-8'
        >
          <Link
            href='/gaceta'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary
                       hover:-translate-x-1 transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a gaceta
          </Link>
        </motion.div>

        {/* Header del documento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white dark:bg-lightdarkblue rounded-2xl p-6 mb-6
                     border border-darkblue/10 dark:border-white/10 shadow-sm'
        >
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                <FileText size={22} className='text-primary' />
              </div>
              <div>
                <span className='text-xs font-bold px-2.5 py-1 rounded-full
                                 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2 inline-block'>
                  {item.gaceta_tipo}
                </span>
                <h1 className='text-xl sm:text-2xl font-black text-darkblue dark:text-white leading-tight'>
                  {item.gaceta_titulo}
                </h1>
                <div className='flex items-center gap-1.5 text-xs text-lightgrey mt-2'>
                  <Calendar size={11} className='text-primary' />
                  <span>{formatFechaLarga(item.gaceta_fecha)}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className='flex items-center gap-2 shrink-0'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFullscreen(!fullscreen)}
                className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                           bg-primary/10 text-primary hover:bg-primary hover:text-white
                           transition-all duration-300'
              >
                <Maximize2 size={13} />
                {fullscreen ? 'Reducir' : 'Pantalla completa'}
              </motion.button>

              <Link
                href={item.gaceta_documento}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                           bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                           hover:bg-emerald-500 hover:text-white transition-all duration-300'
              >
                <Download size={13} />
                Descargar
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Visor PDF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-2xl overflow-hidden shadow-2xl border border-darkblue/10 dark:border-white/10
                      transition-all duration-500 ${fullscreen ? 'fixed inset-4 z-50 m-0' : ''}`}
        >
          {fullscreen && (
            <div className='absolute top-3 right-3 z-10'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setFullscreen(false)}
                className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                           bg-white/90 text-darkblue shadow-lg'
              >
                <Maximize2 size={13} />
                Cerrar
              </motion.button>
            </div>
          )}

          <iframe
            src={`${item.gaceta_documento}#toolbar=1&navpanes=1&scrollbar=1`}
            className='w-full border-0'
            style={{ height: fullscreen ? '100%' : '80vh', minHeight: '500px' }}
            title={item.gaceta_titulo}
          />
        </motion.div>

        {/* Fallback mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mt-4 text-center'
        >
          <p className='text-xs text-lightgrey mb-2'>
            ¿No se visualiza el PDF? Puedes abrirlo directamente:
          </p>
          <Link
            href={item.gaceta_documento}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                       border border-primary/30 text-primary hover:bg-primary hover:text-white
                       transition-all duration-300'
          >
            <FileText size={13} />
            Abrir PDF en nueva pestaña
          </Link>
        </motion.div>

      </div>
    </div>
  )
}