'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { NavLinkType } from '@/app/types/navlink'

const HeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname()
  const isActive = item.href === path || path.startsWith(`/${item.label.toLowerCase()}`)

  return (
    <li
      className='relative'
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => setSubmenuOpen(false)}
    >
      <Link
        href={item.href}
        className={`relative flex items-center gap-1 px-1 py-2 text-base font-normal transition-colors duration-200
          text-darkblue dark:text-white hover:text-primary dark:hover:text-primary
          ${isActive ? '!text-primary dark:!text-primary' : ''}`}
      >
        {/* Indicador activo animado */}
        {isActive && (
          <motion.span
            layoutId='nav-underline'
            className='absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full'
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
            className='absolute top-full left-0 mt-2 w-60 bg-white dark:bg-white/10 shadow-lg rounded-lg py-2 z-50 overflow-hidden'
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
                  className='flex items-center gap-2 px-4 py-2 text-darkblue dark:text-white hover:bg-neutral-50 dark:hover:bg-darkmode/10 hover:text-primary dark:hover:text-primary transition-all duration-150'
                >
                  <span className='w-1 h-1 rounded-full bg-primary/50 flex-shrink-0' />
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