'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'

const Logo = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInstitucionPrincipal()
      .then(data => setInstitucion(data.Descripcion))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const primaryColor = institucion?.colorinstitucion?.[0]?.color_primario ?? '#4F8D40'

  return (
    <Link href='/'>
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className='flex items-center gap-3'
      >
        {/* Logo imagen */}
        {loading ? (
          <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0' />
        ) : institucion?.institucion_logo ? (
          <Image
            src={institucion.institucion_logo}
            alt={institucion.institucion_nombre ?? 'Logo'}
            width={40}
            height={40}
            className='rounded-full object-contain flex-shrink-0 border-2'
            style={{ borderColor: `${primaryColor}40` }}
            priority
          />
        ) : (
          // Fallback a los SVGs originales si no hay logo en la API
          <>
            <Image
              src='/images/logo/logo.svg'
              alt='logo'
              width={40}
              height={40}
              className='block dark:hidden flex-shrink-0'
              priority
            />
            <Image
              src='/images/logo/white-logo.svg'
              alt='logo'
              width={40}
              height={40}
              className='hidden dark:block flex-shrink-0'
              priority
            />
          </>
        )}

        {/* Nombre */}
        <div className='hidden sm:block'>
          {loading ? (
            <div className='space-y-1'>
              <div className='w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
              <div className='w-24 h-2.5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
            </div>
          ) : (
            <>
              <p
                className='text-sm font-semibold leading-tight'
                style={{ color: primaryColor }}
              >
                {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
              </p>
              <p className='text-xs text-lightgrey leading-tight'>
                Universidad Pública de El Alto
              </p>
            </>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export default Logo