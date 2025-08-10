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
  setFieldValue: (field: keyof T, value: any) => void
  setFieldError: (field: keyof T, error: string) => void
  resetForm: () => void
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => (e?: FormEvent) => Promise<void>
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
}: UseFormProps<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (formValues: T): Partial<Record<keyof T, string>> => {
    if (validate) {
      return validate(formValues)
    }
    return {}
  }

  const isValid = Object.keys(validateForm(values)).length === 0

  const handleChange =
    (field: keyof T) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
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

  const setFieldValue = (field: keyof T, value: any) => {
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

      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true
          return acc
        },
        {} as Partial<Record<keyof T, boolean>>
      )
      setTouched(allTouched)

      if (Object.keys(formErrors).length === 0) {
        try {
          await onSubmit(values)
        } catch (error) {
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
