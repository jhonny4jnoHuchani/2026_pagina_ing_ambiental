'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { NavLinkType } from '@/app/types/navlink'

const MobileHeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname()
  const isActive = item.href === path

  return (
    <div className='relative w-full'>
      <div className='flex items-center justify-between w-full'>
        <Link
          href={item.href}
          className={`flex-1 py-2 text-darkblue dark:text-white hover:text-primary dark:hover:text-primary hover:cursor-pointer focus:outline-none transition-colors duration-200
            ${isActive ? '!text-primary dark:!text-primary' : ''}`}
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
                className='w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0'
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
            className='p-1 text-darkblue dark:text-white hover:text-primary dark:hover:text-primary'
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
            <div className='bg-white dark:bg-white/10 p-2 w-full rounded-lg mt-1'>
              {item.submenu.map((subItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={subItem.href}
                    className='flex items-center gap-2 py-2 px-2 rounded-lg text-darkblue dark:text-white hover:bg-neutral-50 dark:hover:bg-darkmode/10 hover:text-primary dark:hover:text-primary transition-all duration-150'
                  >
                    <span className='w-1 h-1 rounded-full bg-primary/50 flex-shrink-0' />
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