import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, ROUTES } from '@/constants'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de Respuesta
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error
    const originalRequest = config

    if (response?.status === 401 && !originalRequest._retry) {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw error
      }

      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const res = await axios.post(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken }
        )

        const authData = res.data.data
        const newAccessToken =
          authData?.tokens?.accessToken || authData?.accessToken
        const newRefreshToken =
          authData?.tokens?.refreshToken || authData?.refreshToken

        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken)

          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken)
          }

          isRefreshing = false
          onRefreshed(newAccessToken)

          return axiosInstance(originalRequest)
        } else {
          throw new Error('No token received from refresh')
        }
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []

        console.error('🔴 Token refresh failed:', refreshError)

        const isAuthError =
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401

        const isNetworkError =
          !axios.isAxiosError(refreshError) || !refreshError.response

        if (isNetworkError) {
          console.warn('Network error during refresh - keeping session alive')
          throw refreshError
        }

        if (isAuthError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')

          globalThis.location.href = `${ROUTES.LOGIN}?expired=true`
        }

        throw refreshError
      }
    }
    throw error
  }
)

export default axiosInstance
