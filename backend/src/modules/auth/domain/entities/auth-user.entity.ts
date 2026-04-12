import { Email } from '../value-objects/email.vo'

export interface AuthUserProps {
  id: string
  email: string
  username: string
  name: string
  password: string | null
  googleId: string | null
  avatar: string | null
  bio: string | null
  verified: boolean
  active: boolean
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAuthUserProps {
  email: string
  username: string
  name: string
  passwordHash: string | null
  googleId?: string | null
  avatar?: string | null
  bio?: string | null
  role?: string
}

/**
 * AuthUser - Domain Entity (Aggregate Root)
 *
 * Represents a user in the authentication context.
 */
export class AuthUser {
  private readonly _id: string
  private _email: string
  private _username: string
  private _name: string
  private _password: string | null
  private _googleId: string | null
  private _avatar: string | null
  private _bio: string | null
  private _verified: boolean
  private _active: boolean
  private _role: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(props: AuthUserProps) {
    this._id = props.id
    this._email = props.email
    this._username = props.username
    this._name = props.name
    this._password = props.password
    this._googleId = props.googleId
    this._avatar = props.avatar
    this._bio = props.bio
    this._verified = props.verified
    this._active = props.active
    this._role = props.role
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  public static create(props: CreateAuthUserProps): AuthUser {
    // Validate email using Value Object
    Email.create(props.email)

    if (!props.username.trim()) {
      throw new Error('Username is required')
    }

    if (!props.name.trim()) {
      throw new Error('Name is required')
    }

    return new AuthUser({
      id: '', // Will be set by repository
      email: props.email.toLowerCase().trim(),
      username: props.username.trim(),
      name: props.name.trim(),
      password: props.passwordHash,
      googleId: props.googleId ?? null,
      avatar: props.avatar ?? null,
      bio: props.bio ?? null,
      verified: false,
      active: true,
      role: props.role ?? 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public static reconstitute(props: AuthUserProps): AuthUser {
    return new AuthUser(props)
  }

  // ========== Business Methods ==========

  public activate(): void {
    this._active = true
    this._updatedAt = new Date()
  }

  public deactivate(): void {
    this._active = false
    this._updatedAt = new Date()
  }

  public verify(): void {
    this._verified = true
    this._updatedAt = new Date()
  }

  public updateProfile(props: {
    name?: string
    avatar?: string | null
    bio?: string | null
  }): void {
    if (props.name) this._name = props.name
    if (props.avatar !== undefined) this._avatar = props.avatar
    if (props.bio !== undefined) this._bio = props.bio
    this._updatedAt = new Date()
  }

  public setId(id: string): void {
    if (this._id) {
      throw new Error('Cannot change ID of an existing user')
    }
    ;(this as unknown as { _id: string })._id = id
  }

  // ========== Getters ==========

  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get username(): string {
    return this._username
  }

  get name(): string {
    return this._name
  }

  get password(): string | null {
    return this._password
  }

  get googleId(): string | null {
    return this._googleId
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

  get active(): boolean {
    return this._active
  }

  get role(): string {
    return this._role
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}

// Keep inputs for backward compatibility during refactor if needed,
// but eventually they should move to DTOs or be replaced by Command interfaces.
export interface LoginInput {
  email: string
  password: string
}
