import { injectable } from 'inversify'
import bcrypt from 'bcryptjs'
import { HashService } from '../../domain/services/hash.service.interface'

@injectable()
export class BcryptHashService implements HashService {
  private readonly SALT_ROUNDS = 10

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.SALT_ROUNDS)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }
}
