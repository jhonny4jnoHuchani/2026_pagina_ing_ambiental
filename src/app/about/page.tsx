'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, animate, useMotionValue, useInView, useSpring } from 'motion/react'
import { FaFacebook, FaWhatsapp, FaPhone } from 'react-icons/fa6'
import {
  MdOutlineSchool, MdOutlineVisibility, MdOutlineTrackChanges,
  MdOutlineEmojiObjects, MdPlayCircle,
} from 'react-icons/md'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { Leaf, TreePine, Wind, Droplets, Sparkles, Crown } from 'lucide-react'
import { getInstitucionPrincipal, getContenido } from '@/services/ambientalService'
import { InstitucionType, AutoridadType } from '@/app/types/ambiental.types'

// ── Helpers ───────────────────────────────────────────────
const StripHtml = ({ html }: { html: string }) =>
  html ? <>{html.replace(/<[^>]*>/g, '')}</> : null

const getInitials = (nombre = '') => {
  const w = nombre.trim().split(/\s+/)
  return w.length === 1 ? w[0].slice(0, 2).toUpperCase() : (w[0][0] + w[1][0]).toUpperCase()
}

const JUNK = ['preuba_autoridad', 'prueba_autoridad', 'preuba', 'prueba', '', null, undefined]
const isValid = (v: unknown) =>
  !JUNK.includes(typeof v === 'string' ? v.trim().toLowerCase() : v as never)

// ── Contador animado ──────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, to, count])

  return <span ref={ref}>{display}{suffix}</span>
}

// ── Section wrapper ───────────────────────────────────────
const SectionIn = ({
  children, delay = 0, className = '', yOffset = 30
}: {
  children: React.ReactNode; delay?: number; className?: string; yOffset?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ── Chip ──────────────────────────────────────────────────
const Chip = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full'
    style={{
      backgroundColor: 'color-mix(in srgb, var(--color-primario) 10%, transparent)',
      color: 'var(--color-primario)',
    }}
  >
    <motion.span
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className='w-1.5 h-1.5 rounded-full'
      style={{ backgroundColor: 'var(--color-primario)' }}
    />
    {children}
  </motion.span>
)

// ── Partícula ambiental ───────────────────────────────────
const EnvParticle = ({
  icon: Icon, x, y, delay, size = 20, secondary = false, rotate = true
}: {
  icon: React.ElementType; x: string; y: string; delay: number
  size?: number; secondary?: boolean; rotate?: boolean
}) => (
  <motion.div
    className='absolute pointer-events-none z-0'
    style={{
      left: x, top: y,
      color: secondary ? 'var(--color-secundario)' : 'var(--color-primario)',
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.2, scale: 1 }}
    transition={{ delay, duration: 1 }}
  >
    <motion.div
      animate={{
        y: [0, -25, 0],
        x: [0, 10, 0, -10, 0],
        rotate: rotate ? [0, 15, -15, 0] : 0,
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 7 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Icon size={size} />
    </motion.div>
  </motion.div>
)

// ── Card autoridad ────────────────────────────────────────
const AutoridadCard = ({
  autoridad, index,
}: {
  autoridad: AutoridadType; index: number
}) => {
  const hasPhoto = autoridad.foto_autoridad?.startsWith('http')
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, type: 'spring', stiffness: 300 }}
      whileHover={{ y: -12 }}
      className='relative group cursor-default'
    >
      {/* Glow exterior */}
      <motion.div
        className='absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primario) 40%, transparent), transparent 80%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className='relative bg-white dark:bg-lightdarkblue rounded-3xl overflow-hidden border border-darkblue/10 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-all duration-500'>

        {/* Banner superior */}
        <motion.div
          className='h-28 relative overflow-hidden'
          style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primario) 6%, transparent), color-mix(in srgb, var(--color-primario) 19%, transparent))' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className='absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 border-dashed opacity-30'
            style={{ borderColor: 'var(--color-primario)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className='absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-dashed opacity-20'
            style={{ borderColor: 'var(--color-primario)' }}
          />
          <Leaf
            size={40}
            className='absolute top-3 right-4 opacity-20'
            style={{ color: 'var(--color-primario)' }}
          />
        </motion.div>

        {/* Foto */}
        <div className='flex justify-center -mt-12 mb-4'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className='relative'
          >
            <div
              className='relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-darklight shadow-xl flex items-center justify-center'
              style={hasPhoto ? {} : { backgroundColor: 'color-mix(in srgb, var(--color-primario) 6%, transparent)' }}
            >
              {hasPhoto ? (
                <Image
                  src={autoridad.foto_autoridad}
                  alt={autoridad.nombre_autoridad}
                  fill
                  className='object-cover'
                />
              ) : (
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className='text-3xl font-bold'
                  style={{ color: 'var(--color-primario)' }}
                >
                  {getInitials(autoridad.nombre_autoridad)}
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className='pb-8 px-6 text-center space-y-3'>
          <h3 className='text-lg font-bold text-darkblue dark:text-white leading-tight'>
            {autoridad.nombre_autoridad}
          </h3>

          {isValid(autoridad.cargo_autoridad) && (
            <span
              className='inline-block text-xs font-semibold px-4 py-1.5 rounded-full'
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primario) 9%, transparent)',
                color: 'var(--color-primario)',
              }}
            >
              {autoridad.cargo_autoridad}
            </span>
          )}

          {isValid(autoridad.celular_autoridad) && (
            <div className='flex items-center justify-center gap-1.5 text-xs text-lightgrey pt-1'>
              <FaPhone size={11} />
              <span>{autoridad.celular_autoridad}</span>
            </div>
          )}

          <div className='flex items-center justify-center gap-2 pt-3 border-t border-darkblue/10 dark:border-white/10'>
            {isValid(autoridad.facebook_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                href={autoridad.facebook_autoridad}
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-darklight hover:bg-[#1877f2] hover:text-white text-lightgrey transition-all duration-200'
              >
                <FaFacebook size={15} />
              </motion.a>
            )}
            {isValid(autoridad.celular_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                href={`https://wa.me/591${autoridad.celular_autoridad}`}
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-darklight hover:bg-[#25D366] hover:text-white text-lightgrey transition-colors duration-200'
              >
                <FaWhatsapp size={15} />
              </motion.a>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <motion.div
          className='h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl'
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ══════════════════════════════════════════════════════════
export default function AboutPage() {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [autoridades, setAutoridades] = useState<AutoridadType[]>([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5])
  const { scrollYProgress: mvScroll } = useScroll()
  const mvX = useTransform(mvScroll, [0, 1], [-40, 40])

  useEffect(() => {
    Promise.all([getInstitucionPrincipal(), getContenido()])
      .then(([principal, contenido]) => {
        setInstitucion(principal.Descripcion)
        setAutoridades(contenido.autoridad)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // ✅ Sin primaryColor ni secondaryColor locales
  const autoridadesValidas = autoridades.filter(a => isValid(a.nombre_autoridad))

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 rounded-full border-4 border-t-transparent border-[var(--color-primario)]'
        />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas */}
      <EnvParticle icon={Leaf}     x='2%'  y='8%'  delay={0}   size={35} />
      <EnvParticle icon={TreePine} x='90%' y='5%'  delay={1}   size={45} secondary />
      <EnvParticle icon={Wind}     x='94%' y='42%' delay={2}   size={30} />
      <EnvParticle icon={Droplets} x='4%'  y='48%' delay={1.5} size={28} secondary />
      <EnvParticle icon={Leaf}     x='82%' y='72%' delay={3}   size={38} />
      <EnvParticle icon={TreePine} x='6%'  y='78%' delay={2.5} size={48} secondary />
      <EnvParticle icon={Wind}     x='48%' y='88%' delay={4}   size={32} />
      <EnvParticle icon={Droplets} x='72%' y='18%' delay={0.5} size={28} secondary />
      <EnvParticle icon={Sparkles} x='15%' y='30%' delay={3.5} size={20} rotate={false} />
      <EnvParticle icon={Crown}    x='85%' y='60%' delay={2.8} size={25} secondary rotate={false} />

      {/* HERO */}
      {institucion?.institucion_sobre_ins && (
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className='relative py-28 overflow-hidden'
        >
          <div className='container'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
              <div className='space-y-6'>
                <SectionIn yOffset={20}><Chip>Sobre la carrera</Chip></SectionIn>
                <SectionIn delay={0.1} yOffset={20}>
                  <h1 className='text-4xl md:text-6xl font-black text-darkblue dark:text-white leading-tight'>
                    Formando{' '}
                    <span className='relative inline-block' style={{ color: 'var(--color-primario)' }}>
                      profesionales
                      <motion.span
                        className='absolute -bottom-2 left-0 right-0 h-1 rounded-full'
                        style={{ backgroundColor: 'var(--color-primario)' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      />
                    </span>{' '}
                    con propósito ambiental
                  </h1>
                </SectionIn>
                <SectionIn delay={0.2} yOffset={20}>
                  <div
                    className='w-20 h-1.5 rounded-full'
                    style={{ background: 'linear-gradient(90deg, var(--color-primario), color-mix(in srgb, var(--color-primario) 27%, transparent))' }}
                  />
                </SectionIn>
                <SectionIn delay={0.25} yOffset={20}>
                  <p className='text-lightgrey text-lg leading-relaxed'>
                    <StripHtml html={institucion.institucion_sobre_ins} />
                  </p>
                </SectionIn>
                <SectionIn delay={0.35} yOffset={20}>
                  <div className='grid grid-cols-3 gap-4 pt-4'>
                    {[
                      { n: 13,  suffix: '+', label: 'Años',       icon: Crown          },
                      { n: 500, suffix: '+', label: 'Egresados',   icon: HiOutlineUserGroup },
                      { n: 100, suffix: '%', label: 'Compromiso',  icon: Sparkles       },
                    ].map(({ n, suffix, label, icon: Icon }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className='bg-white dark:bg-lightdarkblue rounded-2xl p-4 text-center border border-darkblue/10 dark:border-white/10 shadow-sm'
                      >
                        <Icon size={24} style={{ color: 'var(--color-primario)' }} className='mx-auto mb-2 opacity-60' />
                        <div className='text-3xl font-black' style={{ color: 'var(--color-primario)' }}>
                          <Counter to={n} suffix={suffix} />
                        </div>
                        <div className='text-xs text-lightgrey mt-1'>{label}</div>
                      </motion.div>
                    ))}
                  </div>
                </SectionIn>
              </div>

              {/* Logo con anillos */}
              <SectionIn delay={0.2} yOffset={20} className='flex justify-center'>
                <div className='flex flex-col items-center gap-8'>
                  <div className='relative w-80 h-80 flex items-center justify-center'>
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className='absolute rounded-full border-2'
                        style={{
                          width: 80 + i * 55,
                          height: 80 + i * 55,
                          borderColor: `color-mix(in srgb, var(--color-primario) ${[13, 8, 4, 2][i - 1]}%, transparent)`,
                        }}
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0],
                        }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                      />
                    ))}
                    {institucion.institucion_logo && (
                      <motion.div
                        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className='relative z-10'
                      >
                        <Image
                          src={institucion.institucion_logo}
                          alt={institucion.institucion_nombre}
                          width={200}
                          height={200}
                          className='object-contain drop-shadow-2xl'
                        />
                      </motion.div>
                    )}
                  </div>
                  <div className='text-center'>
                    <p className='text-xl font-black tracking-wide' style={{ color: 'var(--color-primario)' }}>
                      {institucion.institucion_nombre}
                    </p>
                    <p className='text-xs text-lightgrey mt-1'>Universidad Pública de El Alto</p>
                  </div>
                </div>
              </SectionIn>
            </div>
          </div>
        </motion.section>
      )}

      {/* HISTORIA */}
      {institucion?.institucion_historia && (
        <section className='relative py-28 bg-gray-950 text-white overflow-hidden'>
          <motion.div
            className='absolute inset-0 opacity-15'
            style={{ background: 'conic-gradient(from 200deg at 80% 50%, var(--color-primario), transparent 50%)' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <div
            className='absolute inset-0 opacity-5'
            style={{
              backgroundImage: `radial-gradient(circle, var(--color-primario) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
          <div className='relative container'>
            <div className='grid lg:grid-cols-12 gap-12 items-start'>
              <SectionIn className='lg:col-span-4 space-y-5'>
                <Chip>Historia</Chip>
                <h2 className='text-4xl font-black leading-tight'>
                  Nuestra <br />
                  <span style={{ color: 'var(--color-primario)' }}>trayectoria</span>
                </h2>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <MdOutlineSchool size={80} style={{ color: 'color-mix(in srgb, var(--color-primario) 27%, transparent)' }} />
                </motion.div>
              </SectionIn>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className='lg:col-span-8 relative pl-8'
              >
                <motion.div
                  className='absolute left-0 top-0 bottom-0 w-px'
                  style={{ background: 'linear-gradient(180deg, var(--color-primario), transparent)' }}
                />
                <motion.div
                  className='absolute -left-2 top-0 w-4 h-4 rounded-full'
                  style={{ backgroundColor: 'var(--color-primario)' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <p className='text-gray-300 text-lg leading-relaxed'>
                  <StripHtml html={institucion.institucion_historia} />
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* MISIÓN & VISIÓN */}
      {(institucion?.institucion_mision || institucion?.institucion_vision) && (
        <section className='relative py-28 overflow-hidden bg-white dark:bg-darklight'>
          <div className='container'>
            <SectionIn className='text-center mb-14 space-y-3'>
              <Chip>Filosofía institucional</Chip>
              <h2 className='text-4xl font-black text-darkblue dark:text-white'>Misión & Visión</h2>
            </SectionIn>
            <div className='grid md:grid-cols-2 gap-8'>

              {institucion?.institucion_mision && (
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className='relative bg-secondary dark:bg-darklight rounded-3xl p-10 shadow-sm border border-darkblue/10 dark:border-white/10 overflow-hidden group'
                >
                  <motion.div
                    style={{ x: mvX, backgroundColor: 'var(--color-primario)' }}
                    className='absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10'
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className='absolute top-4 right-4 w-20 h-20 rounded-full border border-dashed opacity-10'
                    style={{ borderColor: 'var(--color-primario)' }}
                  />
                  <div
                    className='w-16 h-16 rounded-2xl flex items-center justify-center mb-6'
                    style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primario) 13%, transparent), color-mix(in srgb, var(--color-primario) 27%, transparent))' }}
                  >
                    <MdOutlineTrackChanges size={34} style={{ color: 'var(--color-primario)' }} />
                  </div>
                  <h3 className='text-2xl font-black text-darkblue dark:text-white mb-4'>Misión</h3>
                  <p className='text-lightgrey leading-relaxed'>
                    <StripHtml html={institucion.institucion_mision} />
                  </p>
                  <div className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl'
                    style={{ backgroundColor: 'var(--color-primario)' }}
                  />
                </motion.div>
              )}

              {institucion?.institucion_vision && (
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className='relative rounded-3xl p-10 overflow-hidden group'
                  style={{ background: 'linear-gradient(135deg, var(--color-primario), color-mix(in srgb, var(--color-primario) 87%, black))' }}
                >
                  <div className='absolute inset-0 opacity-15'
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                      backgroundSize: '25px 25px',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className='absolute -top-8 -right-8 w-32 h-32 rounded-full border border-white/20'
                  />
                  <div className='relative'>
                    <div className='w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6'>
                      <MdOutlineVisibility size={34} className='text-white' />
                    </div>
                    <h3 className='text-2xl font-black text-white mb-4'>Visión</h3>
                    <p className='text-white/90 leading-relaxed'>
                      <StripHtml html={institucion.institucion_vision} />
                    </p>
                  </div>
                  <div className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl bg-white/40' />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* OBJETIVOS */}
      {institucion?.institucion_objetivos && (
        <section className='py-28 bg-secondary dark:bg-darkmode'>
          <div className='container'>
            <SectionIn className='text-center mb-14 space-y-3'>
              <Chip>Propósito</Chip>
              <h2 className='text-4xl font-black text-darkblue dark:text-white'>Objetivos</h2>
            </SectionIn>
            <SectionIn delay={0.2} yOffset={30}>
              <motion.div
                className='max-w-4xl mx-auto relative rounded-3xl p-12 overflow-hidden'
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primario) 5%, transparent), color-mix(in srgb, var(--color-primario) 11%, transparent))' }}
                whileHover={{ scale: 1.01 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  className='absolute -top-20 -right-20 w-72 h-72 rounded-full border-2 border-dashed opacity-15'
                  style={{ borderColor: 'var(--color-primario)' }}
                />
                <div className='relative flex gap-6 items-start'>
                  <motion.div
                    className='w-16 h-16 rounded-full flex items-center justify-center shrink-0'
                    style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primario) 20%, transparent), color-mix(in srgb, var(--color-primario) 40%, transparent))' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <MdOutlineEmojiObjects size={32} style={{ color: 'var(--color-primario)' }} />
                  </motion.div>
                  <p className='text-lightgrey text-lg leading-relaxed pt-1'>
                    <StripHtml html={institucion.institucion_objetivos} />
                  </p>
                </div>
              </motion.div>
            </SectionIn>
          </div>
        </section>
      )}

      {/* VIDEO */}
      {institucion?.institucion_link_video_vision && (
        <section className='py-28 bg-gray-950 relative overflow-hidden'>
          <motion.div
            className='absolute inset-0 opacity-10'
            style={{
              backgroundImage: `linear-gradient(var(--color-primario) 1px, transparent 1px), linear-gradient(90deg, var(--color-primario) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className='absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl'
            style={{ backgroundColor: 'var(--color-primario)' }}
          />
          <div className='relative container'>
            <SectionIn className='text-center mb-12 space-y-3'>
              <Chip>Multimedia</Chip>
              <h2 className='text-4xl font-black text-white flex items-center justify-center gap-3'>
                <MdPlayCircle style={{ color: 'var(--color-primario)' }} />
                Video Institucional
              </h2>
            </SectionIn>
            <SectionIn delay={0.2}>
              <motion.div whileHover={{ scale: 1.02 }} className='max-w-4xl mx-auto'>
                <div className='relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/20 shadow-2xl'>
                  <iframe
                    src={institucion.institucion_link_video_vision}
                    title='Video Institucional'
                    className='w-full h-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
              </motion.div>
            </SectionIn>
          </div>
        </section>
      )}

      {/* AUTORIDADES */}
      {autoridadesValidas.length > 0 && (
        <section className='relative py-28 overflow-hidden bg-white dark:bg-darklight'>
          <div className='relative container'>
            <SectionIn className='mb-16 space-y-4'>
              <Chip>Equipo directivo</Chip>
              <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <h2 className='text-4xl md:text-5xl font-black text-darkblue dark:text-white flex items-center gap-3'>
                  <HiOutlineUserGroup style={{ color: 'var(--color-primario)' }} />
                  Autoridades
                </h2>
                <span
                  className='text-sm font-semibold px-4 py-2 rounded-full'
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primario) 9%, transparent)',
                    color: 'var(--color-primario)',
                  }}
                >
                  {autoridadesValidas.length} representante{autoridadesValidas.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div
                className='h-1 w-20 rounded-full'
                style={{ background: 'linear-gradient(90deg, var(--color-primario), color-mix(in srgb, var(--color-primario) 27%, transparent))' }}
              />
            </SectionIn>

            <div className={`grid gap-8 ${
              autoridadesValidas.length === 1 ? 'grid-cols-1 max-w-sm mx-auto'
              : autoridadesValidas.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {autoridadesValidas.map((autoridad, i) => (
                <AutoridadCard key={autoridad.id_autoridad ?? i} autoridad={autoridad} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}