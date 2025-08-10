import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  CreatePostRequest,
  FeedResponse,
  FeedRequest,
  Post,
  User,
  ApiResponse,
} from 'social-network-app-shared/types/social'

const API_BASE_URL = 'http://localhost:3001/api'

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
apiService.interceptors.request.use(
  config => {
    // Agregar token de autenticación
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
apiService.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      // Limpiar datos de autenticación si no autorizado
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<ApiResponse<LoginResponse>>(
      '/login',
      credentials
    )
    return response.data.data!
  },

  async register(userData: CreateUserRequest): Promise<LoginResponse> {
    const response = await apiService.post<ApiResponse<LoginResponse>>(
      '/register',
      userData
    )
    return response.data.data!
  },

  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/profile')
    return response.data.data!
  },

  async getUserByUsername(username: string): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>(
      `/users/${username}`
    )
    return response.data.data!
  },
}

// Posts API
export const postsAPI = {
  async createPost(postData: CreatePostRequest): Promise<Post> {
    const response = await apiService.post<ApiResponse<Post>>(
      '/posts',
      postData
    )
    return response.data.data!
  },

  async getFeed(params: FeedRequest = {}): Promise<FeedResponse> {
    const response = await apiService.get<ApiResponse<FeedResponse>>('/feed', {
      params,
    })
    return response.data.data!
  },

  async getPost(id: string): Promise<Post> {
    const response = await apiService.get<ApiResponse<Post>>(`/posts/${id}`)
    return response.data.data!
  },

  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    const response = await apiService.post<
      ApiResponse<{ isLiked: boolean; likeCount: number }>
    >(`/posts/${postId}/like`)
    return response.data.data!
  },

  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    const response = await apiService.post<
      ApiResponse<{ isBookmarked: boolean }>
    >(`/posts/${postId}/bookmark`)
    return response.data.data!
  },
}

export default apiService
