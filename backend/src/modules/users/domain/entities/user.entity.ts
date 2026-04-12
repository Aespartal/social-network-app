export interface UserProps {
  id: string
  username: string
  name: string
  avatar: string | null
  bio: string | null
  verified: boolean
  followersCount: number
  followingCount: number
  createdAt: Date
  updatedAt: Date
}

export class User {
  private readonly _id: string
  private readonly _username: string
  private _name: string
  private _avatar: string | null
  private _bio: string | null
  private _verified: boolean
  private _followersCount: number
  private _followingCount: number
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(props: UserProps) {
    this._id = props.id
    this._username = props.username
    this._name = props.name
    this._avatar = props.avatar
    this._bio = props.bio
    this._verified = props.verified
    this._followersCount = props.followersCount
    this._followingCount = props.followingCount
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
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
  get followersCount(): number {
    return this._followersCount
  }
  get followingCount(): number {
    return this._followingCount
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
}
