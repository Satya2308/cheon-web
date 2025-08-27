export type Year = {
  id: string
  name: string
  classDuration: '1_hour' | '1_5_hour'
  isActive: boolean
  startDateKh: string
  startDateEng: string
}

export type ValidationErrorYear = {
  name?: string[]
  classDuration?: string[]
  isActive?: string[]
  startDateKh?: string[]
  startDateEng?: string[]
}

export type CreateYear = {
  message: string
}

export type UpdateYear = {
  message: string
}

export type DeleteYear = {
  message: string
}
