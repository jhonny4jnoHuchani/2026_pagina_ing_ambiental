'use client'

import Image from 'next/image'
import Link from 'next/link'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProjectSkeleton from '../../Skeleton/Project'
import { getRecursos } from '@/services/ambientalService'
import { LinkExternoType } from '@/app/types/ambiental.types'

const LinkCard = ({ item }: { item: LinkExternoType }) => (
  <div className='p-1'>
    <Link
      href={item.url_link}
      target='_blank'
      rel='noopener noreferrer'
      className='block p-5 bg-white dark:bg-lightdarkblue m-3 rounded-lg hover:shadow-lg transition-shadow duration-300'
    >
      <div className='w-full mb-4'>
        <div className='relative w-full h-48 md:h-56 lg:h-64'>
          <Image
            src={item.imagen}
            alt={item.nombre}
            fill
            className='object-cover rounded-lg'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <span
          className='text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full'
          style={{
            color: 'var(--color-primario)',
            backgroundColor: 'color-mix(in srgb, var(--color-primario) 10%, transparent)',
          }}
        >
          {item.tipo}
        </span>
      </div>
      <p className='text-base font-medium text-darkblue dark:text-white mt-2'>
        {item.nombre}
      </p>
    </Link>
  </div>
)
const Project = () => {
  const [links, setLinks] = useState<LinkExternoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const data = await getRecursos(source.token);
        setLinks(data.linksExternoInterno.filter((l: LinkExternoType) => l.estado === 1))
        setError(null)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching links:', error);
          setError(error instanceof Error ? error.message : 'Error al cargar los accesos directos')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => source.cancel('Project desmontado')
  }, [])

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    cssEase: 'linear',
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
      { breakpoint: 430, settings: { slidesToShow: 1 } },
    ],
  }

  // ⚠️ PANTALLA DE ERROR
  if (error) {
    return (
      <div id='links' className='scroll-mt-12'>
        <section className='bg-secondary dark:bg-darklight overflow-hidden min-h-[60vh] flex items-center justify-center'>
          <div className='text-center p-8 max-w-md'>
            <div className='text-5xl mb-4'>⚠️</div>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
              Error al cargar
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 rounded-lg text-white transition-colors'
              style={{ backgroundColor: 'var(--color-primario)' }}
            >
              Reintentar
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div id='links' className='scroll-mt-12'>
      <section className='bg-secondary dark:bg-darklight overflow-hidden'>
        <div className='container relative'>

          <div className='mb-4'>
            <h2 className='text-center'>Accesos Directos</h2>
          </div>
          <div className='md:max-w-45 mx-auto mb-8'>
            <p className='text-xl font-normal text-center leading-8'>
              Plataformas y servicios de la carrera de Ingeniería Ambiental.
            </p>
          </div>

          <div className='relative z-20'>
            <Slider {...settings}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProjectSkeleton key={i} />
                  ))
                : links.map((item) => (
                    <LinkCard key={item.id_link} item={item} />
                  ))}
            </Slider>
          </div>

          <div className='absolute top-28 -left-9 dark:opacity-5'>
            <Image src='/images/banner/pattern1.svg' alt='ptrn1' width={141} height={141} />
          </div>
          <div className='absolute -bottom-7 -right-7 dark:opacity-5 z-10'>
            <Image src='/images/banner/pattern2.svg' alt='ptrn1' width={141} height={141} />
          </div>

        </div>
      </section>
    </div>
  )
}

export default Project