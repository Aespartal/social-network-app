export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    name: string
    avatar: string | null
    verified: boolean
  }
  tokens: AuthTokens
}
