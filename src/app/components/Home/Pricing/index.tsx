'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Sparkles, Play, Volume2, VolumeX, Maximize, Eye, ChevronRight, Award, Leaf, Trees, Droplets, Sun, Pause } from 'lucide-react'
import { useTheme } from 'next-themes'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'

const Pricing = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.97])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInstitucionPrincipal()
        setInstitucion(data.Descripcion)
      } catch (error) {
        console.error('Error fetching VideoVision:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'
  const isDark = currentTheme === 'dark'

  const primaryColor = institucion?.colorinstitucion?.[0]?.color_primario ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'
  const tertiaryColor = institucion?.colorinstitucion?.[0]?.color_terciario ?? '#2d6a4f'
  const videoUrl = institucion?.institucion_link_video_vision

  const stats = [
    { icon: Trees, label: "Áreas Verdes", value: "12+", color: primaryColor },
    { icon: Droplets, label: "Proyectos Agua", value: "8", color: secondaryColor },
    { icon: Sun, label: "Energía Limpia", value: "5", color: "#e9c46a" },
    { icon: Award, label: "Años Excelencia", value: "15+", color: "#e76f51" },
  ]

  if (loading) {
    return (
      <section className={`py-12 sm:py-16 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-gray-100 to-gray-200'}`}>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center'>
            <div className='space-y-3'>
              <div className={`w-32 h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded animate-pulse`} />
              <div className={`w-full h-10 ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded animate-pulse`} />
              <div className={`w-3/4 h-20 ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded animate-pulse`} />
            </div>
            <div className={`w-full aspect-video ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded-2xl animate-pulse`} />
          </div>
        </div>
      </section>
    )
  }

  if (!videoUrl) return null

  return (
    <motion.section 
      id='pricing' 
      style={{ opacity, scale }}
      className='relative py-12 sm:py-16 lg:py-20 overflow-hidden scroll-mt-12'
    >
      {/* ─── FONDO PRINCIPAL CON SOPORTE CLARO/OSCURO ───────────────────────── */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`} />
      
      {/* Efecto de textura / ruido */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none bg-[url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)"/%3E%3C/svg%3E")]' />

      {/* ─── ORBES FLOTANTES CON COLORES INSTITUCIONALES ─────────────────────── */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{ x: [0, 120, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className='absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${primaryColor}${isDark ? '40' : '20'}, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className='absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${secondaryColor}${isDark ? '40' : '20'}, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${tertiaryColor}${isDark ? '30' : '15'}, transparent 70%)` }}
        />
      </div>

      {/* ─── PATRÓN DE PUNTOS DECORATIVO ────────────────────────────────────── */}
      <div
        className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-5'}`}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${primaryColor} 2px, transparent 2px)`,
          backgroundSize: '35px 35px',
        }}
      />

      {/* ─── ONDAS DECORATIVAS EN LA PARTE INFERIOR ─────────────────────────── */}
      <svg className='absolute bottom-0 left-0 w-full h-24 opacity-10 pointer-events-none' preserveAspectRatio='none' viewBox='0 0 1440 120'>
        <path fill={primaryColor} d='M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z' />
      </svg>

      {/* Línea superior decorativa */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-gray-300'} to-transparent`} />

      <div className='relative container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center'>
          
          {/* ─── COLUMNA IZQUIERDA: TEXTO ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            {/* Badge decorativo animado */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border shadow-lg ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-black/5 border-gray-200'
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} style={{ color: primaryColor }} />
              </motion.div>
              <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                Video Institucional
              </span>
              <div className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ backgroundColor: primaryColor }} />
            </motion.div>

            {/* Título principal */}
            <div className='space-y-3'>
              <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Video Visión de la</span>
                <br />
                <span className='relative inline-block mt-2'>
                  <span
                    className='relative z-10'
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Carrera
                  </span>
                  <motion.div
                    className='absolute -bottom-2 left-0 right-0 h-0.5 rounded-full'
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h2>

              {/* Línea decorativa */}
              <motion.div
                className='h-0.5 rounded-full'
                style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }}
                initial={{ width: 0 }}
                whileInView={{ width: '80px' }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              />
            </div>

            {/* Nombre institución */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${isDark ? 'text-white/90' : 'text-gray-800'}`}
            >
              {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
            </motion.h3>

            {/* Descripción */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
              className={`leading-relaxed text-sm sm:text-base max-w-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Conoce nuestra propuesta educativa, nuestra misión y el compromiso
              con el medio ambiente y el desarrollo sostenible de Bolivia.
            </motion.p>



            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              viewport={{ once: true }}
              className='flex flex-wrap gap-4 pt-2'
            >
              <motion.a
                href='#convocatorias'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='relative group px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden shadow-lg'
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <span className='relative z-10 flex items-center gap-2 text-sm'>
                  Ver Convocatorias
                  <ChevronRight size={16} className='group-hover:translate-x-1 transition-transform' />
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
              </motion.a>

              <motion.a
                href='#cursos'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg ${
                  isDark 
                    ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20' 
                    : 'text-gray-800 bg-black/5 backdrop-blur-sm border border-gray-200 hover:bg-black/10'
                }`}
              >
                Explorar Cursos
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ─── COLUMNA DERECHA: VIDEO CON EFECTOS ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='relative'
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className='relative group'>
              {/* Efecto de brillo exterior */}
              <motion.div
                className='absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl'
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Marco decorativo */}
              <div className='absolute -top-3 -left-3 w-12 h-12 pointer-events-none'>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M0 0 L48 0 M0 0 L0 48" stroke={primaryColor} strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>
              <div className='absolute -bottom-3 -right-3 w-12 h-12 pointer-events-none'>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M48 48 L0 48 M48 48 L48 0" stroke={secondaryColor} strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Contenedor del video */}
              <div className={`relative rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm border ${
                isDark 
                  ? 'bg-black/50 border-white/20' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className='relative w-full' style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={videoUrl}
                    title={`Video visión — ${institucion?.institucion_nombre}`}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='absolute inset-0 w-full h-full'
                    style={{ border: 0 }}
                  />
                  
                  {/* Overlay de gradiente en el video */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none' />
                  
                  {/* Controles flotantes del video */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    <div className='flex items-center gap-3'>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className='p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors'
                      >
                        {isPlaying ? <Pause size={16} className='text-white' /> : <Play size={16} className='text-white' />}
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className='p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors'
                      >
                        {isMuted ? <VolumeX size={16} className='text-white' /> : <Volume2 size={16} className='text-white' />}
                      </button>
                      <div className='flex-1 h-1 bg-white/30 rounded-full overflow-hidden'>
                        <div className='h-full w-1/3 rounded-full' style={{ backgroundColor: primaryColor }} />
                      </div>
                      <button className='p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors'>
                        <Maximize size={14} className='text-white' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge flotante de vistas */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -bottom-2 -right-2 backdrop-blur-md rounded-full px-3 py-1.5 border shadow-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/80 border-gray-200'
                }`}
              >
                <div className='flex items-center gap-1.5'>
                  <Eye size={12} style={{ color: primaryColor }} />
                  <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-700'}`}>1,234 vistas</span>
                </div>
              </motion.div>
            </div>

            {/* Indicador de scroll */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='absolute -bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1'
            >
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Desliza para ver más</span>
              <ChevronRight size={14} className={`rotate-90 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Línea inferior decorativa */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-300'} to-transparent`} />
    </motion.section>
  )
}

export default Pricing