import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors'
import { UserResponseDTO } from '../../dto'
import { UserMapper } from '../../../infrastructure/mappers/user.mapper'
import { GetMeQuery } from './get-me.query'

@injectable()
export class GetUserMeHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async execute(query: GetMeQuery): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(query.userId)

    if (!user) {
      throw UserError.notFound(query.userId)
    }

    return UserMapper.toDTO(user)
  }
}
