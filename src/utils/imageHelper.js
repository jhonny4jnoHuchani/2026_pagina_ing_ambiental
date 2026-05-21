/**
 * Retorna una imagen de fallback si la URL falla.
 * @param {Event} e - Evento onError del <img>
 * @param {string} fallback - URL de imagen alternativa (opcional)
 */
export const handleImageError = (e, fallback = "/placeholder.webp") => {
  e.target.onerror = null;
  e.target.src = fallback;
};