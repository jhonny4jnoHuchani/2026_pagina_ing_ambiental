'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // ✅ CORRECCIÓN DE RENDIMIENTO: Se añade { passive: true }
    window.addEventListener('scroll', toggleVisibility, { passive: true })

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div className='fixed bottom-8 right-8 z-999'>
      <div className='flex items-center gap-2.5'>

        {isVisible && (
          <div
            onClick={scrollToTop}
            // ✅ CORRECCIÓN DE ACCESIBILIDAD 1: Se añade rol de botón
            role='button'
            // ✅ CORRECCIÓN DE ACCESIBILIDAD 2: Se añade manejador de teclado
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                scrollToTop()
              }
            }}
            // ✅ ACCESIBILIDAD: Se añade tabIndex para que sea enfocable
            tabIndex={0}
            aria-label='scroll to top'
            // ✅ ARQUITECTURA: Se reemplaza w-10 h-10 por size-10 (Tailwind 3.4+)
            className='back-to-top flex size-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark'
          >
            <span className='mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white'></span>
          </div>
        )}
      </div>
    </div>
  )
}