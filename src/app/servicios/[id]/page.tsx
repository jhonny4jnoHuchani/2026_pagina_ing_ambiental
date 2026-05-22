// RUTA: src/app/servicios/[id]/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeft, Phone, FileText,
  AlertCircle, CheckCircle, Wrench,
  Leaf, Wind, Droplets,
} from 'lucide-react'
import { getGacetaEventos } from '@/services/ambientalService'
import { ServicioType } from '@/app/types/ambiental.types'

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

// ══════════════════════════════════════════════════════════
export default function DetalleServicioPage() {
  const params                  = useParams()
  const id                      = Number(params.id)
  const [item, setItem]         = useState<ServicioType | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getGacetaEventos()
      .then(data => {
        const found = data.serviciosCarrera.find((s: ServicioType) => s.serv_id === id)
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
          <h2 className='text-2xl font-bold text-darkblue dark:text-white mb-2'>No encontrado</h2>
          <p className='text-lightgrey mb-6'>El servicio que buscas no existe.</p>
          <Link
            href='/servicios'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-primary/10 text-primary border border-primary/20
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a servicios
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
            href='/servicios'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary
                       hover:-translate-x-1 transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a servicios
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
                {item.serv_imagen ? (
                  <>
                    <Image
                      src={item.serv_imagen}
                      alt={item.serv_nombre}
                      width={600} height={500}
                      className='w-full h-auto object-contain'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                  </>
                ) : (
                  <div className='w-full h-80 flex flex-col items-center justify-center bg-primary/5'>
                    <Wrench size={60} className='text-primary opacity-20' />
                    <p className='text-lightgrey mt-4 text-sm'>Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Contacto rápido */}
              {item.serv_nro_celular > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='mt-4 p-4 rounded-2xl bg-white dark:bg-lightdarkblue
                             border border-darkblue/10 dark:border-white/10 shadow-sm'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 shrink-0'>
                      {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary/10 → colorinstitucion[0].color_primario */}
                      <Phone size={18} className='text-primary' />
                    </div>
                    <div>
                      <p className='text-xs text-lightgrey'>Teléfono de contacto</p>
                      <Link
                        href={`tel:${item.serv_nro_celular}`}
                        className='text-sm font-semibold text-primary hover:underline'
                      >
                        {item.serv_nro_celular}
                      </Link>
                    </div>
                  </div>
                </motion.div>
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
            {/* Badge */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                               rounded-full text-white shadow-md bg-gradient-to-r from-emerald-500 to-teal-500'>
                <Wrench size={11} />
                Servicio
              </span>
              {item.serv_active === '1' && (
                <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                 rounded-full bg-emerald-500 text-white shadow-md'>
                  <CheckCircle size={11} />
                  ACTIVO
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-darkblue dark:text-white leading-tight'>
              {item.serv_nombre}
            </h1>

            {/* Descripción */}
            <SectionIn delay={0.1}>
              <div className='p-5 rounded-2xl bg-white dark:bg-lightdarkblue
                              border border-darkblue/10 dark:border-white/10 shadow-sm'>
                <h3 className='flex items-center gap-2 text-base font-bold text-darkblue dark:text-white mb-4'>
                  <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                    {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary/10 → colorinstitucion[0].color_primario */}
                    <FileText size={16} className='text-primary' />
                  </div>
                  Descripción del servicio
                </h3>
                <div
                  className='prose prose-sm dark:prose-invert max-w-none text-lightgrey leading-relaxed
                             [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1
                             [&>strong]:text-primary [&>strong]:font-semibold'
                  dangerouslySetInnerHTML={{ __html: item.serv_descripcion || 'Sin descripción disponible.' }}
                />
              </div>
            </SectionIn>

            {/* Estado */}
            <SectionIn delay={0.2}>
              <div className='flex items-center gap-3'>
                <CheckCircle size={14} className='text-primary' />
                <span className='text-xs text-lightgrey'>
                  Servicio {item.serv_active === '1' ? 'activo' : 'inactivo'} — Ingeniería Ambiental UPEA
                </span>
              </div>
            </SectionIn>
          </motion.div>
        </div>
      </div>
    </div>
  )
}