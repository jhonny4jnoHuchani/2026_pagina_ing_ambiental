'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Calendar, CalendarDays, FileText,
  ArrowLeft, Download, XCircle, CheckCircle,
  Leaf, Wind, Droplets,
} from 'lucide-react'

import { getGacetaEventos } from '@/services/ambientalService'
import { ConvocatoriaType } from '@/app/types/ambiental.types'
import {
  TipoConvocatoria, formatFechaLarga, isExpired, isActive,
  getTypeStyle, Chip, SectionIn,
} from '../_shared'

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

// ══════════════════════════════════════════════════════════
// PÁGINA DETALLE
// ══════════════════════════════════════════════════════════
export default function DetalleConvocatoriaPage() {
  const params                        = useParams()
  const id                            = Number(params.id)
  const [item, setItem]               = useState<ConvocatoriaType | null>(null)
  const [loading, setLoading]         = useState(true)
  const [notFound, setNotFound]       = useState(false)

  useEffect(() => {
    getGacetaEventos()
      .then(data => {
        const found = data.convocatorias.find((c: ConvocatoriaType) => c.idconvocatorias === id)
        if (found) setItem(found)
        else setNotFound(true)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // ── Loading ──
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

  // ── Not found ──
  if (notFound || !item) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <div className='text-center'>
          <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center'>
            <XCircle size={40} className='text-red-500' />
          </div>
          <h2 className='text-2xl font-bold text-darkblue dark:text-white mb-2'>No encontrado</h2>
          <p className='text-lightgrey mb-6'>La convocatoria que buscas no existe.</p>
          <Link
            href='/convocatorias'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-primary/10 text-primary border border-primary/20
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a convocatorias
          </Link>
        </div>
      </div>
    )
  }

  const tipo      = item.tipo_conv_comun?.tipo_conv_comun_titulo as TipoConvocatoria
  const typeStyle = getTypeStyle(tipo)
  const TypeIcon  = typeStyle.icon
  const expired   = isExpired(item.con_fecha_fin)
  const active    = isActive(item.con_fecha_inicio, item.con_fecha_fin)

  const handleDownload = () => {
    if (!item.con_foto_portada) return
    const a = document.createElement('a')
    a.href = item.con_foto_portada
    a.download = `convocatoria_${item.idconvocatorias}.webp`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
            href='/convocatorias'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary
                       hover:-translate-x-1 transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a convocatorias
          </Link>
        </motion.div>

        {/* Grid principal */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>

          {/* ── Col izquierda — Imagen ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className='sticky top-24'>
              <div className='relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-darklight shadow-2xl
                              border border-darkblue/10 dark:border-white/10'>
                {item.con_foto_portada ? (
                  <>
                    <Image
                      src={item.con_foto_portada}
                      alt={item.con_titulo}
                      width={600}
                      height={600}
                      className='w-full h-auto object-contain'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                  </>
                ) : (
                  <div className='w-full h-96 flex flex-col items-center justify-center bg-primary/5'>
                    <TypeIcon size={60} className='text-primary opacity-20' />
                    <p className='text-lightgrey mt-4 text-sm'>Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Botón descargar */}
              {item.con_foto_portada && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3
                             rounded-xl text-sm font-semibold text-white bg-primary
                             hover:bg-primary/90 transition-all duration-300 shadow-lg'
                >
                  {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary → colorinstitucion[0].color_primario */}
                  <Download size={16} />
                  Descargar imagen
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* ── Col derecha — Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-6'
          >
            {/* Badges */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                rounded-full text-white shadow-md bg-gradient-to-r ${typeStyle.gradient}`}>
                <TypeIcon size={11} />
                {typeStyle.label}
              </span>
              {active && (
                <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                 rounded-full bg-emerald-500 text-white shadow-md'>
                  <CheckCircle size={11} />
                  ACTIVO
                </span>
              )}
              {expired && (
                <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                 rounded-full bg-red-500 text-white shadow-md'>
                  <XCircle size={11} />
                  FINALIZADO
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-darkblue dark:text-white leading-tight'>
              {item.con_titulo}
            </h1>

            {/* Fechas */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl
                            bg-white dark:bg-lightdarkblue
                            border border-darkblue/10 dark:border-white/10 shadow-sm'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 shrink-0'>
                  <Calendar size={18} className='text-primary' />
                </div>
                <div>
                  <p className='text-xs text-lightgrey'>Fecha de inicio</p>
                  <p className='text-sm font-semibold text-darkblue dark:text-white'>
                    {formatFechaLarga(item.con_fecha_inicio)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 shrink-0'>
                  <CalendarDays size={18} className='text-primary' />
                </div>
                <div>
                  <p className='text-xs text-lightgrey'>Fecha de cierre</p>
                  <p className='text-sm font-semibold text-darkblue dark:text-white'>
                    {formatFechaLarga(item.con_fecha_fin)}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <SectionIn delay={0.1}>
              <div className='bg-white dark:bg-lightdarkblue rounded-2xl p-6
                              border border-darkblue/10 dark:border-white/10 shadow-sm'>
                <h3 className='flex items-center gap-2 text-lg font-bold text-darkblue dark:text-white mb-4'>
                  <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <FileText size={16} className='text-primary' />
                  </div>
                  Descripción
                </h3>
                <div
                  className='prose prose-sm dark:prose-invert max-w-none text-lightgrey leading-relaxed
                             [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1'
                  dangerouslySetInnerHTML={{ __html: item.con_descripcion || 'Sin descripción disponible.' }}
                />
              </div>
            </SectionIn>

            {/* Tipo tag */}
            <SectionIn delay={0.2}>
              <div className='flex items-center gap-3'>
                <Chip>{item.tipo_conv_comun?.tipo_conv_comun_titulo ?? tipo}</Chip>
                <span className='text-xs text-lightgrey'>
                  Publicado por Ingeniería Ambiental — UPEA
                </span>
              </div>
            </SectionIn>
          </motion.div>
        </div>
      </div>
    </div>
  )
}