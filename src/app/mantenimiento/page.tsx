'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function MantenimientoPage() {
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    // Leer qué error causó la redirección
    const error = localStorage.getItem('service_error')
    const errorTime = localStorage.getItem('service_error_time')
    
    if (error) {
      if (error === 'network') {
        setErrorDetails('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
      } else if (error === '500') {
        setErrorDetails('Error interno del servidor. Nuestro equipo ya está trabajando en ello.')
      } else if (error === '503') {
        setErrorDetails('El servicio está en mantenimiento. Por favor, intenta más tarde.')
      } else {
        setErrorDetails(`Error ${error} al cargar los datos.`)
      }
    }
    
    // Limpiar después de 5 segundos (por si vuelve a funcionar)
    const timer = setTimeout(() => {
      localStorage.removeItem('service_error')
      localStorage.removeItem('service_error_time')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center p-8 max-w-md'
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
          className='text-7xl mb-6'
        >
          🔧
        </motion.div>
        
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-3'>
          Servicio en Mantenimiento
        </h1>
        
        <p className='text-gray-600 dark:text-gray-300 mb-2'>
          Estamos mejorando nuestros servicios digitales.
        </p>
        
        {errorDetails && (
          <p className='text-sm text-amber-600 dark:text-amber-400 mb-6 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg'>
            {errorDetails}
          </p>
        )}

        <div className='space-y-3'>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/'
            }}
            className='w-full px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition'
          >
            Intentar nuevamente
          </button>
          
          <Link
            href='/'
            className='inline-block w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'
          >
            Volver al Inicio
          </Link>
        </div>

        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            ¿Necesitas ayuda urgente?
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
            📞 Contacta con la Unidad de Tecnologías de Información
          </p>
        </div>
      </motion.div>
    </div>
  )
}