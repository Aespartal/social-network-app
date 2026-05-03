import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient } from '@/generated/prisma'
import { AuraNode } from '../../domain/entities/aura-node.entity'
import { AuraNodeRepository } from '../../domain/repositories/aura-node.repository.interface'

@injectable()
export class PrismaAuraNodeRepository implements AuraNodeRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findById(id: string): Promise<AuraNode | null> {
    const node = await this.prisma.auraNode.findUnique({ where: { id } })
    return node ? this.mapToDomain(node) : null
  }

  async findBySlug(slug: string): Promise<AuraNode | null> {
    const node = await this.prisma.auraNode.findUnique({ where: { slug } })
    return node ? this.mapToDomain(node) : null
  }

  async findByTagId(tagId: string): Promise<AuraNode | null> {
    const node = await this.prisma.auraNode.findUnique({ where: { tagId } })
    return node ? this.mapToDomain(node) : null
  }

  async findTrending(limit: number): Promise<AuraNode[]> {
    const nodes = await this.prisma.auraNode.findMany({
      orderBy: [{ pulse: 'desc' }, { vibration: 'desc' }],
      take: limit,
    })
    return nodes.map(n => this.mapToDomain(n))
  }

  async save(node: AuraNode): Promise<void> {
    await this.prisma.auraNode.update({
      where: { id: node.id },
      data: {
        vibration: node.vibration,
        pulse: node.pulse,
        lastPulseAt: node.lastPulseAt,
        updatedAt: new Date(),
      },
    })
  }

  async create(data: Partial<AuraNode>): Promise<AuraNode> {
    const node = await this.prisma.auraNode.create({
      data: {
        slug: data.slug!,
        name: data.name!,
        description: data.description,
        icon: data.icon,
        color: data.color,
        tagId: data.tagId,
      },
    })
    return this.mapToDomain(node)
  }

  async incrementActivity(id: string, amount: number): Promise<void> {
    const node = await this.findById(id)
    if (node) {
      node.updateActivity(amount)
      await this.save(node)
    }
  }

  private mapToDomain(node: any): AuraNode {
    return new AuraNode({
      id: node.id,
      slug: node.slug,
      name: node.name,
      description: node.description,
      icon: node.icon,
      color: node.color,
      vibration: node.vibration,
      pulse: node.pulse,
      category: node.category,
      tagId: node.tagId,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      lastPulseAt: node.lastPulseAt,
    })
  }
}
