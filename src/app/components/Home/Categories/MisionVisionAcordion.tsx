'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Target, Eye, Compass, Zap } from 'lucide-react'
import { InstitucionType } from '@/app/types/ambiental.types'

const items = [
  { key: 'institucion_mision',   label: 'Misión',    icon: Target  },
  { key: 'institucion_vision',   label: 'Visión',    icon: Eye     },
  { key: 'institucion_objetivos', label: 'Objetivos', icon: Compass },
]

interface Props {
  institucion: InstitucionType | null
  loading: boolean
}

export default function MisionVisionAcordion({ institucion, loading }: Props) {
  const [open, setOpen] = useState<string | null>('institucion_mision')

  const primaryColor   = institucion?.colorinstitucion?.[0]?.color_primario   ?? '#4F8D40'
  const secondaryColor = institucion?.colorinstitucion?.[0]?.color_secundario ?? '#337a56'

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse' />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      {items.map((item) => {
        const isOpen = open === item.key
        const content = institucion?.[item.key as keyof InstitucionType] as string | undefined
        const Icon = item.icon

        return (
          <motion.div key={item.key} layout className='relative'>
            <div
              className={`bg-white dark:bg-lightdarkblue rounded-2xl transition-all duration-300 ${
                isOpen ? 'shadow-2xl' : 'shadow-md'
              }`}
              style={isOpen ? { border: `1px solid ${primaryColor}30`, boxShadow: `0 25px 50px -12px ${primaryColor}40` } : {}}
            >
              <button
                onClick={() => setOpen(isOpen ? null : item.key)}
                className='w-full flex items-center gap-4 px-6 py-5 text-left'
              >
                <div
                  className='w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0'
                  style={gradientStyle}
                >
                  <Icon size={24} className='text-white' />
                </div>

                <div className='flex-1'>
                  <h3
                    className='text-lg font-bold transition-colors'
                    style={{ color: isOpen ? primaryColor : undefined }}
                  >
                    {item.label}
                  </h3>
                  <p className='text-xs text-lightgrey mt-0.5'>
                    {isOpen ? '▼ Expandido' : '▶ Click para expandir'}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
                  style={isOpen ? gradientStyle : { backgroundColor: '#f3f4f6' }}
                >
                  <ChevronDown size={18} className={isOpen ? 'text-white' : 'text-lightgrey'} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && content && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className='overflow-hidden'
                  >
                    <div className='px-6 pb-6 pt-2 border-t border-darkblue/10 dark:border-white/10'>
                      <div
                        className='w-12 h-1 rounded-full mb-4'
                        style={gradientStyle}
                      />
                      <div
                        className='text-lightgrey leading-relaxed text-sm prose prose-sm max-w-none dark:prose-invert'
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                      <div className='mt-4 flex justify-end'>
                        <Zap size={14} style={{ color: primaryColor }} className='opacity-50' />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}

      <Link
        href='/about'
        className='group relative mt-2 flex items-center justify-between px-6 py-4 rounded-xl bg-white dark:bg-lightdarkblue border border-darkblue/10 dark:border-white/10 hover:shadow-lg transition-all duration-300 overflow-hidden'
      >
        <span className='text-sm font-semibold' style={{ color: primaryColor }}>
          Conoce más sobre nuestra carrera
        </span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ color: primaryColor }}
        >
          <ChevronDown size={18} className='-rotate-90' />
        </motion.div>
        <div
          className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'
          style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)` }}
        />
      </Link>
    </div>
  )
}