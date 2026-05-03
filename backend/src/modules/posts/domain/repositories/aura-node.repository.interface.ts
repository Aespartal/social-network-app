import { AuraNode } from '../entities/aura-node.entity'

export interface AuraNodeRepository {
  findById(id: string): Promise<AuraNode | null>
  findBySlug(slug: string): Promise<AuraNode | null>
  findByTagId(tagId: string): Promise<AuraNode | null>
  findTrending(limit: number): Promise<AuraNode[]>
  save(node: AuraNode): Promise<void>
  create(node: Partial<AuraNode>): Promise<AuraNode>
  incrementActivity(id: string, amount: number): Promise<void>
}
