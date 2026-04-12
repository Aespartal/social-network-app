import { PostError } from '../errors'

export class PostContent {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(value: string, isReply: boolean = false): PostContent {
    const trimmed = value.trim()

    // We only check empty if image is also null, but VO doesn't know about image.
    // So we'll let the Entity handle the "content OR image" rule,
    // and VO handle "IF there is content, it must be valid".

    if (trimmed.length === 0) {
      return new PostContent('')
    }

    const maxLength = isReply ? 1000 : 2000 // Moving constants or referencing them
    const minLength = 1

    if (trimmed.length > maxLength) {
      throw PostError.tooLong(maxLength)
    }

    if (trimmed.length < minLength) {
      throw PostError.tooShort(minLength)
    }

    return new PostContent(trimmed)
  }

  get value(): string {
    return this._value
  }

  get length(): number {
    return this._value.length
  }

  public isEmpty(): boolean {
    return this._value.length === 0
  }

  public extractHashtags(): string[] {
    const hashtags = this._value.match(/#(\w+)/g)
    return hashtags ? hashtags.map(h => h.slice(1)) : []
  }

  public extractMentions(): string[] {
    const mentions = this._value.match(/@(\w+)/g)
    return mentions ? mentions.map(m => m.slice(1)) : []
  }
}
