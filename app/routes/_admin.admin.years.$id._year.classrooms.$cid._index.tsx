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

export default function ClassroomDetailPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { id, cid } = useParams()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [timeslots, setTimeslots] = useState<Timeslot[] | null>(null)
  const [teachers, setTeachers] = useState<TeacherSearched[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [assigningTimeslot, setAssigningTimeslot] = useState<number | null>(
    null
  )
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
          authApi.get<Timeslot[]>(
            `/years/${year.id}/classrooms/${cid}/timeslots`
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
    teacher: TeacherSearched | null
  ) => {
    try {
      setAssigningTimeslot(timeslotId)
      const data = {
        timeslotId,
        classroomId: parseInt(cid!),
        teacherId: teacher?.id || null,
        action: teacher ? 'ASSIGN' : 'REMOVE',
      }
      await authApi.post(
        `/years/${year.id}/classrooms/${cid}/assign-teacher`,
        data
      )
      setTimeslots(
        (prev) =>
          prev?.map((ts) =>
            ts.id === timeslotId
              ? {
                  ...ts,
                  teacher: teacher
                    ? { id: teacher.id, name: teacher.name }
                    : null,
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
      setAssigningTimeslot(null)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] flex flex-col p-0">
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
                          {classroom.teacher?.name
                            ? classroom.teacher.name
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
                    <div className="grid gap-10">
                      {timeslots.map((timeslot) => {
                        const isSubmitting = assigningTimeslot === timeslot.id
                        return (
                          <div
                            key={timeslot.id}
                            className="flex items-center gap-4 p-4 border-t rounded-lg"
                          >
                            <div className="w-24 text-center">
                              <span className="font-medium text-lg">
                                {timeslot.label}
                              </span>
                            </div>
                            <div className="flex-1">
                              <TeacherCombobox
                                value={timeslot.teacher}
                                onChange={(teacher) =>
                                  handleTeacherAssignment(timeslot.id, teacher)
                                }
                                placeholder="ស្វែងរកគ្រូបង្រៀន"
                                initialTeachers={teachers}
                              />
                            </div>
                            {isSubmitting && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="loading loading-spinner loading-sm"></span>
                                កំពុងរក្សាទុក...
                              </div>
                            )}
                          </div>
                        )
                      })}
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
