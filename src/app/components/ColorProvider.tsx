'use client'

import { useEffect } from 'react'
import { getInstitucionPrincipal } from '@/services/ambientalService'

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function darken(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    Math.max(0, Math.floor(r * (1 - pct / 100))),
    Math.max(0, Math.floor(g * (1 - pct / 100))),
    Math.max(0, Math.floor(b * (1 - pct / 100))),
  )
}

function lighten(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    Math.min(255, Math.floor(r + (255 - r) * (pct / 100))),
    Math.min(255, Math.floor(g + (255 - g) * (pct / 100))),
    Math.min(255, Math.floor(b + (255 - b) * (pct / 100))),
  )
}

function toGreyTone(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  const grey = Math.floor(r * 0.299 + g * 0.587 + b * 0.114)
  const mix  = (c: number) => Math.floor(c * (pct / 100) + grey * (1 - pct / 100))
  return rgbToHex(mix(r), mix(g), mix(b))
}

export default function ColorProvider() {
  useEffect(() => {
    getInstitucionPrincipal()
      .then(data => {
        const colores = data?.Descripcion?.colorinstitucion?.[0]
        if (!colores) return

        const p = colores.color_primario
        const s = colores.color_secundario
        const t = colores.color_terciario

        const root = document.documentElement

        // ── Variables base de la API ──────────────────────
        root.style.setProperty('--color-primario',   p)
        root.style.setProperty('--color-secundario', s)
        root.style.setProperty('--color-terciario',  t)

        // ── Header dark ───────────────────────────────────
        root.style.setProperty('--color-header-dark',          darken(t, 40))
        root.style.setProperty('--color-header-dark-scrolled', darken(t, 25))
        root.style.setProperty('--color-mobile-menu-dark',     darken(t, 45))

        // ── Derivados semánticos ──────────────────────────
        const darkblueD      = darken(p, 65)
        const darkmodeD      = darken(t, 55)
        const darklightD     = darken(t, 48)
        const lightdarkblueD = darken(t, 42)
        const secondaryD     = lighten(p, 92)
        const greyD          = toGreyTone(p, 20)

        root.style.setProperty('--color-darkblue-d',       darkblueD)
        root.style.setProperty('--color-darkmode-d',       darkmodeD)
        root.style.setProperty('--color-darklight-d',      darklightD)
        root.style.setProperty('--color-lightdarkblue-d',  lightdarkblueD)
        root.style.setProperty('--color-secondary-d',      secondaryD)
        root.style.setProperty('--color-grey-d',           greyD)

        // ── Actualizar variables de Tailwind @theme ───────
        // Esto hace que bg-darkmode, bg-darklight, etc.
        // usen los colores dinámicos en lugar de los fijos
        root.style.setProperty('--color-primary',       p)
        root.style.setProperty('--color-secondary',     secondaryD)
        root.style.setProperty('--color-darkmode',      darkmodeD)
        root.style.setProperty('--color-darklight',     darklightD)
        root.style.setProperty('--color-darkblue',      darkblueD)
        root.style.setProperty('--color-lightdarkblue', lightdarkblueD)
        root.style.setProperty('--color-lightgrey',     greyD)
      })
      .catch(console.error)
  }, [])

  return null
}