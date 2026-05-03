export interface UpdateUserCommand {
  id: string
  input: {
    email?: string
    username?: string
    name?: string
    avatar?: string | null
    bio?: string | null
    password?: string
  }
  currentUserId: string
  currentUserRole: string
}
