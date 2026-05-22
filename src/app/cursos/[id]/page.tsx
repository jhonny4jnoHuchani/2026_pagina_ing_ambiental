// RUTA: src/app/cursos/[id]/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeft, Calendar, CalendarDays, Clock,
  MapPin, DollarSign, Users, Globe, Timer,
  FileText, AlertCircle, Leaf, Wind, Droplets,
  CheckCircle, Sparkles,
} from 'lucide-react'
import { getGacetaEventos } from '@/services/ambientalService'
import { CursoType } from '@/app/types/ambiental.types'
import {
  formatFechaLarga, formatHora,
  isActive, isUpcoming, getTypeStyle, SectionIn,
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

// ── InfoRow ───────────────────────────────────────────────
const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType; label: string; value: React.ReactNode
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
// PÁGINA DETALLE
// ══════════════════════════════════════════════════════════
export default function DetalleCursoPage() {
  const params                  = useParams()
  const id                      = Number(params.id)
  const [item, setItem]         = useState<CursoType | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getGacetaEventos()
      .then(data => {
        //const found = data.cursos.find(c => c.iddetalle_cursos_academicos === id)
        const found = data.cursos.find((c: CursoType) => c.iddetalle_cursos_academicos === id)
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
          <p className='text-lightgrey mb-6'>El curso que buscas no existe.</p>
          <Link
            href='/cursos'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-primary/10 text-primary border border-primary/20
                       hover:bg-primary hover:text-white transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a cursos
          </Link>
        </div>
      </div>
    )
  }

  const tipo      = item.tipo_curso_otro?.tipo_conv_curso_nombre ?? 'CURSOS'
  const typeStyle = getTypeStyle(tipo)
  const TypeIcon  = typeStyle.icon
  const active    = isActive(item.det_fecha_ini, item.det_fecha_fin)
  const upcoming  = isUpcoming(item.det_fecha_ini)

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
            href='/cursos'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary
                       hover:-translate-x-1 transition-all duration-300'
          >
            <ArrowLeft size={16} />
            Volver a cursos
          </Link>
        </motion.div>

        {/* Grid principal */}
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>

          {/* ── Col izquierda — Imagen (sticky) ── */}
          <div className='w-full lg:w-2/5'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='sticky top-24'
            >
              <div className='relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-darklight
                              shadow-2xl border border-darkblue/10 dark:border-white/10'>
                {item.det_img_portada ? (
                  <>
                    <Image
                      src={item.det_img_portada}
                      alt={item.det_titulo}
                      width={600} height={500}
                      className='w-full h-auto object-contain'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                  </>
                ) : (
                  <div className='w-full h-80 flex flex-col items-center justify-center bg-primary/5'>
                    <TypeIcon size={60} className='text-primary opacity-20' />
                    <p className='text-lightgrey mt-4 text-sm'>Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Badge versión */}
              {item.det_version && (
                <div className='mt-4 flex items-center justify-center'>
                  <span className='text-xs text-lightgrey bg-white dark:bg-lightdarkblue
                                   px-3 py-1.5 rounded-full border border-darkblue/10 dark:border-white/10'>
                    Versión {item.det_version}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Col derecha — Info ── */}
          <div className='w-full lg:w-3/5 space-y-6'>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                  rounded-full text-white shadow-md bg-gradient-to-r ${typeStyle.gradient}`}>
                  <TypeIcon size={11} />
                  {typeStyle.label}
                </span>
                {active && (
                  <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                   rounded-full bg-emerald-500 text-white shadow-md'>
                    <Sparkles size={11} />
                    EN CURSO
                  </span>
                )}
                {upcoming && !active && (
                  <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                                   rounded-full bg-blue-500 text-white shadow-md'>
                    <CalendarDays size={11} />
                    PRÓXIMAMENTE
                  </span>
                )}
                <span className='text-xs text-lightgrey bg-white dark:bg-lightdarkblue
                                 px-3 py-1.5 rounded-full border border-darkblue/10 dark:border-white/10'>
                  {item.det_modalidad}
                </span>
              </div>

              {/* Título */}
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-darkblue dark:text-white
                             leading-tight mb-6'>
                {item.det_titulo}
              </h1>

              {/* Info grid */}
              <SectionIn delay={0.1}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl
                                bg-white dark:bg-lightdarkblue
                                border border-darkblue/10 dark:border-white/10 shadow-sm mb-6'>
                  <InfoRow icon={Calendar}     label='Fecha de inicio'  value={formatFechaLarga(item.det_fecha_ini)} />
                  <InfoRow icon={CalendarDays} label='Fecha de fin'     value={formatFechaLarga(item.det_fecha_fin)} />
                  {item.det_hora_ini && (
                    <InfoRow icon={Clock}  label='Horario'        value={formatHora(item.det_hora_ini)} />
                  )}
                  {item.det_lugar_curso && (
                    <InfoRow icon={MapPin} label='Lugar'          value={item.det_lugar_curso} />
                  )}
                  {item.det_modalidad && (
                    <InfoRow icon={Globe}  label='Modalidad'      value={item.det_modalidad} />
                  )}
                  {item.det_carga_horaria > 0 && (
                    <InfoRow icon={Timer}  label='Carga horaria'  value={`${item.det_carga_horaria} horas`} />
                  )}
                  {item.det_cupo_max > 0 && (
                    <InfoRow icon={Users}  label='Cupo máximo'    value={`${item.det_cupo_max} participantes`} />
                  )}
                </div>
              </SectionIn>

              {/* Costos */}
              {(item.det_costo > 0 || item.det_costo_ext > 0 || item.det_costo_profe > 0) && (
                <SectionIn delay={0.15}>
                  <div className='p-5 rounded-2xl bg-white dark:bg-lightdarkblue
                                  border border-darkblue/10 dark:border-white/10 shadow-sm mb-6'>
                    <h3 className='flex items-center gap-2 text-base font-bold text-darkblue dark:text-white mb-4'>
                      <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                        <DollarSign size={16} className='text-primary' />
                      </div>
                      Costos de inscripción
                    </h3>
                    <div className='space-y-3'>
                      {item.det_costo > 0 && (
                        <div className='flex justify-between items-center py-2 border-b
                                        border-darkblue/10 dark:border-white/10'>
                          <span className='text-sm text-lightgrey'>Estudiantes UPEA</span>
                          <span className='text-lg font-black text-primary'>Bs. {item.det_costo}</span>
                        </div>
                      )}
                      {item.det_costo_ext > 0 && (
                        <div className='flex justify-between items-center py-2 border-b
                                        border-darkblue/10 dark:border-white/10'>
                          <span className='text-sm text-lightgrey'>Público en general</span>
                          <span className='text-lg font-black text-primary'>Bs. {item.det_costo_ext}</span>
                        </div>
                      )}
                      {item.det_costo_profe > 0 && (
                        <div className='flex justify-between items-center py-2'>
                          <span className='text-sm text-lightgrey'>Profesionales</span>
                          <span className='text-lg font-black text-primary'>Bs. {item.det_costo_profe}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionIn>
              )}

              {/* Descripción */}
              <SectionIn delay={0.2}>
                <div className='p-5 rounded-2xl bg-white dark:bg-lightdarkblue
                                border border-darkblue/10 dark:border-white/10 shadow-sm mb-6'>
                  <h3 className='flex items-center gap-2 text-base font-bold text-darkblue dark:text-white mb-4'>
                    <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <FileText size={16} className='text-primary' />
                    </div>
                    Descripción
                  </h3>
                  <div
                    className='prose prose-sm dark:prose-invert max-w-none text-lightgrey leading-relaxed
                               [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1'
                    dangerouslySetInnerHTML={{ __html: item.det_descripcion || 'Sin descripción disponible.' }}
                  />
                </div>
              </SectionIn>

              {/* Tag tipo */}
              <SectionIn delay={0.25}>
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
    </div>
  )
}