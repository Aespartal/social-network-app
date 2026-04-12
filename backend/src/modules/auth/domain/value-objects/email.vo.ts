export class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(value: string): Email {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Invalid email format')
    }
    return new Email(value.toLowerCase().trim())
  }

  get value(): string {
    return this._value
  }

  public equals(other: Email): boolean {
    return this._value === other.value
  }
}
