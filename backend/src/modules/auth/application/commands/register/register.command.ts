/**
 * RegisterCommand - CQRS Command
 *
 * Represents the intent to register a new user.
 */
export interface RegisterCommand {
  email: string
  username: string
  name: string
  password: string
  avatar?: string | null
  bio?: string | null
}
