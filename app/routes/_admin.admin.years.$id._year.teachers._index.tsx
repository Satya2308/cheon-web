import { Link, useOutletContext } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { ExpTeacherScheduleBtn, toast } from '~/component'
import TeacherCombobox from '~/component/teacherCombobox'
import { X } from '~/icons'
import { TeacherSearched } from '~/types/teacher'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export default function ExportTeacher() {
  const { year } = useOutletContext<{ year: Year }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSearched | null>(null)
  const [teachers, setTeachers] = useState<TeacherSearched[] | null>(null)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<TeacherSearched[]>(
          '/teachers/firstTwenty'
        )
        setTeachers(res.data)
      } catch (err) {
        setError('Failed to load teachers. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  return (
    <>
      {error && typeof error === 'string' && toast(error)}
      {teachers && teachers.length > 0 && (
        <dialog className="modal modal-open">
          <div className="modal-box p-0 ml-3 sm:ml-0 max-w-xl flex flex-col">
            <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
              <Link
                to={`/admin/years/${year.id}/classrooms`}
                className="btn btn-sm btn-square btn-ghost"
              >
                <X size={20} />
              </Link>
            </div>
            <main className="px-8 pb-10 flex-1">
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
              <div className="pt-6 flex items-center justify-center">
                <form className="w-full max-w-2xl">
                  <div>
                    <TeacherCombobox
                      value={selectedTeacher}
                      onChange={setSelectedTeacher}
                      placeholder="ស្វែងរកតាមលេខកូដ"
                      initialTeachers={teachers}
                    />
                    <input
                      type="hidden"
                      name="leadTeacherId"
                      value={selectedTeacher?.id || ''}
                    />

                    <input type="hidden" name="yearId" value={year.id} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <ExpTeacherScheduleBtn
                      teacherId={selectedTeacher?.id}
                      disable={selectedTeacher ? false : true}
                      teacherName={selectedTeacher?.name}
                      yearId={parseInt(year.id)}
                      yearName={year.name}
                    />
                  </div>
                </form>
              </div>
            </main>
          </div>
        </dialog>
      )}
    </>
  )
}
