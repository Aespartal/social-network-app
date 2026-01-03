import { useState, ChangeEvent, FormEvent } from 'react'

export interface UseFormProps<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export interface UseFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  handleChange: (
    field: keyof T
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (field: keyof T) => () => void
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: (field: keyof T, error: string) => void
  resetForm: () => void
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => (e?: FormEvent) => Promise<void>
}

export function useForm<T extends object>({
  initialValues,
  validate,
}: UseFormProps<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (formValues: T): Partial<Record<keyof T, string>> => {
    return validate ? validate(formValues) : {}
  }

  const isValid = Object.keys(validateForm(values)).length === 0

  const handleChange =
    (field: keyof T) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target
      setValues(prev => ({ ...prev, [field]: value }))

      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }

  const handleBlur = (field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))

    const fieldErrors = validateForm(values)
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  const handleSubmit =
    (onSubmit: (values: T) => void | Promise<void>) =>
    async (e?: FormEvent) => {
      e?.preventDefault()
      setIsSubmitting(true)

      const formErrors = validateForm(values)
      setErrors(formErrors)

      const allTouched = (Object.keys(values) as Array<keyof T>).reduce(
        (acc, key) => {
          acc[key] = true
          return acc
        },
        {} as Record<keyof T, boolean>
      )
      setTouched(allTouched)

      if (Object.keys(formErrors).length === 0) {
        try {
          await onSubmit(values)
        } catch (error: unknown) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    handleSubmit,
  }
}
