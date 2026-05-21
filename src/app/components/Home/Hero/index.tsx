'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import HeroSkeleton from '../../Skeleton/Hero'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { getContenido, getInstitucionPrincipal } from '@/services/ambientalService'
import { PortadaType, InstitucionType } from '@/app/types/ambiental.types'

// ── Variantes de animación mejoradas ──────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const fadeInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const slideRightVariant = {
  hidden: { opacity: 0, x: 80, rotateY: -15 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.7, ease: [0.34, 1.2, 0.64, 1] },
  },
}

// ── Animación palabra por palabra (mejorada) ───────────────────────────────
const WordByWord = ({ text, className, delayOffset = 0 }: { text: string; className?: string; delayOffset?: number }) => {
  const words = text.split(' ')
  
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className='inline-block overflow-hidden mr-[0.25em] last:mr-0'>
          <motion.span
            className='inline-block'
            variants={{
              hidden: { y: '120%', opacity: 0, rotateX: -30 },
              visible: {
                y: 0,
                opacity: 1,
                rotateX: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.33, 1, 0.68, 1],
                  delay: delayOffset + wi * 0.06,
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ── Componente de botón reutilizable ──────────────────────────────────────
const ActionButton = ({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) => {
  const isPrimary = variant === 'primary'
  
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={`
          px-8 py-3.5 font-semibold rounded-xl 
          transition-all duration-300 cursor-pointer
          ${isPrimary 
            ? 'text-white bg-primary hover:bg-primary/85 shadow-lg hover:shadow-primary/30' 
            : 'text-primary bg-transparent border-2 border-primary hover:bg-primary hover:text-white'
          }
        `}
      >
        {children}
      </motion.button>
    </Link>
  )
}

// ── Componente principal mejorado ────────────────────────────────────
const Hero = () => {
  const [portadas, setPortadas] = useState<PortadaType[]>([])
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Efecto parallax en scroll
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 500], [0, -80])
  const opacityParallax = useTransform(scrollY, [0, 300], [1, 0.5])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contenidoData, principalData] = await Promise.all([
          getContenido(),
          getInstitucionPrincipal(),
        ])
        setPortadas(contenidoData.portada)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching Hero data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="rounded-full px-4 py-2">
        <ul className="flex gap-2 justify-center"> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />
    ),
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      
      {/* ── Fondo decorativo animado ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className='overflow-hidden'>
        <div className='container relative z-20 pt-28 lg:pt-32'>

          {/* ── Badge universidad mejorado ── */}
          <motion.div
            className='text-center mb-10'
            initial='hidden'
            animate='visible'
            variants={containerVariants}
          >
            <motion.div
              variants={fadeInVariant}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className='text-primary/80 uppercase tracking-[0.2em] text-xs font-semibold'>
                Universidad Pública de El Alto
              </span>
            </motion.div>

            <motion.div
              variants={{
                hidden: { scaleX: 0, opacity: 0 },
                visible: {
                  scaleX: 1,
                  opacity: 1,
                  transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
                },
              }}
              className='w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4'
            />
          </motion.div>

          <div className='relative z-20 grid lg:grid-cols-12 grid-cols-1 items-center lg:justify-items-normal justify-items-center gap-16 pb-16'>

            {/* ── Columna izquierda — texto mejorado ── */}
            <motion.div
              className='lg:col-span-7 col-span-1'
              initial='hidden'
              animate={loading ? 'hidden' : 'visible'}
              variants={containerVariants}
              style={{ y: yParallax, opacity: opacityParallax }}
            >
              <div className='flex flex-col lg:items-start items-center gap-8'>

                {/* Logo + nombre institución con hover effect */}
                <motion.div
                  variants={fadeUpVariant}
                  className='flex items-center gap-4 group cursor-pointer'
                >
                  {institucion?.institucion_logo && (
                    <motion.div whileHover={{ rotate: 5, scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Image
                        src={institucion.institucion_logo}
                        alt={institucion.institucion_nombre}
                        width={56}
                        height={56}
                        className='rounded-full object-contain border-2 border-primary/30 transition-all duration-300 group-hover:border-primary'
                      />
                    </motion.div>
                  )}
                  <div>
                    <span className='text-xs text-lightgrey/60 uppercase tracking-widest block'>
                      {institucion?.institucion_iniciales}
                    </span>
                    <span className='text-[10px] text-primary/50 uppercase tracking-wider'>
                      Unidad Académica
                    </span>
                  </div>
                </motion.div>

                {/* Título con efecto word-by-word mejorado */}
                <motion.div variants={fadeUpVariant} className='max-w-xl'>
                  {loading ? (
                    <div className='space-y-3'>
                      <div className='w-80 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                      <div className='w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                    </div>
                  ) : (
                    <WordByWord
                      text={institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
                      className='text-4xl lg:text-5xl font-bold tracking-tight'
                    />
                  )}
                </motion.div>

                {/* Línea decorativa con gradiente */}
                <motion.div
                  variants={fadeUpVariant}
                  className='w-20 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full'
                />

                {/* Misión con animación mejorada */}
                {institucion?.institucion_mision && (
                  <motion.div
                    variants={fadeUpVariant}
                    className='text-lightgrey text-sm leading-relaxed line-clamp-3 max-w-md lg:text-start text-center [&>p]:m-0 relative pl-4 border-l-2 border-primary/30'
                    dangerouslySetInnerHTML={{ __html: institucion.institucion_mision }}
                  />
                )}

                {/* Botones mejorados */}
                <motion.div variants={fadeUpVariant} className='flex flex-wrap items-center gap-4'>
                  <ActionButton href='/#publicaciones' variant='primary'>
                    ✨ Explorar
                  </ActionButton>
                  <ActionButton href='/#convocatorias' variant='secondary'>
                    📢 Convocatorias
                  </ActionButton>
                </motion.div>

                {/* Redes sociales mejoradas */}
                {institucion && (
                  <motion.div variants={fadeInVariant} className='flex items-center gap-4 pt-4'>
                    {institucion.institucion_facebook && (
                      <motion.a
                        whileHover={{ y: -3 }}
                        href={institucion.institucion_facebook}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-lightgrey hover:text-primary transition-colors duration-300 flex items-center gap-1'
                      >
                        <span>📘</span> Facebook
                      </motion.a>
                    )}
                    {institucion.institucion_youtube && (
                      <motion.a
                        whileHover={{ y: -3 }}
                        href={institucion.institucion_youtube}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-lightgrey hover:text-primary transition-colors duration-300 flex items-center gap-1'
                      >
                        <span>▶️</span> YouTube
                      </motion.a>
                    )}
                    {institucion.institucion_twitter && (
                      <motion.a
                        whileHover={{ y: -3 }}
                        href={institucion.institucion_twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-lightgrey hover:text-primary transition-colors duration-300 flex items-center gap-1'
                      >
                        <span>📱</span> Telegram
                      </motion.a>
                    )}
                  </motion.div>
                )}

              </div>
            </motion.div>

            {/* ── Columna derecha — slider con efecto 3D mejorado ── */}
            <motion.div
              className='lg:col-span-5 col-span-1 lg:w-full sm:w-[80%] w-full'
              initial='hidden'
              animate='visible'
              variants={slideRightVariant}
            >
              <motion.div 
                className='rounded-2xl overflow-hidden shadow-2xl relative group'
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Slider {...sliderSettings}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <HeroSkeleton key={i} />
                      ))
                    : portadas.map((item, idx) => (
                        <div key={item.portada_id} className='relative aspect-[4/3]'>
                          <Image
                            src={item.portada_imagen}
                            alt={item.portada_titulo}
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-105'
                            priority={idx === 0}
                          />
                          {/* Overlay mejorado con gradiente */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />
                          <AnimatePresence>
                            <motion.div 
                              className='absolute bottom-0 left-0 right-0 px-5 py-4'
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <p className='text-white text-sm font-medium tracking-wide'>
                                {item.portada_titulo}
                              </p>
                              <div className='w-12 h-0.5 bg-primary/70 rounded-full mt-2' />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ))}
                </Slider>
                
                {/* Badge decorativo en slider */}
                <div className='absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1'>
                  <span className='text-white text-xs font-medium'>Proyecto destacado</span>
                </div>
              </motion.div>
            </motion.div>

          </div>

          {/* ── Elementos decorativos flotantes mejorados ── */}
          <motion.div 
            className='absolute top-24 -left-10 dark:opacity-10 z-0'
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src={'/images/banner/pattern1.svg'} alt='pattern1' width={141} height={141} />
          </motion.div>
          
          <motion.div 
            className='absolute bottom-20 right-10 dark:opacity-10 z-0'
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Image src={'/images/banner/pattern2.svg'} alt='pattern2' width={120} height={120} />
          </motion.div>

          {/* ── Scroll indicator ── */}
          <motion.div 
            className='absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
          >
            <span className='text-xs text-lightgrey/50 uppercase tracking-wider'>Scroll</span>
            <div className='w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent rounded-full' />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero