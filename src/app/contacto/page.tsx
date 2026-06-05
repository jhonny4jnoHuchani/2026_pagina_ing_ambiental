'use client'

import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa'
import { FaTelegram } from 'react-icons/fa6'
import { MapPin, Phone, Mail, Clock, ExternalLink, Leaf, Wind, Droplets } from 'lucide-react'
import { getInstitucionPrincipal, getContenido } from '@/services/ambientalService'
import { InstitucionType, PortadaType } from '@/app/types/ambiental.types'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false })
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false })
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false })

// ============================================================
// CONFIGURACIÓN DE NOMINATIM (OpenStreetMap)
// ============================================================
const NOMINATIM_USER_AGENT = 'UPEA_IngenieriaAmbiental_WebApp/1.0 (https://ambiental.upea.edu.bo; contacto@upea.bo)'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas en milisegundos (Recomendación del testing)
const DEBOUNCE_DELAY = 500 // 500ms de debounce

// ============================================================
// CACHÉ EN LOCALSTORAGE (con expiración)
// ============================================================
interface CachedCoords {
  coords: [number, number]
  address: string
  timestamp: number
}

const getCachedCoords = (dir: string): [number, number] | null => {
  try {
    const raw = localStorage.getItem('upea_map_coords')
    if (!raw) return null
    const cached: CachedCoords = JSON.parse(raw)
    // Verificar expiración (24 horas)
    if (Date.now() - cached.timestamp > CACHE_TTL || cached.address !== dir) return null
    return cached.coords
  } catch {
    return null
  }
}

const setCachedCoords = (dir: string, coords: [number, number]) => {
  try {
    const cacheData: CachedCoords = {
      coords,
      address: dir,
      timestamp: Date.now()
    }
    localStorage.setItem('upea_map_coords', JSON.stringify(cacheData))
  } catch {
    // Error no crítico, el mapa igual funcionará
    console.warn('No se pudo guardar en caché')
  }
}

// ============================================================
// FUNCIÓN DE GEODECODIFICACIÓN CON RATE LIMITING
// ============================================================
let lastFetchTime = 0
let pendingFetch: Promise<[number, number] | null> | null = null
// ============================================================
// FUNCIÓN DE GEODECODIFICACIÓN MEJORADA
// ============================================================


const fetchCoordinates = async (direccion: string): Promise<[number, number] | null> => {
  // Verificar caché primero
  const cached = getCachedCoords(direccion)
  if (cached) return cached

  // Rate limiting: esperar al menos DEBOUNCE_DELAY entre peticiones
  const now = Date.now()
  const timeSinceLastFetch = now - lastFetchTime
  if (timeSinceLastFetch < DEBOUNCE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DELAY - timeSinceLastFetch))
  }

  lastFetchTime = Date.now()

  // Intentar con la dirección completa primero, luego con versiones alternativas
  const queries = [
    direccion,  // Dirección completa
    direccion.split(',').slice(0, 2).join(','), // Solo nombre + ciudad
    `${direccion.split(',')[0]}, El Alto, Bolivia`, // Forzar El Alto
    'Universidad Pública de El Alto, Bolivia', // Búsqueda general
    'UPEA, El Alto, Bolivia' // Siglas
  ].filter((q, index, self) => self.indexOf(q) === index) // Eliminar duplicados

  for (const query of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=bo`
      
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'es',
          'User-Agent': NOMINATIM_USER_AGENT
        }
      })

      if (!response.ok) {
        console.warn(`HTTP ${response.status} para query: ${query}`)
        continue
      }

      const data = await response.json()
      
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        // Guardar en caché
        setCachedCoords(direccion, coords)
        return coords
      }
    } catch (error) {
      console.warn(`Error con query "${query}":`, error)
      continue
    }
  }

  // Si nada funciona, usar coordenadas por defecto (Campus UPEA)
  console.warn('No se encontraron coordenadas, usando valor por defecto')
  const defaultCoords: [number, number] = [-16.5009, -68.1503] // Coordenadas de El Alto
  setCachedCoords(direccion, defaultCoords)
  return defaultCoords
}

// ============================================================
// COMPONENTES UI
// ============================================================
const Chip = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full'
    style={{ backgroundColor: `${color}18`, color }}
  >
    <span className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: color }} />
    {children}
  </span>
)

const SectionIn = ({ children, delay = 0, className = '' }: {
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

const EnvParticle = ({ icon: Icon, x, y, delay, size = 20, color }: {
  icon: React.ElementType; x: string; y: string; delay: number; size?: number; color: string
}) => (
  <motion.div
    className='absolute pointer-events-none z-0 opacity-10'
    style={{ left: x, top: y }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Icon size={size} color={color} />
  </motion.div>
)

const PhoneLink = ({ number }: { number: number }) => (
  <Link
    href={`tel:${number}`}
    className='block transition-colors'
    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primario)')}
    onMouseLeave={e => (e.currentTarget.style.color = '')}
  >
    📱 {number}
  </Link>
)

const EmailLink = ({ email }: { email: string }) => (
  <Link
    href={`mailto:${email}`}
    className='block break-all transition-colors'
    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primario)')}
    onMouseLeave={e => (e.currentTarget.style.color = '')}
  >
    {email}
  </Link>
)

const SocialButton = ({ href, bgColor, icon: Icon, label }: {
  href: string; bgColor: string; icon: React.ElementType; label: string
}) => (
  <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ duration: 0.2 }}>
    <Link
      href={href}
      target='_blank'
      rel='noreferrer'
      className='flex items-center gap-3 px-6 py-3 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300'
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={18} />
      {label}
    </Link>
  </motion.div>
)

const MapsButton = ({ direccion, primaryColor }: { direccion: string; primaryColor: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
    <Link
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
      target='_blank'
      rel='noreferrer'
      className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border'
      style={{
        backgroundColor: `${primaryColor}10`,
        color: primaryColor,
        borderColor: `${primaryColor}30`,
      }}
    >
      <ExternalLink size={14} />
      Abrir en Google Maps
    </Link>
  </motion.div>
)

const ContactCard = ({ icon: Icon, title, content, color, delay = 0, cardBg }: {
  icon: React.ElementType; title: string
  content: React.ReactNode; color: string; delay?: number; cardBg: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className='rounded-2xl p-6 shadow-lg border border-darkblue/10 dark:border-white/10 group hover:shadow-xl transition-all duration-300'
    style={{ backgroundColor: cardBg }}
  >
    <div
      className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <h3 className='text-lg font-bold text-darkblue dark:text-white mb-2'>{title}</h3>
    <div className='text-lightgrey text-sm space-y-1'>{content}</div>
  </motion.div>
)

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ContactoPage() {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [portadas, setPortadas]       = useState<PortadaType[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [mounted, setMounted]         = useState(false)
  const { theme }                     = useTheme()

  const DEFAULT_COORDS: [number, number] = [-16.5009, -68.1503]
  const [mapPosition, setMapPosition] = useState<[number, number]>(DEFAULT_COORDS)
  const [mapLoading, setMapLoading]   = useState(true)
  const [mapError, setMapError]       = useState<string | null>(null)
  const [leafletReady, setLeafletReady] = useState(false)
  
  // Ref para evitar múltiples peticiones simultáneas
  const isFetchingRef = useRef(false)

  useEffect(() => { setMounted(true) }, [])

  // Cargar datos de la API
  useEffect(() => {
    Promise.all([getInstitucionPrincipal(), getContenido()])
      .then(([principal, contenido]) => {
        setInstitucion(principal.Descripcion)
        setPortadas(contenido.portada)
        setError(null)
      })
      .catch((err) => {
        console.error('Error fetching contact page data:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar la información de contacto')
      })
      .finally(() => setLoading(false))
  }, [])

  // Configurar Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
    setLeafletReady(true)
  }, [])

  // Geocodificación con las nuevas mejoras (User-Agent, caché, rate limiting)
// Geocodificación con las nuevas mejoras (User-Agent, caché, rate limiting)
useEffect(() => {
  if (loading || !institucion || isFetchingRef.current) return

  const direccion = institucion.institucion_direccion
    ?? 'Av. Sucre Z. Villa Esperanza, Campus Upea Bloque B Piso 3'

  const loadCoordinates = async () => {
    isFetchingRef.current = true
    setMapLoading(true)
    
    try {
      const coords = await fetchCoordinates(direccion)
      if (coords) {
        setMapPosition(coords)
        setMapError(null)
      } else {
        // Usar coordenadas por defecto de El Alto
        setMapPosition([-16.5009, -68.1503])
        setMapError('Mostrando ubicación aproximada')
      }
    } catch (err) {
      console.error('Error en geocodificación:', err)
      setMapError('No se pudo cargar la ubicación exacta')
      setMapPosition([-16.5009, -68.1503])
    } finally {
      setMapLoading(false)
      isFetchingRef.current = false
    }
  }

  loadCoordinates()
}, [institucion, loading])

  const primaryColor   = institucion?.colorinstitucion?.[0]?.color_primario   ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'
  const isDark         = mounted && theme === 'dark'
  const cardBg         = isDark ? 'var(--color-header-dark)' : '#ffffff'

  // Pantalla de error principal
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary dark:bg-darkmode'>
        <div className='text-center p-8 max-w-md'>
          <div className='text-5xl mb-4'>⚠️</div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
            Error al cargar la página
          </h3>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 rounded-lg text-white transition-colors'
            style={{ backgroundColor: primaryColor }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-12 h-12 rounded-full border-4 border-t-transparent'
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    )
  }

  const direccionFallback = institucion?.institucion_direccion ?? 'Av. Sucre Z. Villa Esperanza El Alto'

  return (
    <div className='min-h-screen bg-secondary dark:bg-darkmode overflow-x-hidden relative'>

      {/* Partículas */}
      <EnvParticle icon={Leaf}     x='3%'  y='10%' delay={0}   size={32} color={primaryColor}   />
      <EnvParticle icon={Wind}     x='88%' y='20%' delay={1}   size={28} color={secondaryColor}  />
      <EnvParticle icon={Droplets} x='82%' y='65%' delay={2}   size={24} color={primaryColor}    />
      <EnvParticle icon={Leaf}     x='8%'  y='75%' delay={0.5} size={36} color={secondaryColor}  />
      <EnvParticle icon={Wind}     x='12%' y='40%' delay={1.5} size={20} color={primaryColor}    />
      <EnvParticle icon={Droplets} x='72%' y='45%' delay={3}   size={26} color={secondaryColor}  />

      {/* HERO */}
      <section className='relative h-72 md:h-80 lg:h-96 w-full overflow-hidden'>
        {portadas[0]?.portada_imagen ? (
          <>
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              src={portadas[0].portada_imagen}
              alt={portadas[0].portada_titulo ?? 'Contacto'}
              className='absolute inset-0 w-full h-full object-cover object-center'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70' />
          </>
        ) : (
          <div
            className='absolute inset-0'
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          />
        )}
        <div className='relative h-full flex flex-col items-center justify-center container text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg'
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-200 max-w-2xl mx-auto drop-shadow'
          >
            Comunícate con nosotros a través de cualquiera de nuestros canales.
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='h-1 mt-6 rounded-full'
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      </section>

      {/* CARDS DE CONTACTO */}
      <section className='relative py-24 overflow-hidden'>
        <div className='container'>
          <SectionIn className='text-center mb-12 space-y-3'>
            <Chip color={primaryColor}>Información</Chip>
            <h2 className='text-4xl font-black text-darkblue dark:text-white'>
              ¿Cómo podemos ayudarte?
            </h2>
            <p className='text-lightgrey max-w-2xl mx-auto'>
              Encuentra aquí todos los medios de contacto disponibles
            </p>
          </SectionIn>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {institucion?.institucion_direccion && (
              <ContactCard
                icon={MapPin} title='Dirección' color={primaryColor} delay={0.1} cardBg={cardBg}
                content={<p className='leading-relaxed'>{institucion.institucion_direccion}</p>}
              />
            )}

            {(institucion?.institucion_celular1 || institucion?.institucion_celular2) && (
              <ContactCard
                icon={Phone} title='Teléfonos' color={primaryColor} delay={0.2} cardBg={cardBg}
                content={
                  <div className='space-y-1'>
                    {institucion?.institucion_celular1 && (
                      <PhoneLink number={institucion.institucion_celular1} />
                    )}
                    {institucion?.institucion_celular2 && (
                      <PhoneLink number={institucion.institucion_celular2} />
                    )}
                  </div>
                }
              />
            )}

            {(institucion?.institucion_correo1 || institucion?.institucion_correo2) && (
              <ContactCard
                icon={Mail} title='Correos' color={primaryColor} delay={0.3} cardBg={cardBg}
                content={
                  <div className='space-y-1'>
                    {institucion?.institucion_correo1 && (
                      <EmailLink email={institucion.institucion_correo1} />
                    )}
                    {institucion?.institucion_correo2 && (
                      <EmailLink email={institucion.institucion_correo2} />
                    )}
                  </div>
                }
              />
            )}

            <ContactCard
              icon={Clock} title='Horario de atención' color={primaryColor} delay={0.4} cardBg={cardBg}
              content={
                <div className='space-y-2'>
                  <div>
                    <p className='font-semibold text-darkblue dark:text-white'>Lunes a Viernes</p>
                    <p className='text-xs text-lightgrey'>Mañana: 8:30 - 12:30</p>
                    <p className='text-xs text-lightgrey'>Tarde: 14:00 - 18:00</p>
                  </div>
                  <div className='pt-1'>
                    <p className='font-semibold text-darkblue dark:text-white'>Sábado y Domingo</p>
                    <p className='text-xs text-lightgrey'>Sin atención</p>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* REDES SOCIALES */}
      {(institucion?.institucion_facebook || institucion?.institucion_youtube || institucion?.institucion_twitter) && (
        <section className='py-16 relative overflow-hidden' style={{ backgroundColor: isDark ? 'var(--color-header-dark)' : '#ffffff' }}>
          <div className='container'>
            <SectionIn className='text-center mb-10 space-y-3'>
              <Chip color={primaryColor}>Síguenos</Chip>
              <h2 className='text-3xl font-black text-darkblue dark:text-white'>Redes Sociales</h2>
              <p className='text-lightgrey'>Conéctate con nosotros en nuestras plataformas digitales</p>
            </SectionIn>

            <div className='flex flex-wrap items-center justify-center gap-4'>
              {institucion.institucion_facebook && (
                <SocialButton href={institucion.institucion_facebook} bgColor='#1877f2' icon={FaFacebook} label='Facebook' />
              )}
              {institucion.institucion_youtube && (
                <SocialButton href={institucion.institucion_youtube} bgColor='#ff0000' icon={FaYoutube} label='YouTube' />
              )}
              {institucion.institucion_twitter && (
                <SocialButton href={institucion.institucion_twitter} bgColor={primaryColor} icon={FaTelegram} label='Telegram' />
              )}
              {institucion.institucion_celular1 && (
                <SocialButton
                  href={`https://wa.me/591${institucion.institucion_celular1}`}
                  bgColor='#25D366' icon={FaWhatsapp} label='WhatsApp'
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* MAPA */}
      <section className='relative py-24 overflow-hidden'>
        <div className='container'>
          <SectionIn className='text-center mb-10 space-y-3'>
            <Chip color={primaryColor}>Ubicación</Chip>
            <h2 className='text-3xl font-black text-darkblue dark:text-white'>Encuéntranos</h2>
            <p className='text-lightgrey'>Visítanos en nuestras instalaciones</p>
          </SectionIn>

          <SectionIn delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
              className='rounded-2xl overflow-hidden shadow-2xl border border-darkblue/10 dark:border-white/10'
            >
              {mapLoading || !leafletReady ? (
                <div className='h-96 flex flex-col items-center justify-center bg-gray-100 dark:bg-darklight'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className='w-8 h-8 rounded-full border-2 border-t-transparent mb-3'
                    style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
                  />
                  <p className='text-sm text-lightgrey'>Cargando mapa...</p>
                </div>
              ) : mapError ? (
                <div className='h-96 flex flex-col items-center justify-center bg-gray-100 dark:bg-darklight'>
                  <div className='text-4xl mb-3'>🗺️</div>
                  <p className='text-sm text-red-500 mb-2'>Error al cargar el mapa</p>
                  <p className='text-xs text-lightgrey text-center max-w-md'>{mapError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className='mt-4 px-4 py-2 text-sm rounded-lg text-white transition-colors'
                    style={{ backgroundColor: primaryColor }}
                  >
                    Reintentar
                  </button>
                </div>
              ) : typeof window !== 'undefined' && (
                <MapContainer
                  center={mapPosition}
                  zoom={15}
                  style={{ height: '450px', width: '100%', zIndex: 0 }}
                >
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={mapPosition}>
                    <Popup>
                      <strong>{institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}</strong>
                      <br />
                      {institucion?.institucion_direccion}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </motion.div>
          </SectionIn>

          <SectionIn delay={0.3} className='text-center mt-6'>
            <MapsButton direccion={direccionFallback} primaryColor={primaryColor} />
          </SectionIn>
        </div>
      </section>

    </div>
  )
}