'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { NavLinkType } from '@/app/types/navlink'

const MobileHeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const path = usePathname()
  const isActive = item.href === path
  const isDark = mounted && theme === 'dark'

  useEffect(() => { setMounted(true) }, [])

  // Determinar si el link actual o algún subitem está activo
  const isParentActive = item.submenu?.some(sub => sub.href === path) || isActive

  return (
    <div className='w-full border-b border-gray-100 dark:border-gray-800 last:border-0'>
      <div className='flex items-center justify-between w-full py-2'>
        <Link
          href={item.href}
          className={`flex-1 text-sm font-medium transition-colors duration-200
            ${isParentActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
          onClick={() => {
            if (!item.submenu) {
              // Cerrar menú solo si no tiene submenú
              const closeEvent = new CustomEvent('closeMobileMenu')
              window.dispatchEvent(closeEvent)
            }
          }}
        >
          {item.label}
        </Link>

        {item.submenu && item.submenu.length > 0 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setSubmenuOpen(!submenuOpen)
            }}
            animate={{ rotate: submenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label={submenuOpen ? 'Cerrar submenú' : 'Abrir submenú'}
          >
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {submenuOpen && item.submenu && item.submenu.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-2 space-y-1">
              {item.submenu.map((subItem, idx) => {
                const isSubActive = subItem.href === path
                return (
                  <Link
                    key={idx}
                    href={subItem.href}
                    className={`block py-2 px-3 text-sm rounded-lg transition-all duration-200
                      ${isSubActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    onClick={() => {
                      setSubmenuOpen(false)
                      const closeEvent = new CustomEvent('closeMobileMenu')
                      window.dispatchEvent(closeEvent)
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-primario)', opacity: isSubActive ? 1 : 0.4 }}
                      />
                      {subItem.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileHeaderLink