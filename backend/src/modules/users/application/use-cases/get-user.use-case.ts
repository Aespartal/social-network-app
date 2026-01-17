import type {
  UserRepository,
  UserRepository as UR,
} from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import { UserResponseDTO } from '../dto'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    includeRelations?: UR.IncludeOptions
  ): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id, includeRelations)

    if (!user) {
      throw UserError.notFound(id)
    }

    return UserMapper.toDTO(user)
  }
}
