import { formatDistanceToNowStrict, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatTimeAgo = (date: string | Date | undefined | null) => {
  if (!date) {
    return 'Fecha desconocida'
  }

  const parsedDate = new Date(date)

  if (!isValid(parsedDate)) {
    console.error('Invalid date received:', date)
    return 'Fecha inválida'
  }

  return formatDistanceToNowStrict(parsedDate, {
    locale: es,
    addSuffix: false,
  })
    .replace('horas', 'h')
    .replace('hora', 'h')
    .replace('minutos', 'm')
    .replace('minuto', 'm')
    .replace('segundos', 's')
    .replace('días', 'd')
    .replace('día', 'd')
}
