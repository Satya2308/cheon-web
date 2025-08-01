export type Classroom = {
  id: number
  name: string
  teacher: {
    name: string
  }
  assignedTimeslots: number
  totalTimeslots: number
}
