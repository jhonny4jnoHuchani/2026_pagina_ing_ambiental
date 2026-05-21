'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { Phone, User, Sparkles, ChevronRight, Quote, Star, Crown, Shield } from 'lucide-react'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { getContenido, getInstitucionPrincipal } from '@/services/ambientalService'
import { AutoridadType, InstitucionType } from '@/app/types/ambiental.types'
import CategorySkeleton from '../../Skeleton/Category'

const Category = () => {
  const [autoridades, setAutoridades] = useState<AutoridadType[]>([])
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contenidoData, principalData] = await Promise.all([
          getContenido(),
          getInstitucionPrincipal(),
        ])
        setAutoridades(contenidoData.autoridad)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching autoridades:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const primaryColor   = institucion?.colorinstitucion?.[0]?.color_primario   ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'
  const gradientStyle  = { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
  const gradientTextStyle = {
    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }

  // Decoradores flotantes animados
  const floatingIcons = [
    { icon: Sparkles, delay: 0, x: "5%", y: "15%", size: 24, duration: 8 },
    { icon: Star, delay: 1, x: "88%", y: "25%", size: 20, duration: 10 },
    { icon: Crown, delay: 2, x: "12%", y: "75%", size: 28, duration: 9 },
    { icon: Shield, delay: 3, x: "85%", y: "80%", size: 22, duration: 7 },
    { icon: Quote, delay: 4, x: "45%", y: "10%", size: 18, duration: 11 },
  ]

  return (
    <motion.section 
      ref={sectionRef}
      id='categories' 
      style={{ opacity }}
      className='relative py-16 lg:py-24 overflow-hidden scroll-mt-12'
    >
      {/* ─── FONDO CON MOVIMIENTO ───────────────────────────────────────────── */}
      <div className='absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950' />
      
      {/* Patrón de puntos animado */}
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className='absolute inset-0 opacity-20 pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${primaryColor}15 2px, transparent 2px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Orbes flotantes de fondo */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{ x: [0, 150, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className='absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${primaryColor}15, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -120, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className='absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${secondaryColor}15, transparent 70%)` }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl'
          style={{ background: `radial-gradient(circle, ${primaryColor}08, transparent 80%)` }}
        />
      </div>

      {/* Decoradores flotantes animados */}
      {floatingIcons.map((icon, idx) => (
        <motion.div
          key={idx}
          className='absolute hidden lg:block pointer-events-none z-0'
          style={{ left: icon.x, top: icon.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, 0, -15, 0],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <icon.icon size={icon.size} style={{ color: primaryColor }} className='opacity-20' />
        </motion.div>
      ))}

      <div className='relative container mx-auto px-4 z-10'>
        {/* ─── ENCABEZADO CON MÁS MOVIMIENTO ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='text-center mb-12 lg:mb-16'
        >
          {/* Badge con animación de pulso */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 mb-6'
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={14} style={{ color: primaryColor }} />
            </motion.div>
            <span className='text-xs font-semibold tracking-wider uppercase' style={{ color: primaryColor }}>
              Equipo Directivo
            </span>
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='w-1.5 h-1.5 rounded-full'
              style={{ backgroundColor: primaryColor }}
            />
          </motion.div>

          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4'>
            <span className='text-gray-800 dark:text-white'>Nuestras</span>{' '}
            <motion.span 
              className='relative inline-block'
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span style={gradientTextStyle}>Autoridades</span>
              <motion.div
                className='absolute -bottom-2 left-0 right-0 h-0.5 rounded-full'
                style={gradientStyle}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              />
            </motion.span>
          </h2>

          <motion.p 
            className='text-base sm:text-lg font-normal max-w-md mx-auto text-gray-500 dark:text-gray-400'
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Conoce a los profesionales que lideran la carrera de{' '}
            <span className='font-semibold' style={{ color: primaryColor }}>
              {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
            </span>
          </motion.p>

          {/* Línea decorativa animada */}
          <motion.div
            className='h-0.5 rounded-full mx-auto mt-6'
            style={{ width: '60px', background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
            animate={{ width: [60, 100, 60] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ─── GRID DE AUTORIDADES ────────────────────────────────────────────── */}
        <motion.div 
          className='grid lg:grid-cols-4 grid-cols-2 gap-6'
          style={{ y }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
            : autoridades.map((aut, i) => (
                <motion.div
                  key={aut.id_autoridad}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 300 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setHoveredId(aut.id_autoridad)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group ${
                    i === 0 ? 'lg:col-span-2 lg:row-span-2' : 'sm:col-span-1 col-span-2'
                  }`}
                >
                  <motion.div 
                    className='relative overflow-hidden w-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'
                    animate={{ boxShadow: hoveredId === aut.id_autoridad ? `0 20px 40px -15px ${primaryColor}40` : '0 10px 30px -15px rgba(0,0,0,0.1)' }}
                  >
                    {/* ─── FOTO ────────────────────────────────────────────────────── */}
                    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${i === 0 ? 'h-80 lg:h-96' : 'h-56'}`}>
                      {aut.foto_autoridad ? (
                        <motion.div
                          animate={{ scale: hoveredId === aut.id_autoridad ? 1.08 : 1 }}
                          transition={{ duration: 0.5 }}
                          className='w-full h-full'
                        >
                          <Image
                            src={aut.foto_autoridad}
                            alt={aut.nombre_autoridad}
                            fill
                            className='object-cover object-top'
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className='w-full h-full flex flex-col items-center justify-center'
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                          animate={{ scale: hoveredId === aut.id_autoridad ? 1.05 : 1 }}
                        >
                          <User size={i === 0 ? 64 : 40} style={{ color: primaryColor }} className='opacity-40' />
                          <motion.span 
                            className={`font-bold mt-2 opacity-20 ${i === 0 ? 'text-4xl' : 'text-2xl'}`}
                            style={{ color: primaryColor }}
                            animate={{ rotate: hoveredId === aut.id_autoridad ? 360 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {aut.nombre_autoridad?.[0] || '?'}
                          </motion.span>
                        </motion.div>
                      )}

                      {/* Overlay con gradiente animado */}
                      <motion.div 
                        className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                        animate={{ opacity: hoveredId === aut.id_autoridad ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Info que aparece en hover */}
                      <AnimatePresence>
                        {hoveredId === aut.id_autoridad && (
                          <motion.div 
                            className='absolute inset-0 flex flex-col justify-end'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={`${i === 0 ? 'p-6 lg:p-8' : 'p-4'}`}>
                              <motion.div 
                                className='w-12 h-0.5 rounded-full mb-3'
                                style={gradientStyle}
                                initial={{ width: 0 }}
                                animate={{ width: 48 }}
                                transition={{ delay: 0.1 }}
                              />
                              <h3 className={`font-bold text-white leading-tight mb-1 ${i === 0 ? 'text-xl lg:text-2xl' : 'text-sm'}`}>
                                {aut.nombre_autoridad}
                              </h3>
                              <p className={`font-medium mb-3 ${i === 0 ? 'text-sm lg:text-base' : 'text-xs'}`} style={{ color: primaryColor }}>
                                {aut.cargo_autoridad}
                              </p>
                              <div className='flex items-center gap-2'>
                                {aut.facebook_autoridad && (
                                  <motion.a
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={aut.facebook_autoridad}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='bg-white/20 hover:bg-[#1877f2] p-2 rounded-full text-white transition-all duration-300 backdrop-blur-sm'
                                  >
                                    <FaFacebook size={i === 0 ? 16 : 12} />
                                  </motion.a>
                                )}
                                {aut.celular_autoridad && (
                                  <motion.a
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={`https://wa.me/591${aut.celular_autoridad}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='bg-white/20 hover:bg-[#25d366] p-2 rounded-full text-white transition-all duration-300 backdrop-blur-sm'
                                  >
                                    <Phone size={i === 0 ? 16 : 12} />
                                  </motion.a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Badge flotante */}
                      <motion.div 
                        className='absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg'
                        animate={{ rotate: hoveredId === aut.id_autoridad ? 5 : 0 }}
                      >
                        <div className='flex items-center gap-1'>
                          <Shield size={12} style={{ color: primaryColor }} />
                          <span className='text-[10px] font-semibold text-gray-700 dark:text-gray-300'>Autoridad</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* ─── INFO VISIBLE SIEMPRE ────────────────────────────────────── */}
                    <div className='bg-white dark:bg-gray-800/80 px-4 py-3'>
                      <motion.div 
                        className='w-8 h-0.5 rounded-full mb-2'
                        style={gradientStyle}
                        animate={{ width: hoveredId === aut.id_autoridad ? 32 : 24 }}
                      />
                      <p className={`font-bold text-gray-800 dark:text-white truncate ${i === 0 ? 'text-base' : 'text-sm'}`}>
                        {aut.nombre_autoridad}
                      </p>
                      <p className='text-xs font-medium truncate mt-0.5' style={{ color: primaryColor }}>
                        {aut.cargo_autoridad}
                      </p>
                    </div>

                    {/* ─── BARRA INFERIOR ANIMADA ────────────────────────────────── */}
                    <motion.div
                      className='h-1'
                      style={gradientStyle}
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Esquinas decorativas */}
                    <motion.div 
                      className='absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl pointer-events-none'
                      style={{ borderColor: `${primaryColor}40` }}
                      animate={{ width: hoveredId === aut.id_autoridad ? 48 : 32, height: hoveredId === aut.id_autoridad ? 48 : 32 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className='absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl pointer-events-none'
                      style={{ borderColor: `${secondaryColor}40` }}
                      animate={{ width: hoveredId === aut.id_autoridad ? 48 : 32, height: hoveredId === aut.id_autoridad ? 48 : 32 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Partículas flotantes en hover */}
                    <AnimatePresence>
                      {hoveredId === aut.id_autoridad && (
                        <>
                          {[...Array(6)].map((_, idx) => (
                            <motion.div
                              key={idx}
                              className='absolute w-1 h-1 rounded-full'
                              style={{ backgroundColor: primaryColor }}
                              initial={{ 
                                x: '50%', 
                                y: '50%',
                                opacity: 0.8,
                                scale: 0
                              }}
                              animate={{ 
                                x: `${50 + (idx - 2.5) * 15}%`,
                                y: `${50 + (idx % 2 === 0 ? -40 : 40)}%`,
                                opacity: 0,
                                scale: 1
                              }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
        </motion.div>


      </div>
    </motion.section>
  )
}

export default Category