import { useOutletContext, useParams } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { Classroom, Timeslot } from '~/types/classroom'
import { Year } from '~/types/year'
import { TeacherSearched } from '~/types/teacher'
import TeacherCombobox from '~/component/teacherCombobox'
import { useEffect, useState } from 'react'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

const DAYS = [
  { key: 'monday', label: 'ចន្ទ' },
  { key: 'tuesday', label: 'អង្គារ' },
  { key: 'wednesday', label: 'ពុធ' },
  { key: 'thursday', label: 'ព្រហស្បតិ៍' },
  { key: 'friday', label: 'សុក្រ' },
  { key: 'saturday', label: 'សៅរ៍' },
] as const

interface TimeslotWithAssignments extends Timeslot {
  assignments: {
    [key in typeof DAYS[number]['key']]: {
      teacher: { id: number; code: string } | null
    }
  }
}

export default function ClassroomDetailPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { id, cid } = useParams()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [timeslots, setTimeslots] = useState<TimeslotWithAssignments[] | null>(null)
  const [teachers, setTeachers] = useState<TeacherSearched[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [assigningCell, setAssigningCell] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !cid) {
        setError('Classroom ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const [classroomRes, timeslotsRes, teachersRes] = await Promise.all([
          authApi.get<Classroom>(`/years/${year.id}/classrooms/${cid}`),
          authApi.get<TimeslotWithAssignments[]>(
            `/years/${year.id}/classrooms/${cid}/timetable`
          ),
          authApi.get<TeacherSearched[]>('/teachers/firstTwenty'),
        ])

        setClassroom(classroomRes.data)
        setTimeslots(timeslotsRes.data)
        setTeachers(teachersRes.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Classroom not found')
          else if (status === 500) setError('Server error occurred')
          else setError('Failed to load classroom data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, cid, year.id])

  const handleTeacherAssignment = async (
    timeslotId: number,
    day: typeof DAYS[number]['key'],
    teacher: TeacherSearched | null
  ) => {
    const cellKey = `${timeslotId}-${day}`
    try {
      setAssigningCell(cellKey)
      const data = {
        timeslotId,
        day,
        classroomId: parseInt(cid!),
        teacherId: teacher?.id || null,
        action: teacher ? 'ASSIGN' : 'REMOVE',
      }
      await authApi.post(
        `/years/${year.id}/classrooms/${cid}/assign-teacher`,
        data
      )
      
      // Update local state
      setTimeslots(
        (prev) =>
          prev?.map((ts) =>
            ts.id === timeslotId
              ? {
                  ...ts,
                  assignments: {
                    ...ts.assignments,
                    [day]: {
                      teacher: teacher
                        ? { id: teacher.id, code: teacher.code }
                        : null,
                    },
                  },
                }
              : ts
          ) || null
      )
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 404) setError('404 something went wrong')
        else if (status === 500) setError('Server error occurred')
        else setError('Something went wrong')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setAssigningCell(null)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-[1400px] max-h-[90vh] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 pb-0">
          <Forehead
            title="ថ្នាក់រៀន"
            backref={`/admin/years/${year.id}/classrooms`}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}
          {classroom && (
            <div className="space-y-6">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">ព័ត៌មានថ្នាក់រៀន</h3>
                  <table className="table">
                    <tbody className="text-base">
                      <tr>
                        <td width="240">ថ្នាក់</td>
                        <td>{classroom.name}</td>
                      </tr>
                      <tr>
                        <td>គ្រូបន្ទុកថ្នាក់</td>
                        <td>
                          {classroom.teacher?.code
                            ? classroom.teacher.code
                            : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {timeslots && timeslots.length > 0 && teachers && (
                <div className="card bg-base-100">
                  <div className="card-body">
                    <h3 className="card-title text-lg mb-4">កាលវិភាគបង្រៀន</h3>
                    <div className="overflow-x-auto">
                      <table className="table table-bordered w-full">
                        <thead>
                          <tr>
                            <th className="w-32 text-center bg-base-200">ម៉ោងរៀន</th>
                            {DAYS.map((day) => (
                              <th key={day.key} className="text-center bg-base-200 min-w-48">
                                {day.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {timeslots.map((timeslot) => (
                            <tr key={timeslot.id}>
                              <td className="text-center font-medium bg-base-200 align-top py-4">
                                {timeslot.label}
                              </td>
                              {DAYS.map((day) => {
                                const cellKey = `${timeslot.id}-${day.key}`
                                const isSubmitting = assigningCell === cellKey
                                const assignment = timeslot.assignments[day.key]
                                
                                return (
                                  <td key={day.key} className="p-2 align-top">
                                    <div className="flex flex-col gap-2">
                                      <TeacherCombobox
                                        value={assignment?.teacher || null}
                                        onChange={(teacher) =>
                                          handleTeacherAssignment(timeslot.id, day.key, teacher)
                                        }
                                        placeholder="ជ្រើសរើសគ្រូ"
                                        initialTeachers={teachers}
                                      />
                                      {isSubmitting && (
                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                          <span className="loading loading-spinner loading-xs"></span>
                                          <span>កំពុងរក្សាទុក...</span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Show message if no timeslots */}
              {timeslots && timeslots.length === 0 && (
                <div className="alert alert-info">
                  <span>មិនមានកាលវិភាគសម្រាប់ថ្នាក់នេះទេ</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}