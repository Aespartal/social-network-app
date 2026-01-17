/**
 * Session Guard - Protección contra pérdida de sesión
 *
 * Este módulo previene la pérdida de datos de sesión debido a errores
 * temporales de red o CORS durante el ciclo de vida de la aplicación.
 */

interface SessionData {
  access_token: string
  refresh_token: string
  user_data: string
}

const SESSION_BACKUP_KEY = '__session_backup__'
const BACKUP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutos

/**
 * Crea un backup de la sesión actual en sessionStorage
 * (se borra al cerrar la pestaña)
 */
export function backupSession(): void {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  const userData = localStorage.getItem('user_data')

  if (accessToken && refreshToken && userData) {
    const backup: SessionData & { timestamp: number } = {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_data: userData,
      timestamp: Date.now(),
    }

    sessionStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(backup))
  }
}

/**
 * Restaura la sesión desde el backup si está disponible y no ha expirado
 */
export function restoreSession(): boolean {
  const backupStr = sessionStorage.getItem(SESSION_BACKUP_KEY)

  if (!backupStr) return false

  try {
    const backup = JSON.parse(backupStr) as SessionData & { timestamp: number }

    // Verificar que el backup no haya expirado
    if (Date.now() - backup.timestamp > BACKUP_EXPIRY_MS) {
      sessionStorage.removeItem(SESSION_BACKUP_KEY)
      return false
    }

    // Solo restaurar si localStorage está vacío (se perdió la sesión)
    const hasCurrentSession = localStorage.getItem('access_token')

    if (!hasCurrentSession) {
      localStorage.setItem('access_token', backup.access_token)
      localStorage.setItem('refresh_token', backup.refresh_token)
      localStorage.setItem('user_data', backup.user_data)

      console.log('✅ Session restored from backup')
      return true
    }
  } catch (error) {
    console.error('Error restoring session:', error)
    sessionStorage.removeItem(SESSION_BACKUP_KEY)
  }

  return false
}

/**
 * Limpia el backup de sesión
 */
export function clearSessionBackup(): void {
  sessionStorage.removeItem(SESSION_BACKUP_KEY)
}
