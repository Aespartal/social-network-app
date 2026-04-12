import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../../domain/errors'
import { AuthResponseDTO } from '../../dto/auth-response.dto'
import { AuthMapper } from '../../../infrastructure/mappers/auth.mapper'
import type { GetMeQuery } from './get-me.query'
@injectable()
export class GetMeHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(query: GetMeQuery): Promise<AuthResponseDTO> {
    const { userId } = query

    const user = await this.authRepository.findById(userId)

    if (!user) {
      throw AuthError.tokenInvalid() // Or a more specific error
    }

    return AuthMapper.toResponseDTO(user)
  }
}
