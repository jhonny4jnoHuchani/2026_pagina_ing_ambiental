// RUTA: src/app/cursos/seminarios/page.tsx
import CursosGrid from '../CursosGrid'

export const metadata = {
  title: 'Seminarios — Ingeniería Ambiental UPEA',
}

export default function SeminariosPage() {
  return <CursosGrid tipo='SEMINARIOS' />
}