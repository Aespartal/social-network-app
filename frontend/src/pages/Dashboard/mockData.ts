export interface ActivityData {
  name: string
  posts: number
  interactions: number
}

export interface KPIStats {
  title: string
  value: string | number
  trend: number
  isUp: boolean
  icon: string
  color: string
}

export interface RecentActivity {
  id: string
  user: string
  action: string
  date: string
  status: 'completado' | 'pendiente' | 'error'
}

export const MOCK_ACTIVITY_DATA: ActivityData[] = [
  { name: 'Lun', posts: 40, interactions: 240 },
  { name: 'Mar', posts: 30, interactions: 198 },
  { name: 'Mie', posts: 20, interactions: 980 },
  { name: 'Jue', posts: 27, interactions: 390 },
  { name: 'Vie', posts: 18, interactions: 480 },
  { name: 'Sab', posts: 23, interactions: 380 },
  { name: 'Dom', posts: 34, interactions: 430 },
]

export const MOCK_KPI_STATS: KPIStats[] = [
  {
    title: 'Nuevos Usuarios',
    value: '1,284',
    trend: 12.5,
    isUp: true,
    icon: 'people',
    color: '#2D5A27',
  },
  {
    title: 'Total Posts',
    value: '43,201',
    trend: 8.2,
    isUp: true,
    icon: 'article',
    color: '#E0FF4F',
  },
  {
    title: 'Interacciones',
    value: '156.4k',
    trend: 2.4,
    isUp: false,
    icon: 'favorite',
    color: '#EA4335',
  },
  {
    title: 'Sesiones Activas',
    value: '852',
    trend: 45.1,
    isUp: true,
    icon: 'bolt',
    color: '#4285F4',
  },
]

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    user: 'Alex Rivera',
    action: 'Nuevo Post en #Nebula',
    date: 'Hace 2 min',
    status: 'completado',
  },
  {
    id: '2',
    user: 'Sofia Chen',
    action: 'Cambio de foto de perfil',
    date: 'Hace 15 min',
    status: 'pendiente',
  },
  {
    id: '3',
    user: 'Soporte Técnico',
    action: 'Backup de base de datos',
    date: 'Hace 1 hora',
    status: 'error',
  },
  {
    id: '4',
    user: 'Marcus Thorne',
    action: 'Conexión con Nodo: UX',
    date: 'Hace 2 horas',
    status: 'completado',
  },
  {
    id: '5',
    user: 'Elena Smith',
    action: 'Nuevo Registro',
    date: 'Hace 3 horas',
    status: 'completado',
  },
]
