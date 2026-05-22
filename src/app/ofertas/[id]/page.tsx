// RUTA: src/app/ofertas/[id]/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeft, Calendar, CalendarDays,
  FileText, GraduationCap, User,
  AlertCircle, CheckCircle, XCircle,
  Leaf, Wind, Droplets,
} from 'lucide-react'
import { getGacetaEventos } from '@/services/ambientalService'
import { OfertaAcademicaType } from '@/app/types/ambiental.types'

// ── Helpers ───────────────────────────────────────────────
const mesesLargos = ['enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre']

const formatFechaLarga = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} de ${mesesLargos[d.getMonth()]} de ${d.getFullYear()}`
}

const isActive  = (ini: string, fin: string) => {
  const now = new Date()
  return new Date(ini) <= now && now <= new Date(fin)
}
const isExpired = (fin: string) => new Date(fin) < new Date()

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

// ── SectionIn ─────────────────────────────────────────────
const SectionIn = ({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode; delay?: number; className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ── InfoRow ───────────────────────────────────────────────
const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType; label: string; value: string
}) => (
  <div className='flex items-center gap-3'>
    <div className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10'>
      {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary/10 → colorinstitucion[0].color_primario */}
      <Icon size={18} className='text-primary' />
    </div>
    <div>
      <p className='text-xs text-lightgrey'>{label}</p>
      <p className='text-sm font-semibold text-darkblue dark:text-white'>{value}</p>
    </div>
  </div>
)

// ══════════════════════════════════════════════════════════
export default function DetalleOfertaPage() {
  const params                  = useParams()
  const id                      = Number(params.id)
  const [item, setItem]         = useState<OfertaAcademicaType | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getGacetaEventos()
      .then(data => {
        const found = data.ofertasAcademicas.find((o: OfertaAcademicaType) => o.ofertas_id === id)
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
          <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30
                          flex items-center justify-center'>
            <AlertCircle size={40} className='text-red-500' />
          </div>
          <h2 className='text-2xl font-bold text-darkblue dark:text-white mb-2'>No encontrada</h2>
          <p className='text-lightgrey mb-6'>La oferta académica que buscas no existe.</p>
          <Link
            href='/ofertas'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-primary/10 text-primary border border-primary/20
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a ofertas
          </Link>
        </div>
      </div>
    )
  }

  const active  = isActive(item.ofertas_inscripciones_ini, item.ofertas_inscripciones_fin)
  const expired = isExpired(item.ofertas_inscripciones_fin)

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
            href='/ofertas'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary
                       hover:-translate-x-1 transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a ofertas
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
              <div className='relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-darklight
                              shadow-2xl border border-darkblue/10 dark:border-white/10'>
                {item.ofertas_imagen ? (
                  <>
                    <Image
                      src={item.ofertas_imagen}
                      alt={item.ofertas_titulo}
                      width={600} height={500}
                      className='w-full h-auto object-contain'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                  </>
                ) : (
                  <div className='w-full h-80 flex flex-col items-center justify-center bg-primary/5'>
                    <GraduationCap size={60} className='text-primary opacity-20' />
                    <p className='text-lightgrey mt-4 text-sm'>Sin imagen disponible</p>
                  </div>
                )}
              </div>
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
              <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                               rounded-full text-white shadow-md
                               bg-gradient-to-r from-emerald-500 to-teal-500'>
                <GraduationCap size={11} />
                Oferta Académica
              </span>
              {active && (
                <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                 rounded-full bg-emerald-500 text-white shadow-md'>
                  <CheckCircle size={11} />
                  INSCRIPCIONES ABIERTAS
                </span>
              )}
              {expired && (
                <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                 rounded-full bg-red-500 text-white shadow-md'>
                  <XCircle size={11} />
                  INSCRIPCIONES CERRADAS
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-darkblue dark:text-white leading-tight'>
              {item.ofertas_titulo}
            </h1>

            {/* Info fechas */}
            <SectionIn delay={0.1}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl
                              bg-white dark:bg-lightdarkblue
                              border border-darkblue/10 dark:border-white/10 shadow-sm'>
                <InfoRow
                  icon={Calendar}
                  label='Inicio inscripciones'
                  value={formatFechaLarga(item.ofertas_inscripciones_ini)}
                />
                <InfoRow
                  icon={CalendarDays}
                  label='Cierre inscripciones'
                  value={formatFechaLarga(item.ofertas_inscripciones_fin)}
                />
                <InfoRow
                  icon={CalendarDays}
                  label='Fecha de examen'
                  value={formatFechaLarga(item.ofertas_fecha_examen)}
                />
                {item.ofertas_referencia && (
                  <InfoRow
                    icon={User}
                    label='Referencia'
                    value={item.ofertas_referencia}
                  />
                )}
              </div>
            </SectionIn>

            {/* Descripción */}
            <SectionIn delay={0.15}>
              <div className='p-5 rounded-2xl bg-white dark:bg-lightdarkblue
                              border border-darkblue/10 dark:border-white/10 shadow-sm'>
                <h3 className='flex items-center gap-2 text-base font-bold text-darkblue dark:text-white mb-4'>
                  <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                    {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary/10 → colorinstitucion[0].color_primario */}
                    <FileText size={16} className='text-primary' />
                  </div>
                  Descripción
                </h3>
                <div
                  className='prose prose-sm dark:prose-invert max-w-none text-lightgrey leading-relaxed
                             [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1'
                  dangerouslySetInnerHTML={{ __html: item.ofertas_descripcion || 'Sin descripción disponible.' }}
                />
              </div>
            </SectionIn>

            {/* Pie */}
            <SectionIn delay={0.2}>
              <div className='flex items-center gap-3'>
                <CheckCircle size={14} className='text-primary' />
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