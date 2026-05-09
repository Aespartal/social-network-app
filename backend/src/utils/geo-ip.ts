import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { Logger } from '@/lib/logger/logger.interface'

export interface GeoLocation {
  country: string | null
  city: string | null
}

export interface GeoIpService {
  getLocation(ip: string): Promise<GeoLocation>
}

interface IpApiResponse {
  status: 'success' | 'fail'
  country?: string
  countryCode?: string
  city?: string
}

@injectable()
export class HttpGeoIpService implements GeoIpService {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  /**
   * Fetches location data from IP address using ip-api.com
   */
  async getLocation(ip: string): Promise<GeoLocation> {
    // Local IPs won't return anything useful
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.0.')) {
      return { country: 'Localhost', city: 'Dev Machine' }
    }

    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = (await response.json()) as IpApiResponse

      if (data && data.status === 'success') {
        return {
          country: data.countryCode || data.country || null,
          city: data.city || null,
        }
      }
    } catch (err) {
      this.logger.error(
        'Error al obtener geolocalización por IP',
        { ip },
        err as Error
      )
    }

    return { country: null, city: null }
  }
}
