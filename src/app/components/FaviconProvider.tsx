'use client'

import { useEffect } from 'react'
import { getInstitucionPrincipal } from '@/services/ambientalService'

export default function FaviconProvider() {
  useEffect(() => {
    getInstitucionPrincipal()
      .then(data => {
        const logo = data?.Descripcion?.institucion_logo
        const nombre = data?.Descripcion?.institucion_nombre
        if (!logo) return

        // Actualizar favicon
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
          ?? (() => {
            const el = document.createElement('link')
            el.rel = 'icon'
            document.head.appendChild(el)
            return el
          })()
        link.href = logo

        // Actualizar título de la pestaña
        if (nombre) document.title = nombre
      })
      .catch(console.error)
  }, [])

  return null
}