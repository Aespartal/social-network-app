export interface GetUserByUsernameQuery {
  username: string
  active?: boolean // Optional filter to include only active users
}
