export interface UserProps {
  id: string
  username: string
  name: string
  email?: string
  avatar: string | null
  bio: string | null
  verified: boolean
  active?: boolean
  role?: string
  followersCount: number
  followingCount: number
  postsCount?: number
  visitsReceived?: number
  totalXP?: number
  currentLevel?: number
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserInput {
  email?: string
  username?: string
  name?: string
  avatar?: string | null
  bio?: string | null
}

export class User {
  private readonly _id: string
  private readonly _username: string
  private readonly _email: string | null
  private readonly _name: string
  private readonly _avatar: string | null
  private readonly _bio: string | null
  private readonly _verified: boolean
  private readonly _role: string
  private readonly _active: boolean
  private _followersCount: number
  private _followingCount: number
  private _postsCount: number
  private readonly _visitsReceived: number
  private readonly _totalXP: number
  private readonly _currentLevel: number
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(props: UserProps) {
    this._id = props.id
    this._username = props.username
    this._email = props.email ?? null
    this._name = props.name
    this._avatar = props.avatar
    this._bio = props.bio
    this._verified = props.verified
    this._role = props.role ?? 'USER'
    this._active = props.active ?? true
    this._followersCount = props.followersCount
    this._followingCount = props.followingCount
    this._postsCount = props.postsCount ?? 0
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
    this._visitsReceived = props.visitsReceived ?? 0
    this._totalXP = props.totalXP ?? 0
    this._currentLevel = props.currentLevel ?? 1
  }

  public static reconstitute(props: UserProps): User {
    return new User(props)
  }

  public incrementFollowers(): void {
    this._followersCount++
    this._updatedAt = new Date()
  }

  public decrementFollowers(): void {
    if (this._followersCount > 0) {
      this._followersCount--
      this._updatedAt = new Date()
    }
  }

  public incrementFollowing(): void {
    this._followingCount++
    this._updatedAt = new Date()
  }

  public decrementFollowing(): void {
    if (this._followingCount > 0) {
      this._followingCount--
      this._updatedAt = new Date()
    }
  }

  // Getters
  get id(): string {
    return this._id
  }
  get username(): string {
    return this._username
  }
  get name(): string {
    return this._name
  }
  get avatar(): string | null {
    return this._avatar
  }
  get bio(): string | null {
    return this._bio
  }
  get verified(): boolean {
    return this._verified
  }
  get email(): string | null {
    return this._email
  }
  get role(): string {
    return this._role
  }
  get followersCount(): number {
    return this._followersCount
  }
  get followingCount(): number {
    return this._followingCount
  }
  get postsCount(): number {
    return this._postsCount
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
  get active(): boolean {
    return this._active
  }
  get visitsReceived(): number {
    return this._visitsReceived
  }
  get totalXP(): number {
    return this._totalXP
  }
  get currentLevel(): number {
    return this._currentLevel
  }
}
