import type {
  UserRepository,
  UserRepository as UR,
} from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import { UserResponseDTO } from '../dto'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

export class GetUserByUsernameUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    username: string,
    currentUserId?: string,
    includeRelations?: UR.IncludeOptions
  ): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByUsername(username, includeRelations)

    if (!user) {
      throw UserError.notFound(username)
    }

    const isOwner = currentUserId === user.id

    return UserMapper.toDTO(user, isOwner)
  }
}
