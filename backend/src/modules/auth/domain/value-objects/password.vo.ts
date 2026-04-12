export class Password {
  private readonly _value: string
  private static readonly MIN_LENGTH = 8

  private constructor(value: string) {
    this._value = value
  }

  public static create(value: string): Password {
    if (!value || value.length < this.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${this.MIN_LENGTH} characters long`
      )
    }
    // You could add more complex rules here (regex for numbers, special chars, etc.)
    return new Password(value)
  }

  get value(): string {
    return this._value
  }
}
