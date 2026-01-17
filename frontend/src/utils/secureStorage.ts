/**
 * Secure Storage - Wrapper para almacenamiento encriptado
 *
 * Encripta datos sensibles antes de guardarlos en localStorage
 * usando Web Crypto API (AES-GCM)
 */

const ENCRYPTION_KEY_NAME = '__app_key__'

// Generar o recuperar clave de encriptación
async function getEncryptionKey(): Promise<CryptoKey> {
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME)

  if (storedKey) {
    const keyData = JSON.parse(storedKey)
    return crypto.subtle.importKey(
      'raw',
      new Uint8Array(keyData),
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
  }

  // Generar nueva clave (se pierde al cerrar pestaña = seguridad adicional)
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  const exportedKey = await crypto.subtle.exportKey('raw', key)
  sessionStorage.setItem(
    ENCRYPTION_KEY_NAME,
    JSON.stringify(Array.from(new Uint8Array(exportedKey)))
  )

  return key
}

// Encriptar dato
async function encrypt(data: string): Promise<string> {
  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedData = new TextEncoder().encode(data)

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  )

  // Combinar IV + datos encriptados
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encryptedData), iv.length)

  return btoa(String.fromCharCode(...combined))
}

// Desencriptar dato
async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey()
  const combined = new Uint8Array(
    atob(encryptedData)
      .split('')
      .map(c => c.charCodeAt(0))
  )

  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )

  return new TextDecoder().decode(decryptedData)
}

/**
 * Almacenamiento seguro con encriptación
 */
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await encrypt(value)
    localStorage.setItem(`secure_${key}`, encrypted)
  },

  async getItem(key: string): Promise<string | null> {
    const encrypted = localStorage.getItem(`secure_${key}`)
    if (!encrypted) return null

    try {
      return await decrypt(encrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`)
  },
}
