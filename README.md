# Ingeniería Ambiental – UPEA

Plataforma web institucional desarrollada para la **Carrera de Ingeniería Ambiental** de la Universidad Pública de El Alto (UPEA). Sitio moderno, responsive y auditado bajo estándares de seguridad, diseñado para difundir información académica, historia institucional, publicaciones, eventos, videos, autoridades, cursos, convocatorias y contacto institucional.

Desarrollado con **Next.js 16** (App Router) + TypeScript, con consumo de API REST institucional y almacenamiento de assets en MinIO.

---

##  Tecnologías Utilizadas

 Categoría      Herramientas 
 **Framework**  Next.js 16 (App Router) 
 **Lenguaje**   TypeScript 5.7 
 **Frontend**   React 19 
 **Estilos**    Tailwind CSS + CSS Variables dinámicas 
 **Animaciones** Framer Motion 
 **Iconos**       Lucide React 
 **HTTP Client**  Axios 
 **Control**      Git & GitHub 
 **Almacenamiento**  MinIO (`archivosminio.upea.bo`) 
 **Backend/API**  REST API institucional (`apiadministrador.upea.bo`) 
 **Seguridad**  CSP, Headers anti-clickjacking, `rel="noopener noreferrer"`, Validación de URLs, Sanitización XSS 

---

##  Características Principales

###  Diseño Dinámico
- **Colores institucionales** consumidos en tiempo real desde la API (`colorinstitucion`)
- Variables CSS dinámicas (`--color-primario`, `--color-secundario`, `--color-terciario`)
- Tema adaptable a cualquier carrera de la UPEA

###  100% Responsive
- Adaptado para móviles, tablets y escritorio
- Menú hamburguesa animado para dispositivos móviles
- Grid layouts con Tailwind CSS

###  Seguridad Implementada
- **Validación estricta de URLs** con whitelist de dominios
- **Sanitización de atributos HTML** contra XSS
- **Enlaces externos seguros** con `rel="noopener noreferrer"`
- **Headers de seguridad HTTP** (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- **Content-Security-Policy** con `upgrade-insecure-requests`
- **Fetch seguro con timeout** (AbortController)
- **Manejo de errores sin exposición** de información sensible

###  Multimedia Integrada
- **Slider de portadas** con auto-rotación
- **Reproductores de video** YouTube embebidos con políticas CSP seguras
- **Mapas interactivos** de Google Maps con coordenadas GPS
- **Imágenes optimizadas** con Next.js Image (lazy loading, priority, sizes)

###  Navegación Avanzada
- **Routing con Next.js App Router** (navegación sin recargar página)
- **Rutas dinámicas** para convocatorias, cursos, eventos, publicaciones, servicios
- **Scroll suave** a secciones con anclas
- **Componente ScrollToTop** para navegación rápida

###  Rendimiento Optimizado
- **Code-splitting** automático de Next.js
- **Lazy loading** de imágenes y componentes
- **Priority loading** en imágenes del hero (LCP)
- **Cache configuration** con revalidación
- **Optimización de imágenes** con formatos AVIF y WebP

---

##  Lo que hace el Proyecto

- Renderiza interfaz con **Next.js 16 App Router** y React 19
- Consume **4 endpoints REST** de la API administrativa UPEA
- Aplica **temas dinámicos** con colores desde `colorinstitucion` API
- Implementa **routing por páginas** (`/about`, `/contacto`, `/convocatorias`, `/cursos`, `/eventos`, `/publicaciones`, `/servicios`, etc.)
- Visualiza **PDFs** mediante enlaces con `target="_blank"` y `rel="noopener noreferrer"`
- Integra **iframes de YouTube** y **Google Maps** con políticas CSP seguras
- Procesa **imágenes desde MinIO** (`archivosminio.upea.bo`)
- Valida y sanitiza URLs con helpers en `src/utils/imageHelper.js`
- Gestiona estados con **React Hooks** (`useState`, `useEffect`, `useRef`)
- Aplica **animaciones con Framer Motion** y CSS transitions
- Genera **build optimizado** con `npm run build`
- Despliega en producción con **headers de seguridad**

---

##  Estructura del Proyecto

```text
 public/            # Assets estáticos (decoradores, images, logo, favicon)
 src/
 app/                # Next.js App Router
 about/              # Página Sobre Nosotros
 api/data/           # Rutas de API internas
 components/         # Componentes reutilizables:
 Home/               # Componentes del Home (Categories, Hero, Pricing, Project, Records, Review, Specialize)
 Layout/             # Footer, Header, Logo, Navigation, ScrollToTop
 ContactForm/        # Formulario de contacto
 contacto/           # Página de contacto
convocatorias/       # Página de convocatorias con rutas dinámicas [id]
 cursos/             # Página de cursos con rutas dinámicas [id], seminario eventos/            # Página de eventos con rutas dinámicas [id]
 gaceta/             # Página de gaceta con rutas dinámicas [id]
 mantenimiento/      # Página de mantenimiento
 ofertas/            # Página de ofertas con rutas dinámicas [id]
 publicaciones/      # Página de publicaciones con rutas dinámicas [id]
 servicios/          # Página de servicios con rutas dinámicas [id]
 types/              # Tipos TypeScript (ambiental.types.ts, category.ts, footerlinks.ts, hero.ts, etc.
 videos/             # Página de videos con rutas dinámicas [id]
 layout.tsx          # Layout raíz
 page.tsx            # Página principal (Home)
 globals.css         #  Estilos globales
 services/           # Servicios de consumo de API
 ambientalService.d.ts  # Tipos del servicio
 ambientalService.js    # Implementación del servicio
 axiosConfig.js         # Configuración de Axios
 utils/                 # Funciones auxiliares (imageHelper.js)
 .env.copy              # Template de variables de entorno
 .gitignore
 eslint.config.mjs
 next.config.ts
 package.json
 postcss.config.mjs
 tsconfig.json

## Variables de Entorno

NEXT_PUBLIC_ROOT_API
NEXT_PUBLIC_TOKEN
NEXT_PUBLIC_LOGIN_ADM
NEXT_PUBLIC_ID_INSTITUCION

## Endpoints Principales

# 1. Institución Principal
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/{ID}" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 2. Recursos Institucionales
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{ID}/recursos" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 3. Contenido Dinámico
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{ID}/contenido" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 4. Gacetas y Eventos
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{ID}/gacetaEventos" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

## Instalacion para la pagina de ingenieria ambiental 

# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/2026-PaginaIngAmbiental.git
cd 2026-PaginaIngAmbiental

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
# Copiar las variables de entorno descritas arriba

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000

## Notas Operativas

### Solución de Problemas Comunes

- **"Error al cargar datos"**: Verificar conexión con la API o que el token no haya expirado
- **Imágenes no se visualizan**: Verificar que `NEXT_PUBLIC_MINIO_BASE_URL` apunte correctamente a MinIO
- **PDFs no abren**: Revisar que el CSP incluya `frame-src` y `object-src` para MinIO
- **Navegación no funciona entre páginas**: Verificar que las páginas existan en `src/app/`
- **Colores no cambian**: Limpiar caché del navegador o modificar en panel administrativo
- **Puerto 3000 ocupado**: Usar `npm run dev -- -p 3001` para otro puerto
- **Variables de entorno no cargan**: Reiniciar el servidor después de crear `.env.local`
- **Error de hidratación**: Agregar `suppressHydrationWarning` en `<html>` si es necesario
- **Warning de imágenes con `fill`**: Agregar `relative` al padre de la imagen y configurar `sizes`

### Buenas Prácticas

- Usar `npm run build` solo cuando el sistema esté estable y todas las pruebas pasen
- Para cambios de colores, modificar directamente en el panel administrativo de la API (no en el frontend)
- Las variables de entorno `.env.local` **NO** se suben a Git; cada desarrollador debe crear su propio archivo
- Mantener dependencias actualizadas con `npm audit` periódicamente
- Rotar credenciales de API cada 6 meses
- Usar `rel="noopener noreferrer"` a todos los enlaces externos con `target="_blank"`
- Mantener la estructura de carpetas organizada por dominio (Home, Layout, ContactForm, etc.)
- Usar tipos TypeScript estrictos en `src/app/types/` para mantener la consistencia del código
- Centralizar el consumo de API en `src/services/ambientalService.js`
- Usar `axiosConfig.js` para configuración global de Axios (timeouts, interceptores, headers)

---

##  Recomendación Final

Se recomienda mantener este repositorio con las siguientes responsabilidades:

- Frontend **Next.js 16 + TypeScript** para visualización de datos institucionales
- Nada de lógica de negocio compleja en el cliente
- Nada de almacenamiento local sensible (solo caché de imágenes)
- Nada de conexión directa a base de datos
- Todo el consumo vía **API REST** con token de autenticación
- Seguridad implementada en frontend (validación, sanitización, headers)
- Mantener la estructura de carpetas modular y escalable
- Usar componentes reutilizables en `src/app/components/`
- Implementar rutas dinámicas `[id]` para detalles de convocatorias, cursos, eventos, etc.
- Mantener los tipos TypeScript actualizados en `src/app/types/`
- Usar Framer Motion para animaciones suaves y profesionales
- Optimizar imágenes con el componente `next/image` para mejorar el LCP