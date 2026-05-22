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
import {
  InstitucionType, AutoridadType,
} from '@/app/types/ambiental.types'

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

// ── Contador animado con spring ───────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const springCount = useSpring(count, { stiffness: 50, damping: 15 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, to, count])

  return <span ref={ref}>{display}{suffix}</span>
}

// ── Section wrapper con parallax ──────────────────────────
const SectionIn = ({
  children, delay = 0, className = '', yOffset = 30
}: {
  children: React.ReactNode; delay?: number; className?: string; yOffset?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ── Chip con glow ─────────────────────────────────────────
const Chip = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full'
    style={{ backgroundColor: `${color}18`, color }}
  >
    <motion.span
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className='w-1.5 h-1.5 rounded-full'
      style={{ backgroundColor: color }}
    />
    {children}
  </motion.span>
)

// ── Partícula ambiental flotante mejorada ─────────────────
const EnvParticle = ({
  icon: Icon, x, y, delay, size = 20, color, rotate = true
}: {
  icon: React.ElementType; x: string; y: string; delay: number; size?: number; color: string; rotate?: boolean
}) => (
  <motion.div
    className='absolute pointer-events-none z-0'
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.2, scale: 1 }}
    transition={{ delay, duration: 1 }}
  >
    <motion.div
      animate={{
        y: [0, -25, 0],
        x: [0, 10, 0, -10, 0],
        rotate: rotate ? [0, 15, -15, 0] : 0,
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 7 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Icon size={size} color={color} />
    </motion.div>
  </motion.div>
)

// ── Card autoridad mejorada ───────────────────────────────
const AutoridadCard = ({
  autoridad, index, primaryColor,
}: {
  autoridad: AutoridadType; index: number; primaryColor: string
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
      {/* Glow exterior mejorado */}
      <motion.div
        className='absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{ background: `radial-gradient(circle, ${primaryColor}66, transparent 80%)` }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className='relative bg-white dark:bg-lightdarkblue rounded-3xl overflow-hidden border border-darkblue/10 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-all duration-500'>

        {/* Banner superior animado */}
        <motion.div
          className='h-28 relative overflow-hidden'
          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}30)` }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className='absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 border-dashed opacity-30'
            style={{ borderColor: primaryColor }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className='absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-dashed opacity-20'
            style={{ borderColor: primaryColor }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Leaf size={40} className='absolute top-3 right-4 opacity-20' style={{ color: primaryColor }} />
          </motion.div>
        </motion.div>

        {/* Foto con efecto de rebote en hover */}
        <div className='flex justify-center -mt-12 mb-4'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className='relative'
          >
            <motion.div
              className='absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md'
              style={{ background: `radial-gradient(circle, ${primaryColor}88, transparent)` }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div
              className='relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-darklight shadow-xl flex items-center justify-center'
              style={hasPhoto ? {} : { backgroundColor: `${primaryColor}10` }}
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
                  style={{ color: primaryColor }}
                >
                  {getInitials(autoridad.nombre_autoridad)}
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div className='pb-8 px-6 text-center space-y-3'>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.12 + 0.2 }}
            className='text-lg font-bold text-darkblue dark:text-white leading-tight'
          >
            {autoridad.nombre_autoridad}
          </motion.h3>

          {isValid(autoridad.cargo_autoridad) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 + 0.3, type: 'spring' }}
              className='inline-block text-xs font-semibold px-4 py-1.5 rounded-full'
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              {autoridad.cargo_autoridad}
            </motion.span>
          )}

          {isValid(autoridad.celular_autoridad) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 + 0.4 }}
              className='flex items-center justify-center gap-1.5 text-xs text-lightgrey pt-1'
            >
              <FaPhone size={11} />
              <span>{autoridad.celular_autoridad}</span>
            </motion.div>
          )}

          {/* Redes con animación de rebote */}
          <div className='flex items-center justify-center gap-2 pt-3 border-t border-darkblue/10 dark:border-white/10'>
            {isValid(autoridad.facebook_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -180 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                transition={{ delay: index * 0.12 + 0.5, type: 'spring' }}
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
                initial={{ opacity: 0, rotate: -180 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                transition={{ delay: index * 0.12 + 0.6, type: 'spring' }}
                href={`https://wa.me/591${autoridad.celular_autoridad}`}
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-darklight hover:bg-[#25D366] hover:text-white text-lightgrey transition-colors duration-200'
              >
                <FaWhatsapp size={15} />
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Barra inferior animada con efecto de pulso */}
        <motion.div
          className='h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl'
          style={{ backgroundColor: primaryColor }}
          animate={inView ? { width: '0%' } : {}}
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
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    Promise.all([getInstitucionPrincipal(), getContenido()])
      .then(([principal, contenido]) => {
        setInstitucion(principal.Descripcion)
        setAutoridades(contenido.autoridad)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const primaryColor = institucion?.colorinstitucion?.[0]?.color_primario ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'

  const autoridadesValidas = autoridades.filter(a => isValid(a.nombre_autoridad))

  const mvRef = useRef(null)
  const { scrollYProgress: mvScroll } = useScroll()
  const mvX = useTransform(mvScroll, [0, 1], [-40, 40])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 rounded-full border-4 border-t-transparent'
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas ambientales de fondo */}
      <EnvParticle icon={Leaf} x='2%' y='8%' delay={0} size={35} color={primaryColor} />
      <EnvParticle icon={TreePine} x='90%' y='5%' delay={1} size={45} color={secondaryColor} />
      <EnvParticle icon={Wind} x='94%' y='42%' delay={2} size={30} color={primaryColor} />
      <EnvParticle icon={Droplets} x='4%' y='48%' delay={1.5} size={28} color={secondaryColor} />
      <EnvParticle icon={Leaf} x='82%' y='72%' delay={3} size={38} color={primaryColor} />
      <EnvParticle icon={TreePine} x='6%' y='78%' delay={2.5} size={48} color={secondaryColor} />
      <EnvParticle icon={Wind} x='48%' y='88%' delay={4} size={32} color={primaryColor} />
      <EnvParticle icon={Droplets} x='72%' y='18%' delay={0.5} size={28} color={secondaryColor} />
      <EnvParticle icon={Sparkles} x='15%' y='30%' delay={3.5} size={20} color={primaryColor} rotate={false} />
      <EnvParticle icon={Crown} x='85%' y='60%' delay={2.8} size={25} color={secondaryColor} rotate={false} />

      {/* ══════════════════════════════════════════════════════
          HERO — Sobre la carrera con parallax
      ══════════════════════════════════════════════════════ */}
      {institucion?.institucion_sobre_ins && (
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className='relative py-28 overflow-hidden'
        >
          <div className='container'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>

              {/* Texto */}
              <div className='space-y-6'>
                <SectionIn yOffset={20}>
                  <Chip color={primaryColor}>Sobre la carrera</Chip>
                </SectionIn>
                <SectionIn delay={0.1} yOffset={20}>
                  <motion.h1
                    className='text-4xl md:text-6xl font-black text-darkblue dark:text-white leading-tight'
                    animate={{ letterSpacing: ['normal', '1px', 'normal'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    Formando{' '}
                    <span
                      className='relative inline-block'
                      style={{ color: primaryColor }}
                    >
                      profesionales
                      <motion.span
                        className='absolute -bottom-2 left-0 right-0 h-1 rounded-full'
                        style={{ backgroundColor: primaryColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      />
                    </span>{' '}
                    con propósito ambiental
                  </motion.h1>
                </SectionIn>
                <SectionIn delay={0.2} yOffset={20}>
                  <motion.div
                    className='w-20 h-1.5 rounded-full'
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
                    animate={{ width: [80, 120, 80] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </SectionIn>
                <SectionIn delay={0.25} yOffset={20}>
                  <motion.p
                    className='text-lightgrey text-lg leading-relaxed'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    <StripHtml html={institucion.institucion_sobre_ins} />
                  </motion.p>
                </SectionIn>
                <SectionIn delay={0.35} yOffset={20}>
                  <div className='grid grid-cols-3 gap-4 pt-4'>
                    {[
                      { n: 13, suffix: '+', label: 'Años', icon: Crown },
                      { n: 500, suffix: '+', label: 'Egresados', icon: HiOutlineUserGroup },
                      { n: 100, suffix: '%', label: 'Compromiso', icon: Sparkles },
                    ].map(({ n, suffix, label, icon: Icon }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className='bg-white dark:bg-lightdarkblue rounded-2xl p-4 text-center border border-darkblue/10 dark:border-white/10 shadow-sm'
                      >
                        <Icon size={24} style={{ color: primaryColor }} className='mx-auto mb-2 opacity-60' />
                        <div className='text-3xl font-black' style={{ color: primaryColor }}>
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
                          borderColor: `${primaryColor}${['22', '14', '0a', '05'][i - 1]}`,
                        }}
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0],
                        }}
                        transition={{
                          duration: 5 + i,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.5,
                        }}
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

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className='text-center'
                  >
                    <motion.p
                      className='text-xl font-black tracking-wide'
                      style={{ color: primaryColor }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {institucion.institucion_nombre}
                    </motion.p>
                    <p className='text-xs text-lightgrey mt-1'>
                      Universidad Pública de El Alto
                    </p>
                  </motion.div>
                </div>
              </SectionIn>
            </div>
          </div>
        </motion.section>
      )}

      {/* ══════════════════════════════════════════════════════
          HISTORIA con efecto parallax
      ══════════════════════════════════════════════════════ */}
      {institucion?.institucion_historia && (
        <section className='relative py-28 bg-gray-950 text-white overflow-hidden'>
          <motion.div
            className='absolute inset-0 opacity-15'
            style={{
              background: `conic-gradient(from 200deg at 80% 50%, ${primaryColor}, transparent 50%)`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <div
            className='absolute inset-0 opacity-5'
            style={{
              backgroundImage: `radial-gradient(circle, ${primaryColor} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
          <div className='relative container'>
            <div className='grid lg:grid-cols-12 gap-12 items-start'>
              <SectionIn className='lg:col-span-4 space-y-5'>
                <Chip color={primaryColor}>Historia</Chip>
                <h2 className='text-4xl font-black leading-tight'>
                  Nuestra
                  <br />
                  <span style={{ color: primaryColor }}>trayectoria</span>
                </h2>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <MdOutlineSchool size={80} style={{ color: `${primaryColor}44` }} />
                </motion.div>
              </SectionIn>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className='lg:col-span-8 relative pl-8'
              >
                <motion.div
                  className='absolute left-0 top-0 bottom-0 w-px'
                  style={{ background: `linear-gradient(180deg, ${primaryColor}, transparent)` }}
                  animate={{ scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className='absolute -left-2 top-0 w-4 h-4 rounded-full'
                  style={{ backgroundColor: primaryColor }}
                  animate={{
                    scale: [1, 1.5, 1],
                    y: [0, 20, 40, 20, 0],
                    boxShadow: [
                      `0 0 0 0 ${primaryColor}66`,
                      `0 0 0 12px ${primaryColor}00`,
                      `0 0 0 0 ${primaryColor}66`,
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.p
                  className='text-gray-300 text-lg leading-relaxed'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  <StripHtml html={institucion.institucion_historia} />
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          MISIÓN & VISIÓN
      ══════════════════════════════════════════════════════ */}
      {(institucion?.institucion_mision || institucion?.institucion_vision) && (
        <section className='relative py-28 overflow-hidden bg-white dark:bg-darklight'>
          <div className='container'>
            <SectionIn className='text-center mb-14 space-y-3'>
              <Chip color={primaryColor}>Filosofía institucional</Chip>
              <motion.h2
                className='text-4xl font-black text-darkblue dark:text-white'
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Misión & Visión
              </motion.h2>
            </SectionIn>

            <div className='grid md:grid-cols-2 gap-8'>
              {institucion?.institucion_mision && (
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className='relative bg-secondary dark:bg-darklight rounded-3xl p-10 shadow-sm border border-darkblue/10 dark:border-white/10 overflow-hidden group'
                >
                  <motion.div
                    style={{ x: mvX , backgroundColor: primaryColor}}
                    className='absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10'
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className='absolute top-4 right-4 w-20 h-20 rounded-full border border-dashed opacity-10'
                    style={{ borderColor: primaryColor }}
                  />
                  <motion.div
                    className='w-16 h-16 rounded-2xl flex items-center justify-center mb-6'
                    style={{ background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}44)` }}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <MdOutlineTrackChanges size={34} style={{ color: primaryColor }} />
                  </motion.div>
                  <h3 className='text-2xl font-black text-darkblue dark:text-white mb-4'>Misión</h3>
                  <p className='text-lightgrey leading-relaxed'>
                    <StripHtml html={institucion.institucion_mision} />
                  </p>
                  <motion.div
                    className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl'
                    style={{ backgroundColor: primaryColor }}
                  />
                </motion.div>
              )}

              {institucion?.institucion_vision && (
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className='relative rounded-3xl p-10 overflow-hidden group'
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
                >
                  <div
                    className='absolute inset-0 opacity-15'
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
                    <motion.div
                      className='w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6'
                      whileHover={{ rotate: -5, scale: 1.05 }}
                    >
                      <MdOutlineVisibility size={34} className='text-white' />
                    </motion.div>
                    <h3 className='text-2xl font-black text-white mb-4'>Visión</h3>
                    <p className='text-white/90 leading-relaxed'>
                      <StripHtml html={institucion.institucion_vision} />
                    </p>
                  </div>
                  <motion.div
                    className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl bg-white/40'
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          OBJETIVOS
      ══════════════════════════════════════════════════════ */}
      {institucion?.institucion_objetivos && (
        <section className='py-28 bg-secondary dark:bg-darkmode'>
          <div className='container'>
            <SectionIn className='text-center mb-14 space-y-3'>
              <Chip color={primaryColor}>Propósito</Chip>
              <h2 className='text-4xl font-black text-darkblue dark:text-white'>Objetivos</h2>
            </SectionIn>
            <SectionIn delay={0.2} yOffset={30}>
              <motion.div
                className='max-w-4xl mx-auto relative rounded-3xl p-12 overflow-hidden'
                style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}18)` }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  className='absolute -top-20 -right-20 w-72 h-72 rounded-full border-2 border-dashed opacity-15'
                  style={{ borderColor: primaryColor }}
                />
                <div className='relative flex gap-6 items-start'>
                  <motion.div
                    className='w-16 h-16 rounded-full flex items-center justify-center shrink-0'
                    style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${primaryColor}66)` }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <MdOutlineEmojiObjects size={32} style={{ color: primaryColor }} />
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

      {/* ══════════════════════════════════════════════════════
          VIDEO INSTITUCIONAL
      ══════════════════════════════════════════════════════ */}
      {institucion?.institucion_link_video_vision && (
        <section className='py-28 bg-gray-950 relative overflow-hidden'>
          <motion.div
            className='absolute inset-0 opacity-10'
            style={{
              backgroundImage: `linear-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor} 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className='absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl'
            style={{ backgroundColor: primaryColor }}
          />
          <div className='relative container'>
            <SectionIn className='text-center mb-12 space-y-3'>
              <Chip color={primaryColor}>Multimedia</Chip>
              <h2 className='text-4xl font-black text-white flex items-center justify-center gap-3'>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MdPlayCircle style={{ color: primaryColor }} />
                </motion.div>
                Video Institucional
              </h2>
            </SectionIn>
            <SectionIn delay={0.2}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className='max-w-4xl mx-auto'
              >
                <div className='relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/20 shadow-2xl'>
                  <motion.div
                    className='absolute inset-0 pointer-events-none z-10'
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
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

      {/* ══════════════════════════════════════════════════════
          AUTORIDADES
      ══════════════════════════════════════════════════════ */}
      {autoridadesValidas.length > 0 && (
        <section className='relative py-28 overflow-hidden bg-white dark:bg-darklight'>
          <div className='relative container'>
            <SectionIn className='mb-16 space-y-4'>
              <Chip color={primaryColor}>Equipo directivo</Chip>
              <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <h2 className='text-4xl md:text-5xl font-black text-darkblue dark:text-white flex items-center gap-3'>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <HiOutlineUserGroup style={{ color: primaryColor }} />
                  </motion.div>
                  Autoridades
                </h2>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className='text-sm font-semibold px-4 py-2 rounded-full cursor-default'
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  {autoridadesValidas.length} representante{autoridadesValidas.length !== 1 ? 's' : ''}
                </motion.span>
              </div>
              <motion.div
                className='h-1 w-20 rounded-full'
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
                animate={{ width: [80, 120, 80] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </SectionIn>

            <div
              className={`grid gap-8 ${
                autoridadesValidas.length === 1
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : autoridadesValidas.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {autoridadesValidas.map((autoridad, i) => (
                <AutoridadCard
                  key={autoridad.id_autoridad ?? i}
                  autoridad={autoridad}
                  index={i}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}