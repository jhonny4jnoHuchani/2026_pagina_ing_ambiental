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
  const [mounted, setMounted]         = useState(false)
  const { theme }                     = useTheme()
  const path                          = usePathname()
  const isActive                      = item.href === path
  const isDark                        = mounted && theme === 'dark'

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className='relative w-full'>
      <div className='flex items-center justify-between w-full'>
        <Link
          href={item.href}
          className={`flex-1 py-2 nav-link nav-link-hover hover:cursor-pointer focus:outline-none transition-colors duration-200
            ${isActive ? '!text-primary' : ''}`}
        >
          <motion.span
            whileHover={{ x: 3 }}
            transition={{ duration: 0.15 }}
            className='flex items-center gap-2'
          >
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                style={{ backgroundColor: 'var(--color-primario)' }}
              />
            )}
            {item.label}
          </motion.span>
        </Link>

        {item.submenu && (
          <motion.button
            onClick={() => setSubmenuOpen(!submenuOpen)}
            animate={{ rotate: submenuOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className='p-1 nav-link nav-link-hover'
          >
            <ChevronDown size={16} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {submenuOpen && item.submenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden'
          >
            <div
              className='p-2 w-full rounded-lg mt-1'
              style={{
                backgroundColor: isDark
                  ? 'var(--color-header-dark-scrolled)'
                  : '#ffffff',
              }}
            >
              {item.submenu.map((subItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={subItem.href}
                    className='flex items-center gap-2 py-2 px-2 rounded-lg nav-link nav-link-hover transition-all duration-150'
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? 'var(--color-header-dark)' : '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span
                      className='w-1 h-1 rounded-full flex-shrink-0'
                      style={{ backgroundColor: 'var(--color-primario)', opacity: 0.5 }}
                    />
                    {subItem.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileHeaderLink