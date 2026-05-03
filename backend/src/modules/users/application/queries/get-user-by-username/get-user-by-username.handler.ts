import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors'
import { UserResponseDTO } from '../../dto'
import { UserMapper } from '../../../infrastructure/mappers/user.mapper'
import { GetUserByUsernameQuery } from './get-user-by-username.query'

@injectable()
export class GetUserByUsernameHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async execute(query: GetUserByUsernameQuery): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByUsername(query.username, {
      includeFollowers: true,
      includeFollowing: true,
    })

    if (!user) {
      throw UserError.notFound(query.username)
    }

    return UserMapper.toDTO(user)
  }
}
