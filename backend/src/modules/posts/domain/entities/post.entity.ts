import { PostError } from '../errors'
import { PostContent, PostTag } from '../value-objects'

// Value Objects (Interfaces for relations)
export interface PostAuthor {
  id: string
  username: string
  name: string
  avatar: string | null
  verified: boolean
}

export interface PostParent {
  id: string
  content: string
  createdAt: Date
  author: Pick<PostAuthor, 'id' | 'username' | 'name' | 'avatar'>
}

// Domain Constants (Now partially moved to VOs, but kept here for reference if needed)
export const MAX_POST_CONTENT_LENGTH = 2000
export const MAX_REPLY_CONTENT_LENGTH = 1000

// Props for Post reconstruction (from infrastructure)
export interface PostProps {
  id: string
  content: string
  image: string | null
  authorId: string
  author?: PostAuthor
  parentId: string | null
  parent?: PostParent | null
  likesCount: number
  repliesCount: number
  bookmarksCount: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  tags?: string[]
  mentions?: string[]
  country?: string | null
  city?: string | null
}

// Props for creating new Post
export interface CreatePostProps {
  content: string
  image?: string
  authorId: string
  parentId?: string | null
  tags?: string[]
  country?: string | null
  city?: string | null
}

/**
 * Post - Domain Entity (Aggregate Root)
 *
 * Represents a post or reply in the social network.
 * Encapsulates business rules and protects invariants.
 */
export class Post {
  private readonly _id: string
  private _content: PostContent
  private _image: string | null
  private readonly _authorId: string
  private readonly _parentId: string | null
  private _likesCount: number
  private _repliesCount: number
  private _bookmarksCount: number
  private readonly _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date | null
  private _tags: PostTag[]
  private _mentions: string[]
  private _country: string | null
  private _city: string | null

  // Optional relations (loaded by repository when needed)
  private _author?: PostAuthor
  private _parent?: PostParent | null

  private constructor(props: PostProps) {
    this._id = props.id
    this._content = PostContent.create(props.content, props.parentId !== null)
    this._image = props.image
    this._authorId = props.authorId
    this._parentId = props.parentId
    this._likesCount = props.likesCount
    this._repliesCount = props.repliesCount
    this._bookmarksCount = props.bookmarksCount
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt ?? null
    this._tags = props.tags?.map(t => PostTag.create(t)) ?? []
    this._mentions = props.mentions ?? []
    this._country = props.country ?? null
    this._city = props.city ?? null
    this._author = props.author
    this._parent = props.parent
  }

  /**
   * Factory Method - Creates a new Post for publishing
   * Validates business rules before creation
   */
  public static create(props: CreatePostProps): Post {
    const isReply = !!props.parentId

    // Validate content OR image rule
    if (!props.content.trim() && !props.image) {
      throw PostError.emptyContent()
    }

    // VO handles length validation
    PostContent.create(props.content, isReply)

    if (props.tags && props.tags.length > PostTag.MAX_COUNT) {
      throw new Error(`Maximum ${PostTag.MAX_COUNT} tags allowed`)
    }

    // Validate tags via VO
    props.tags?.forEach(tag => PostTag.create(tag))

    const post = new Post({
      id: '',
      content: props.content.trim(),
      image: props.image ?? null,
      authorId: props.authorId,
      parentId: props.parentId ?? null,
      likesCount: 0,
      repliesCount: 0,
      bookmarksCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      tags: props.tags ?? [],
      mentions: [], // Will be added by application service after resolving usernames
      country: props.country,
      city: props.city,
    })

    // Auto-extract tags if content exists
    const extractedTags = post._content.extractHashtags()
    if (extractedTags.length > 0) {
      const currentTags = post.tags
      extractedTags.forEach(tag => {
        if (!currentTags.includes(tag.toLowerCase())) {
          post._tags.push(PostTag.create(tag))
        }
      })
    }

    return post
  }

  /**
   * Factory Method - Reconstructs Post from persistence
   */
  public static reconstitute(props: PostProps): Post {
    return new Post(props)
  }

  // ========== Business Methods ==========

  public updateContent(newContent: string): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    // VO handles the validation logic
    this._content = PostContent.create(newContent, this.isReply())
    this._updatedAt = new Date()
  }

  public updateImage(newImage: string | null): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    this._image = newImage
    this._updatedAt = new Date()
  }

  public markAsDeleted(): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    this._deletedAt = new Date()
    this._updatedAt = new Date()
  }

  public incrementLikes(): void {
    this._likesCount++
  }

  public decrementLikes(): void {
    if (this._likesCount > 0) {
      this._likesCount--
    }
  }

  public incrementReplies(): void {
    this._repliesCount++
  }

  public decrementReplies(): void {
    if (this._repliesCount > 0) {
      this._repliesCount--
    }
  }

  public incrementBookmarks(): void {
    this._bookmarksCount++
  }

  public decrementBookmarks(): void {
    if (this._bookmarksCount > 0) {
      this._bookmarksCount--
    }
  }

  public belongsTo(userId: string): boolean {
    return this._authorId === userId
  }

  public isReply(): boolean {
    return this._parentId !== null
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null
  }

  public hasMedia(): boolean {
    return this._image !== null
  }

  public setAuthor(author: PostAuthor): void {
    this._author = author
  }

  public setParent(parent: PostParent | null): void {
    this._parent = parent
  }

  public setId(id: string): void {
    if (this._id) {
      throw new Error('Cannot change ID of an existing post')
    }
    ;(this as unknown as { _id: string })._id = id
  }

  // ========== Getters ==========

  get id(): string {
    return this._id
  }

  get content(): string {
    return this._content.value
  }

  get image(): string | null {
    return this._image
  }

  get authorId(): string {
    return this._authorId
  }

  get author(): PostAuthor | undefined {
    return this._author
  }

  get parentId(): string | null {
    return this._parentId
  }

  get parent(): PostParent | null | undefined {
    return this._parent
  }

  get likesCount(): number {
    return this._likesCount
  }

  get repliesCount(): number {
    return this._repliesCount
  }

  get bookmarksCount(): number {
    return this._bookmarksCount
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get deletedAt(): Date | null {
    return this._deletedAt
  }

  get tags(): string[] {
    return this._tags.map(t => t.value)
  }

  get mentions(): string[] {
    return this._mentions
  }

  get country(): string | null {
    return this._country
  }

  get city(): string | null {
    return this._city
  }

  public setMentions(userIds: string[]): void {
    this._mentions = userIds
  }

  public extractMentionedUsernames(): string[] {
    return this._content.extractMentions()
  }
}
