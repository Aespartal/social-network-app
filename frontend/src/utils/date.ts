import { formatDistanceToNowStrict } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatTimeAgo = (date: string | Date) => {
  return formatDistanceToNowStrict(new Date(date), {
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
