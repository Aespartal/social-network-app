export interface GeoLocation {
  country: string | null
  city: string | null
}

/**
 * Fetches location data from IP address using ip-api.com
 * In a real production app, you'd use a local database (MaxMind)
 * or a more robust paid service.
 */
interface IpApiResponse {
  status: 'success' | 'fail'
  country?: string
  countryCode?: string
  city?: string
}

export async function getLocationFromIp(ip: string): Promise<GeoLocation> {
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
    console.error(`[GeoLocation] Error fetching for IP ${ip}:`, err)
  }

  return { country: null, city: null }
}
