/**
 * Formatea números grandes con abreviaciones (K, M, B)
 * @param num Número a formatear
 * @returns Número formateado como string
 * @example formatNumber(1500) // "1.5K"
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

/**
 * Trunca texto y agrega puntos suspensivos
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Capitaliza la primera letra de un string
 * @param str String a capitalizar
 * @returns String capitalizado
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Valida si un string es una URL válida
 * @param url URL a validar
 * @returns true si es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extrae las iniciales de un nombre
 * @param name Nombre completo
 * @returns Iniciales (máximo 2 caracteres)
 * @example getInitials("John Doe") // "JD"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Genera un color consistente basado en un string (para avatares)
 * @param str String base
 * @returns Color hexadecimal
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i) ?? 0
    hash = code + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 65%, 50%)`
}

/**
 * Debounce function
 * @param func Función a ejecutar
 * @param delay Delay en ms
 * @returns Función debounced
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 * @param func Función a ejecutar
 * @param limit Límite en ms
 * @returns Función throttled
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
