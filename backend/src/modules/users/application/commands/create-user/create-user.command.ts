export interface CreateUserCommand {
  email: string
  username: string
  name: string
  avatar?: string | null
  bio?: string | null
  role?: string
  password: string
}
