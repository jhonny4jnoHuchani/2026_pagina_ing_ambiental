'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { X, LogIn, Sparkles } from 'lucide-react'
import { FaFacebook, FaYoutube } from 'react-icons/fa'
import { FaTelegram } from 'react-icons/fa6'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import Logo from './Logo'

const navlinks = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Institución', href: '/about',
    submenu: [
      { label: 'Nosotros', href: '/about' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    label: 'Convocatorias', href: '/convocatorias',
    submenu: [
      { label: 'Convocatorias', href: '/convocatorias' },
      { label: 'Avisos', href: '/convocatorias/avisos' },
      { label: 'Comunicados', href: '/convocatorias/comunicados' },
    ],
  },
  {
    label: 'Cursos', href: '/cursos',
    submenu: [
      { label: 'Cursos', href: '/cursos' },
      { label: 'Seminarios', href: '/cursos/seminarios' },
    ],
  },
  {
    label: 'Más', href: '/servicios',
    submenu: [
      { label: 'Servicios', href: '/servicios' },
      { label: 'Ofertas Académicas', href: '/ofertas' },
      { label: 'Publicaciones', href: '/publicaciones' },
      { label: 'Gacetas', href: '/gaceta' },
      { label: 'Eventos', href: '/eventos' },
      { label: 'Videos', href: '/videos' },
    ],
  },
]
const RED_COLOR = '#dc2626'
const LoginButton = ({
  href, onClick, className,
}: {
  href: string; onClick?: () => void; className?: string
}) => (
  <Link
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    onClick={onClick}
    className={className}
    style={{
      backgroundColor: RED_COLOR,
      color: 'white'
    }}
  >
    <LogIn size={14} />
    INGRESAR
  </Link>
)

const Header: React.FC = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_ADM ?? '#'
  const isDark = mounted && theme === 'dark'

  useEffect(() => {
    getInstitucionPrincipal()
      .then(data => setInstitucion(data.Descripcion))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  // ── Fondo dinámico del header principal ──────────────────
  const headerBg = isDark
    ? scrolled
      ? 'var(--color-header-dark-scrolled)'
      : 'var(--color-header-dark)'
    : scrolled
      ? 'rgba(255,255,255,0.95)'
      : '#ffffff'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'backdrop-blur-md shadow-xl' : 'shadow-sm'
        }`}
      style={{ backgroundColor: headerBg }}
    >
      {/* Barra superior — color viene de CSS variable */}
      <div
        className='text-white text-xs hidden md:block'
        style={{ backgroundColor: 'var(--color-primario)' }}
      >
        <div className='container py-1.5 flex justify-between items-center'>
          <span className='opacity-90 flex items-center gap-2'>
            <Sparkles size={12} />
            {loading
              ? 'Cargando...'
              : institucion?.institucion_direccion ?? 'UPEA — Universidad Pública de El Alto'}
          </span>
          <div className='flex items-center gap-4'>
            <span className='text-white/80 text-xs'>
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <div className='flex items-center gap-3'>
              {institucion?.institucion_facebook && (
                <Link href={institucion.institucion_facebook} target='_blank' rel='noreferrer' className='hover:opacity-80'>
                  <FaFacebook size={14} />
                </Link>
              )}
              {institucion?.institucion_twitter && (
                <Link href={institucion.institucion_twitter} target='_blank' rel='noreferrer' className='hover:opacity-80'>
                  <FaTelegram size={14} />
                </Link>
              )}
              {institucion?.institucion_youtube && (
                <Link href={institucion.institucion_youtube} target='_blank' rel='noreferrer' className='hover:opacity-80'>
                  <FaYoutube size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className='container'>
        <div className='flex items-center justify-between h-16 gap-6'>

          <Logo />

          <nav className='hidden xl:flex flex-grow items-center justify-center gap-2'>
            <ul className='flex items-center gap-6'>
              {navlinks.map((item, index) => (
                <HeaderLink key={index} item={item} />
              ))}
            </ul>
          </nav>

          <div className='flex items-center gap-3'>
            <button
              aria-label='Toggle theme'
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className='flex items-center justify-center p-2 rounded-full transition-colors'
              style={{
                backgroundColor: isDark
                  ? 'var(--color-header-dark-scrolled)'
                  : '#f5f5f5',
              }}
            >
              <Icon icon='solar:sun-2-bold' width={20} height={20} className='hidden dark:block text-white' />
              <Icon icon='solar:moon-bold' width={20} height={20} className='dark:hidden block' />
            </button>

            <LoginButton
              href={loginUrl}
              className='hidden xl:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors'
            />

            <button
              className='block xl:hidden p-2 rounded-lg hover:cursor-pointer'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Toggle mobile menu'
            >
              <span className='block w-6 h-0.5 bg-darkblue dark:bg-white' />
              <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5' />
              <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5' />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {menuOpen && (
        <div className='fixed inset-0 bg-black/50 z-40 xl:hidden' onClick={() => setMenuOpen(false)} />
      )}

      {/* Menú mobile */}
      <div
        ref={mobileMenuRef}
        className={`xl:hidden fixed top-0 right-0 h-full w-full max-w-xs shadow-xl transform transition-transform duration-300 z-50 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          backgroundColor: isDark
            ? 'var(--color-mobile-menu-dark)'
            : '#ffffff',
        }}
      >
        <div className='flex items-center justify-between p-4 border-b border-darkblue/10 dark:border-white/10'>
          <div className='flex items-center gap-2'>
            {institucion?.institucion_logo && (
              <Image
                src={institucion.institucion_logo}
                alt={institucion.institucion_nombre}
                width={32}
                height={32}
                className='rounded-full object-contain'
              />
            )}
            <span className='text-sm font-semibold' style={{ color: 'var(--color-primario)' }}>
              {institucion?.institucion_iniciales ?? 'ING-AMB'}
            </span>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label='Cerrar menú'>
            <X size={22} className='text-darkblue dark:text-white hover:text-primary' />
          </button>
        </div>

        <nav className='flex flex-col items-start p-4 gap-1 overflow-y-auto h-full pb-24'>
          {navlinks.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}
          <div className='mt-4 w-full'>
            <LoginButton
              href={loginUrl}
              onClick={() => setMenuOpen(false)}
              className='flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold'
            />
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

export default Header