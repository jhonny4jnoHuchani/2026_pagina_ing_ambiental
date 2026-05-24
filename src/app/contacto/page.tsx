'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000

const getCachedCoords = (dir: string): [number, number] | null => {
  try {
    const raw = localStorage.getItem('upea_map_coords')
    if (!raw) return null
    const { coords, address, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL || address !== dir) return null
    return coords
  } catch { return null }
}

const setCachedCoords = (dir: string, coords: [number, number]) => {
  try {
    localStorage.setItem('upea_map_coords', JSON.stringify({
      coords, address: dir, timestamp: Date.now(),
    }))
  } catch { /* no crítico */ }
}

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

export default function ContactoPage() {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [portadas, setPortadas]       = useState<PortadaType[]>([])
  const [loading, setLoading]         = useState(true)
  const [mounted, setMounted]         = useState(false)
  const { theme }                     = useTheme()

  const DEFAULT_COORDS: [number, number] = [-16.5009, -68.1503]
  const [mapPosition, setMapPosition] = useState<[number, number]>(DEFAULT_COORDS)
  const [mapLoading, setMapLoading]   = useState(true)
  const [leafletReady, setLeafletReady] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    Promise.all([getInstitucionPrincipal(), getContenido()])
      .then(([principal, contenido]) => {
        setInstitucion(principal.Descripcion)
        setPortadas(contenido.portada)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

  useEffect(() => {
    if (loading || !institucion) return

    const direccion = institucion.institucion_direccion
      ?? 'Av. Sucre Z. Villa Esperanza, Campus Upea Bloque B Piso 3'

    const cached = getCachedCoords(direccion)
    if (cached) {
      setMapPosition(cached)
      setMapLoading(false)
      return
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'es' } }
    )
      .then(r => r.json())
      .then(data => {
        if (data?.[0]) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          setMapPosition(coords)
          setCachedCoords(direccion, coords)
        }
      })
      .catch(e => console.error('Error geocodificando:', e))
      .finally(() => setMapLoading(false))
  }, [institucion, loading])

  const primaryColor   = institucion?.colorinstitucion?.[0]?.color_primario   ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'
  const isDark         = mounted && theme === 'dark'
  const cardBg         = isDark ? 'var(--color-header-dark)' : '#ffffff'

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
                <div className='h-96 flex items-center justify-center bg-gray-100 dark:bg-darklight'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className='w-8 h-8 rounded-full border-2 border-t-transparent'
                    style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
                  />
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