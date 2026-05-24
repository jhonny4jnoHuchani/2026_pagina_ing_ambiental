'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { NavLinkType } from '@/app/types/navlink'

const HeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [mounted, setMounted]         = useState(false)
  const { theme }                     = useTheme()
  const path                          = usePathname()
  const isActive                      = item.href === path || path.startsWith(`/${item.label.toLowerCase()}`)
  const isDark                        = mounted && theme === 'dark'

  useEffect(() => { setMounted(true) }, [])

  return (
    <li
      className='relative'
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => setSubmenuOpen(false)}
    >
      <Link
        href={item.href}
        className={`relative flex items-center gap-1 px-1 py-2 text-base font-normal transition-colors duration-200
          nav-link nav-link-hover
          ${isActive ? '!text-primary dark:!text-primary' : ''}`}
      >
        {isActive && (
          <motion.span
            layoutId='nav-underline'
            className='absolute -bottom-1 left-0 right-0 h-0.5 rounded-full'
            style={{ backgroundColor: 'var(--color-primario)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
          {item.label}
        </motion.span>

        {item.submenu && (
          <motion.span
            animate={{ rotate: submenuOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={15} />
          </motion.span>
        )}
      </Link>

      <AnimatePresence>
        {submenuOpen && item.submenu && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className='absolute top-full left-0 mt-2 w-60 shadow-lg rounded-lg py-2 z-50 overflow-hidden'
            style={{
              backgroundColor: isDark
                ? 'var(--color-header-dark)'
                : '#ffffff',
            }}
          >
            {item.submenu.map((subItem, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  href={subItem.href}
                  className='flex items-center gap-2 px-4 py-2 nav-link nav-link-hover transition-all duration-150'
                  style={{
                    ['--hover-bg' as string]: isDark
                      ? 'var(--color-header-dark-scrolled)'
                      : '#f5f5f5',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? 'var(--color-header-dark-scrolled)' : '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span
                    className='w-1 h-1 rounded-full flex-shrink-0'
                    style={{ backgroundColor: 'var(--color-primario)', opacity: 0.5 }}
                  />
                  {subItem.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}

export default HeaderLink