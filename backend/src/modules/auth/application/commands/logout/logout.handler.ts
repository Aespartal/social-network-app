import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import type { LogoutCommand } from './logout.command'

/**
 * LogoutCommandHandler - CQRS Command Handler
 */
@injectable()
export class LogoutCommandHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshToken } = command

    if (refreshToken) {
      await this.authRepository.deleteSession(refreshToken)
    }
  }
}
