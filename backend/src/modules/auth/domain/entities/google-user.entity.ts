export interface GoogleUserPayload {
  sub: string
  email: string
  name?: string
  picture?: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
  locale?: string
}

export interface GoogleUserInfo {
  sub: string
  googleId: string
  email: string
  name?: string
  avatar?: string
  emailVerified?: boolean
}
