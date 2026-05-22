'use client'

import { motion } from 'motion/react'
import { ConvocatoriaType } from '@/app/types/ambiental.types'
import { Megaphone, Bell, FileText } from 'lucide-react'

// ── Tipos ─────────────────────────────────────────────────
export type TipoConvocatoria = 'CONVOCATORIAS' | 'COMUNICADOS' | 'AVISOS'

// ── Helpers ───────────────────────────────────────────────
const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

export const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

export const formatFechaLarga = (fecha: string) => {
  if (!fecha) return ''
  const mesesLargos = ['enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre']
  const d = new Date(fecha)
  return `${d.getDate()} de ${mesesLargos[d.getMonth()]} de ${d.getFullYear()}`
}

export const isExpired = (fechaFin: string) => new Date(fechaFin) < new Date()
export const isActive  = (fechaIni: string, fechaFin: string) => {
  const now = new Date()
  return new Date(fechaIni) <= now && now <= new Date(fechaFin)
}

// ── Estilos por tipo ──────────────────────────────────────
export const getTypeStyle = (tipo: TipoConvocatoria) => {
  const styles = {
    CONVOCATORIAS: { icon: Megaphone, label: 'Convocatoria', gradient: 'from-emerald-500 to-green-600' },
    COMUNICADOS:   { icon: FileText,  label: 'Comunicado',   gradient: 'from-blue-500 to-indigo-600'   },
    AVISOS:        { icon: Bell,      label: 'Aviso',        gradient: 'from-amber-500 to-orange-500'  },
  }
  return styles[tipo] ?? styles.CONVOCATORIAS
}

// ── Filtrar y ordenar por tipo ────────────────────────────
export const filterByTipo = (items: ConvocatoriaType[], tipo: TipoConvocatoria) =>
  [...items]
    .filter(i => i.tipo_conv_comun?.tipo_conv_comun_titulo === tipo)
    .sort((a, b) => new Date(b.con_fecha_inicio).getTime() - new Date(a.con_fecha_inicio).getTime())

// ── Chip ──────────────────────────────────────────────────
export const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest
                   px-3 py-1 rounded-full bg-primary/10 text-primary'>
    {/* 🎨 COLOR DINÁMICO FUTURO: bg-primary/10, text-primary → colorinstitucion[0].color_primario */}
    <span className='w-1.5 h-1.5 rounded-full bg-primary' />
    {children}
  </span>
)

// ── SectionIn ─────────────────────────────────────────────
export const SectionIn = ({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode; delay?: number; className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ── Skeleton grid ─────────────────────────────────────────
export const ConvocatoriasSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='rounded-2xl bg-white dark:bg-lightdarkblue overflow-hidden shadow-md animate-pulse'>
        <div className='h-44 bg-gray-200 dark:bg-white/10' />
        <div className='p-4 space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-full' />
        </div>
      </div>
    ))}
  </div>
)