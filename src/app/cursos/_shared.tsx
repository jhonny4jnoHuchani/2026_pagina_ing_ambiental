// RUTA: src/app/cursos/_shared.tsx
'use client'

import { motion } from 'motion/react'
import { CursoType } from '@/app/types/ambiental.types'
import { GraduationCap, Award, BookOpen } from 'lucide-react'

// ── Tipos ─────────────────────────────────────────────────
export type TipoCurso = 'CURSOS' | 'SEMINARIOS'

// ── Helpers de fecha ──────────────────────────────────────
const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
const mesesLargos = ['enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre']

export const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

export const formatFechaLarga = (fecha: string) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return `${d.getDate()} de ${mesesLargos[d.getMonth()]} de ${d.getFullYear()}`
}

export const formatHora = (hora: string) => {
  if (!hora) return ''
  return hora.substring(0, 5)
}

export const isExpired  = (fechaFin: string) => new Date(fechaFin) < new Date()
export const isActive   = (fechaIni: string, fechaFin: string) => {
  const now = new Date()
  return new Date(fechaIni) <= now && now <= new Date(fechaFin)
}
export const isUpcoming = (fechaIni: string) => new Date(fechaIni) > new Date()

// ── Estilos por tipo ──────────────────────────────────────
export const getTypeStyle = (tipo: TipoCurso | string) => {
  const styles: Record<string, { icon: React.ElementType; label: string; gradient: string }> = {
    CURSOS:     { icon: GraduationCap, label: 'Curso',      gradient: 'from-emerald-500 to-teal-500'    },
    SEMINARIOS: { icon: Award,         label: 'Seminario',  gradient: 'from-purple-500 to-fuchsia-500'  },
    default:    { icon: BookOpen,      label: 'Capacitación', gradient: 'from-blue-500 to-indigo-500'   },
  }
  return styles[tipo] ?? styles.default
}

// ── Filtrar y ordenar ─────────────────────────────────────
export const filterByTipo = (items: CursoType[], tipo: TipoCurso) =>
  [...items]
    .filter(i => i.tipo_curso_otro?.tipo_conv_curso_nombre === tipo && i.det_estado === '1')
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime())

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

// ── Skeleton ──────────────────────────────────────────────
export const CursosSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='rounded-2xl bg-white dark:bg-lightdarkblue overflow-hidden shadow-md animate-pulse'>
        <div className='h-48 bg-gray-200 dark:bg-white/10' />
        <div className='p-4 space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2' />
          <div className='h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3' />
        </div>
      </div>
    ))}
  </div>
)