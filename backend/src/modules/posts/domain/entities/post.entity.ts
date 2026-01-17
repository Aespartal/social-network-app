import { PostError } from '../errors'

// Value Objects
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
  author: Pick<PostAuthor, 'username' | 'name' | 'avatar'>
}

// Domain Constants
export const MAX_POST_CONTENT_LENGTH = 2000
export const MAX_REPLY_CONTENT_LENGTH = 1000
const MIN_CONTENT_LENGTH = 1
const MAX_TAGS_COUNT = 10
const MAX_TAG_LENGTH = 50

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
}

// Props for creating new Post
export interface CreatePostProps {
  content: string
  image?: string
  authorId: string
  parentId?: string | null
  tags?: string[]
}

/**
 * Post - Domain Entity (Aggregate Root)
 *
 * Represents a post or reply in the social network.
 * Encapsulates business rules and protects invariants.
 */
export class Post {
  private readonly _id: string
  private _content: string
  private _image: string | null
  private readonly _authorId: string
  private readonly _parentId: string | null
  private _likesCount: number
  private _repliesCount: number
  private _bookmarksCount: number
  private readonly _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date | null
  private _tags: string[]

  // Optional relations (loaded by repository when needed)
  private _author?: PostAuthor
  private _parent?: PostParent | null

  private constructor(props: PostProps) {
    this._id = props.id
    this._content = props.content
    this._image = props.image
    this._authorId = props.authorId
    this._parentId = props.parentId
    this._likesCount = props.likesCount
    this._repliesCount = props.repliesCount
    this._bookmarksCount = props.bookmarksCount
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt ?? null
    this._tags = props.tags ?? []
    this._author = props.author
    this._parent = props.parent
  }

  /**
   * Factory Method - Creates a new Post for publishing
   * Validates business rules before creation
   */
  public static create(props: CreatePostProps): Post {
    if (!props.content.trim() && !props.image) {
      throw PostError.emptyContent()
    }

    const maxLength = props.parentId
      ? MAX_REPLY_CONTENT_LENGTH
      : MAX_POST_CONTENT_LENGTH

    if (props.content.length > maxLength) {
      throw PostError.tooLong(maxLength)
    }

    if (props.content.length < MIN_CONTENT_LENGTH) {
      throw PostError.tooShort(MIN_CONTENT_LENGTH)
    }

    if (props.tags && props.tags.length > MAX_TAGS_COUNT) {
      throw new Error(`Maximum ${MAX_TAGS_COUNT} tags allowed`)
    }

    if (props.tags) {
      props.tags.forEach(tag => {
        if (tag.length > MAX_TAG_LENGTH) {
          throw new Error(
            `Tag "${tag}" exceeds maximum length of ${MAX_TAG_LENGTH}`
          )
        }
      })
    }

    return new Post({
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
      tags: props.tags?.map(t => t.toLowerCase().trim()) ?? [],
    })
  }

  /**
   * Factory Method - Reconstructs Post from persistence
   * Used by repository when loading from database
   */
  public static reconstitute(props: PostProps): Post {
    return new Post(props)
  }

  // ========== Business Methods ==========

  /**
   * Updates the post content
   * Validates business rules
   */
  public updateContent(newContent: string): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    if (!newContent.trim()) {
      throw PostError.emptyContent()
    }

    const maxLength = this.isReply()
      ? MAX_REPLY_CONTENT_LENGTH
      : MAX_POST_CONTENT_LENGTH

    if (newContent.length > maxLength) {
      throw PostError.tooLong(maxLength)
    }

    this._content = newContent.trim()
    this._updatedAt = new Date()
  }

  /**
   * Updates the post image
   */
  public updateImage(newImage: string | null): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    this._image = newImage
    this._updatedAt = new Date()
  }

  /**
   * Marks the post as deleted (soft delete)
   */
  public markAsDeleted(): void {
    if (this.isDeleted()) {
      throw PostError.alreadyDeleted()
    }

    this._deletedAt = new Date()
    this._updatedAt = new Date()
  }

  /**
   * Increments the likes count
   * Note: The actual like relationship is managed externally
   */
  public incrementLikes(): void {
    this._likesCount++
  }

  /**
   * Decrements the likes count
   */
  public decrementLikes(): void {
    if (this._likesCount > 0) {
      this._likesCount--
    }
  }

  /**
   * Increments the replies count
   */
  public incrementReplies(): void {
    this._repliesCount++
  }

  /**
   * Decrements the replies count
   */
  public decrementReplies(): void {
    if (this._repliesCount > 0) {
      this._repliesCount--
    }
  }

  /**
   * Increments the bookmarks count
   */
  public incrementBookmarks(): void {
    this._bookmarksCount++
  }

  /**
   * Decrements the bookmarks count
   */
  public decrementBookmarks(): void {
    if (this._bookmarksCount > 0) {
      this._bookmarksCount--
    }
  }

  /**
   * Checks if the post belongs to a specific user
   */
  public belongsTo(userId: string): boolean {
    return this._authorId === userId
  }

  /**
   * Checks if this is a reply to another post
   */
  public isReply(): boolean {
    return this._parentId !== null
  }

  /**
   * Checks if the post has been deleted
   */
  public isDeleted(): boolean {
    return this._deletedAt !== null
  }

  /**
   * Checks if the post has media attached
   */
  public hasMedia(): boolean {
    return this._image !== null
  }

  /**
   * Sets author information (populated by repository)
   */
  public setAuthor(author: PostAuthor): void {
    this._author = author
  }

  /**
   * Sets parent information (populated by repository)
   */
  public setParent(parent: PostParent | null): void {
    this._parent = parent
  }

  /**
   * Sets the ID after persistence (used by repository)
   */
  public setId(id: string): void {
    if (this._id) {
      throw new Error('Cannot change ID of an existing post')
    }
    ;(this._id as any) = id
  }

  // ========== Getters (Read-only access to state) ==========

  get id(): string {
    return this._id
  }

  get content(): string {
    return this._content
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
    return [...this._tags] // Return copy to prevent external modification
  }
}
