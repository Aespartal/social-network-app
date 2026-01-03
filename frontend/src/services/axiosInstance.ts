import axios from 'axios'

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
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
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
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        )

        const newToken = res.data.data?.token || res.data.data?.accessToken

        if (newToken) {
          localStorage.setItem('access_token', newToken)
          isRefreshing = false
          onRefreshed(newToken)

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')

        globalThis.location.href = '/login?expired=true'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
