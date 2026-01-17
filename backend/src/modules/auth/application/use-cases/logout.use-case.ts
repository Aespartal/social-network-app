import type { AuthRepository } from '../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../domain/errors'

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(refreshToken: string, userId: string): Promise<void> {
    const session = await this.authRepository.findSession(refreshToken)

    if (!session) {
      throw AuthError.sessionNotFound()
    }

    if (session.userId !== userId) {
      await this.authRepository.deleteSession(refreshToken)
      throw AuthError.sessionNotFound()
    }

    await this.authRepository.deleteSession(refreshToken)
  }
}
