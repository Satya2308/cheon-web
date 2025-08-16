export type Teacher = {
  id: string
  name: string
  code: string
  gender: 'MALE' | 'FEMALE' | null
  dob: string | null
  subject: string | null
  profession1: string | null
  profession2: string | null
  krobkan: string | null
  rank: string | null
  phone: string
}

export type TeacherSearched = {
  id: number
  name: string
  code: string
}

export type ValidationErrorTeacher = {
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

export type CreateTeacher = {
  message: string
}

export type UpdateTeacher = {
  message: string
}

export type DeleteTeacher = {
  message: string
}
