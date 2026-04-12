export interface RecentSearch {
  id: string
  userId: string
  query: string
  createdAt: Date
}

export interface RecentSearchRepository {
  findByUserId(userId: string, limit?: number): Promise<RecentSearch[]>
  save(userId: string, query: string): Promise<RecentSearch>
  delete(id: string, userId: string): Promise<void>
  clearAll(userId: string): Promise<void>
}
