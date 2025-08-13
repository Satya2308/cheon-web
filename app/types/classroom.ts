export type Classroom = {
  id: number
  name: string
  teacher: {
    id: number
    name: string
  } | null
}

export type DetailClassroom = {
  id: number
  name: string
  teacher: {
    id: number
    name: string
  } | null
}

export type ValidationErrorClassroom = {
  name?: string[]
  yearId?: string[]
  leadTeacherId?: string[]
}

export type CreateClassroom = {
  message: string
}

export type UpdateClassroom = {
  message: string
}

export type DeleteClassroom = {
  message: string
}

export type Timeslot = {
  id: number
  label: string
  duration: string
  sortOrder: number
}
