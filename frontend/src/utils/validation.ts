/**
 * Valida formato de email
 * @param email Email a validar
 * @returns true si es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida longitud de string
 * @param str String a validar
 * @param min Longitud mínima
 * @param max Longitud máxima
 * @returns true si cumple los límites
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  const length = str.trim().length
  return length >= min && length <= max
}

/**
 * Valida formato de username
 * @param username Username a validar
 * @returns true si es válido (alfanumérico, guiones bajos, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^\w{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Valida que una contraseña sea segura
 * @param password Contraseña a validar
 * @returns true si es segura (mín 8 chars, 1 mayúscula, 1 minúscula, 1 número)
 */
export function isStrongPassword(password: string): boolean {
  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)

  return minLength && hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Valida extensión de archivo
 * @param filename Nombre del archivo
 * @param allowedExtensions Extensiones permitidas
 * @returns true si la extensión está permitida
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? allowedExtensions.includes(extension) : false
}

/**
 * Valida tamaño de archivo
 * @param file Archivo a validar
 * @param maxSizeMB Tamaño máximo en MB
 * @returns true si no excede el tamaño
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Valida que un campo no esté vacío
 * @param value Valor a validar
 * @returns true si no está vacío
 */
export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

/**
 * Obtiene mensaje de error de validación para formularios
 * @param field Nombre del campo
 * @param type Tipo de validación que falló
 * @param extra Información adicional (ej: longitud mínima)
 * @returns Mensaje de error
 */
export function getValidationError(
  field: string,
  type:
    | 'required'
    | 'email'
    | 'minLength'
    | 'maxLength'
    | 'username'
    | 'password',
  extra?: number | string
): string {
  const errors = {
    required: `${field} es requerido`,
    email: 'Email inválido',
    minLength: `${field} debe tener al menos ${extra} caracteres`,
    maxLength: `${field} no puede exceder ${extra} caracteres`,
    username: 'Usuario debe ser alfanumérico y tener entre 3-20 caracteres',
    password:
      'Contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número',
  }

  return errors[type]
}
