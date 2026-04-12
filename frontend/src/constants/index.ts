// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  INITIAL_PAGE: 1,
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  PROFILE: (username: string) => `/profile/${username}`,
  POST_DETAIL: (id: string) => `/post/${id}`,
  SEARCH: '/search',
  EXPLORE: '/explore',
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE_LOGIN: '/auth/login/google',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  POSTS: {
    FEED: '/posts/feed',
    FOLLOWING: '/posts/following',
    CREATE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    BY_USER: (username: string) => `/posts/user/${username}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    BOOKMARK: (id: string) => `/posts/${id}/bookmark`,
    SEARCH: '/posts/search',
    RECENT_SEARCH: '/posts/search/recent',
    DELETE_RECENT_SEARCH: (id: string) => `/posts/search/recent/${id}`,
    CLEAR_RECENT_SEARCH: '/posts/search/recent',
    TRENDING: '/posts/trending',
  },
  PROFILE: {
    ME: '/profile',
    BY_USERNAME: (username: string) => `/profile/${username}`,
    VISIT: (id: string) => `/profile/visit/${id}`,
    MY_VISITS: '/profile/my-visits',
    SUGGESTIONS: '/profile/suggestions',
    UPDATE: (id: string) => `/profile/${id}`,
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: '/notifications/mark-read',
    MARK_SINGLE_READ: (id: string) => `/notifications/${id}/mark-read`,
  },
} as const

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  LOADING_DELAY: 250,
  TOAST_DURATION: 3000,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const

// Breakpoints (MUI)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION: 'Por favor, verifica los datos ingresados.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post publicado exitosamente',
  POST_DELETED: 'Post eliminado',
  PROFILE_UPDATED: 'Perfil actualizado',
  LOGIN_SUCCESS: 'Bienvenido de nuevo',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente',
} as const

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^\w{3,20}$/,
  PASSWORD: /^.{6,}$/,
} as const
