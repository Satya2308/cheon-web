export type CreateTeacherResponse = {
  message: string
}

export type ValidationErrorResponse = {
  name?: string[]
  code?: string[]
  phone?: string[]
  gender?: string[]
  dob?: string[]
  subject?: string[]
  profession1?: string[]
  profession2?: string[]
  krobkan?: string[]
  rank?: string[]
}
