'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Calendar, ChevronRight, Leaf, Wind,
  Droplets, Video, Play, Eye, X,
} from 'lucide-react'
import { getGacetaEventos, getContenido } from '@/services/ambientalService'
import { PortadaType } from '@/app/types/ambiental.types'

// ── Types ───────────────────────────────────────────────
interface Video {
  video_id: number
  video_enlace: string
  video_titulo: string
  video_breve_descripcion: string
  video_estado: number
  video_tipo: string
}

// ── Helpers ─────────────────────────────────────────────
const extractYouTubeId = (url: string) => {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?#]+)/)
  return match ? match[1] : null
}

const getYouTubeThumbnail = (url: string) => {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null
}

// ── Modal de Video ──────────────────────────────────────
const VideoModal = ({ 
  video, 
  isOpen, 
  onClose 
}: { 
  video: Video | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !video) return null

  const embedUrl = getYouTubeEmbedUrl(video.video_enlace)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className='relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl'
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 
                       hover:bg-black/70 flex items-center justify-center transition-all
                       text-white backdrop-blur-sm hover:scale-110'
          >
            <X size={20} />
          </button>

          <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent'>
            <h3 className='text-white font-bold text-lg line-clamp-1'>
              {video.video_titulo}
            </h3>
          </div>

          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.video_titulo}
              className='w-full aspect-video'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <div className='w-full aspect-video flex items-center justify-center bg-gray-900'>
              <p className='text-white'>No se pudo cargar el video</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

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

// ── Skeleton ──────────────────────────────────────────────
const VideosSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 4 }).map((_, i) => (
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

// ══════════════════════════════════════════════════════════
export default function VideosPage() {
  const [items, setItems] = useState<Video[]>([])
  const [portadas, setPortadas] = useState<PortadaType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    Promise.all([getGacetaEventos(), getContenido()])
      .then(([gacetaData, contenidoData]) => {
        const videosActivos = [...(contenidoData.upea_videos || [])]
          .filter(v => v.video_estado === 1)
          .sort((a, b) => b.video_id - a.video_id)
        setItems(videosActivos)
        setPortadas(contenidoData.portada)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const openModal = (video: Video, e: React.MouseEvent) => {
    e.preventDefault() // Evita que el Link navegue
    e.stopPropagation()
    setSelectedVideo(video)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300)
  }

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Modal */}
      <VideoModal video={selectedVideo} isOpen={modalOpen} onClose={closeModal} />

      {/* Partículas */}
      <EnvParticle icon={Leaf}     x='3%'  y='12%' delay={0}   size={32} />
      <EnvParticle icon={Wind}     x='88%' y='20%' delay={1}   size={28} />
      <EnvParticle icon={Droplets} x='82%' y='65%' delay={2}   size={24} />
      <EnvParticle icon={Video}    x='8%'  y='75%' delay={0.5} size={36} />

      {/* ── Hero ── */}
      <section className='relative h-72 md:h-80 lg:h-96 w-full overflow-hidden'>
        {portadas[0]?.portada_imagen ? (
          <>
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              className='absolute inset-0'
            >
              <Image
                src={portadas[0].portada_imagen}
                alt={portadas[0].portada_titulo ?? 'Videos'}
                fill priority
                className='object-cover object-center'
              />
            </motion.div>
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70' />
          </>
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-darkblue to-darklight' />
        )}

        <div
          className='absolute inset-0 opacity-10 pointer-events-none'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className='relative h-full flex flex-col items-center justify-center container text-center z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-4'
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className='inline-flex items-center justify-center w-16 h-16 rounded-2xl
                         bg-white/10 backdrop-blur-sm mb-2'
            >
              <Video size={30} className='text-white' />
            </motion.div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg'>
              Videos
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '5rem' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='h-1 bg-primary rounded-full mx-auto'
            />

            <p className='text-gray-200 max-w-xl mx-auto text-base drop-shadow'>
              Contenido multimedia, invitaciones y eventos — Ingeniería Ambiental UPEA
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid de Videos ── */}
      <section className='py-14'>
        <div className='container'>
          {loading ? (
            <VideosSkeleton />
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10
                              flex items-center justify-center'>
                <Video size={32} className='text-primary opacity-50' />
              </div>
              <p className='text-lightgrey'>No hay videos disponibles.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {items.map((item, index) => {
                  const thumbnail = getYouTubeThumbnail(item.video_enlace)
                  
                  return (
                    <motion.div
                      key={item.video_id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -6 }}
                    >
                      {/* Link a la página de detalle (CLICK EN TODA LA TARJETA) */}
                      <Link
                        href={`/videos/${item.video_id}`}
                        className='group flex flex-col h-full bg-white dark:bg-lightdarkblue rounded-2xl
                                   overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
                                   border border-darkblue/10 dark:border-white/10 cursor-pointer'
                      >
                        {/* Imagen */}
                        <div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-darklight shrink-0'>
                          {thumbnail ? (
                            <>
                              <Image
                                src={thumbnail}
                                alt={item.video_titulo}
                                fill
                                className='object-cover group-hover:scale-105 transition-transform duration-500'
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent
                                              to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                              
                              {/* Overlay con ícono de play - SOLO ESTE BOTÓN ABRE MODAL */}
                              <div className='absolute inset-0 flex items-center justify-center
                                              bg-black/30 group-hover:bg-black/40 transition-all duration-300'>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => openModal(item, e)}
                                  className='w-14 h-14 rounded-full bg-red-600 flex items-center justify-center
                                             hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer z-10'
                                >
                                  <Play size={24} className='text-white ml-0.5' />
                                </motion.button>
                              </div>
                            </>
                          ) : (
                            <div className='w-full h-full flex items-center justify-center bg-primary/5'>
                              <Video size={48} className='text-primary opacity-20' />
                            </div>
                          )}

                          {/* Badge tipo */}
                          <span className='absolute top-3 left-3 flex items-center gap-1 text-white
                                           text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md
                                           bg-gradient-to-r from-red-600 to-red-800'>
                            <Video size={9} />
                            {item.video_tipo === 'sin tipo' ? 'VIDEO' : item.video_tipo}
                          </span>
                        </div>

                        {/* Contenido */}
                        <div className='flex flex-col flex-1 p-4'>
                          <h5 className='font-bold text-darkblue dark:text-white text-sm mb-2 line-clamp-2
                                         group-hover:text-primary transition-colors duration-200'>
                            {item.video_titulo}
                          </h5>

                          {item.video_breve_descripcion && (
                            <div 
                              className='text-xs text-lightgrey line-clamp-2 mb-3'
                              dangerouslySetInnerHTML={{ 
                                __html: item.video_breve_descripcion || '' 
                              }}
                            />
                          )}

                          {/* Footer con botón de play */}
                          <div className='flex items-center justify-end pt-3 mt-auto
                                          border-t border-darkblue/10 dark:border-white/10'>
                            <motion.button
                              whileHover={{ x: 3 }}
                              onClick={(e) => openModal(item, e)}
                              className='flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer'
                            >
                              <Play size={10} />
                              Reproducir video
                              <ChevronRight size={12} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Barra inferior animada */}
                        <div className='h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500' />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )}

          {/* Contador */}
          {!loading && items.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-center mt-8 text-sm text-lightgrey'
            >
              {items.length} {items.length === 1 ? 'video disponible' : 'videos disponibles'}
            </motion.p>
          )}
        </div>
      </section>
    </div>
  )
}