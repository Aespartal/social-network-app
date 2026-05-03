export interface ProfileVisit {
  visitorId: string
  visitedId: string
  createdAt: Date
  visitor?: {
    id: string
    username: string
    name: string
    avatar: string | null
  }
}
