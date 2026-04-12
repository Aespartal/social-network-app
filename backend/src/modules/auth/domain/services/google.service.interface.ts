import { GoogleUserInfo } from '../entities/google-user.entity'

export interface GoogleService {
  fetchUserInfo(token: string): Promise<GoogleUserInfo>
}
