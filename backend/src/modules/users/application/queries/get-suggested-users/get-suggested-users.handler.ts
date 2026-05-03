import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserResponseDTO } from '../../dto'
import { UserMapper } from '../../../infrastructure/mappers/user.mapper'
import { GetSuggestedUsersQuery } from './get-suggested-users.query'

@injectable()
export class GetSuggestedUsersHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async execute(query: GetSuggestedUsersQuery): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getSuggestedUsers(
      query.userId,
      query.limit
    )

    return users.map(UserMapper.toDTO)
  }
}
