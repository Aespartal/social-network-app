export class PostTag {
  private readonly _value: string
  public static readonly MAX_LENGTH = 50
  public static readonly MAX_COUNT = 10

  private constructor(value: string) {
    this._value = value
  }

  public static create(value: string): PostTag {
    const cleaned = value.trim().toLowerCase()

    if (!cleaned) {
      throw new Error('Tag name cannot be empty')
    }

    if (cleaned.length > this.MAX_LENGTH) {
      throw new Error(
        `Tag "${cleaned}" exceeds maximum length of ${this.MAX_LENGTH}`
      )
    }

    // Optional: add regex for valid tag characters if needed

    return new PostTag(cleaned)
  }

  get value(): string {
    return this._value
  }

  public equals(other: PostTag): boolean {
    return this._value === other.value
  }
}
