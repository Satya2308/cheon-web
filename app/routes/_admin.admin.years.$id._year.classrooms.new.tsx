import { Link, redirect, useNavigate, useOutletContext } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from '~/component'
import TeacherCombobox from '~/component/teacherCombobox'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { CreateClassroom, ValidationErrorClassroom } from '~/types/classroom'
import { TeacherSearched } from '~/types/teacher'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'
import { validateCreateClassroom } from '~/zod/classroom'

export const handle = {
  title: 'ឆ្នាំ',
  backable: '/admin/years',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function CreateClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [teachers, setTeachers] = useState<TeacherSearched[] | null>(null)
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSearched | null>(null)
  const [error, setError] = useState<ValidationErrorClassroom | string | null>(
    null
  )
  const errorObj = error && typeof error === 'object' ? error : null

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const { data, error: validationError } = await validateCreateClassroom(
      formData
    )
    if (!data) {
      setError(validationError)
      return
    }
    try {
      setSubmitting(true)
      setError(null)
      const res = await authApi.post<CreateClassroom>(
        `/years/${year.id}/classrooms`,
        data
      )
      if (res.status === 201) navigate(`/admin/years/${year.id}/classrooms`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorClassroom)
        else if (status === 404) setError('Service not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to create classroom')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  if (teachers && teachers?.length <= 0) return navigate('/admin/teachers')

  return (
    <>
      {error && typeof error === 'string' && toast(error)}
      {teachers && teachers.length > 0 && (
        <dialog className="modal modal-open">
          <div className="modal-box p-0 ml-3 sm:ml-0 max-w-2xl flex flex-col">
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
                <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                  <div className="grid grid-cols-1 gap-6">
                    <fieldset className="fieldset" disabled={submitting}>
                      <legend className="fieldset-legend leading-relaxed text-base">
                        ឈ្មោះថ្នាក់
                      </legend>
                      <input type="text" className="input w-full" name="name" />
                      {errorObj?.name && fieldError(errorObj.name[0])}
                    </fieldset>
                    <fieldset className="fieldset w-2/3">
                      <legend className="fieldset-legend leading-relaxed text-base">
                        គ្រូបន្ទុកថ្នាក់
                      </legend>
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
                      {errorObj?.leadTeacherId &&
                        fieldError(errorObj.leadTeacherId[0])}
                    </fieldset>

                    <input type="hidden" name="yearId" value={year.id} />
                  </div>
                  <div className="mt-10 flex gap-2">
                    <button className="btn btn-primary flex-1" type="submit">
                      បង្កើត
                    </button>
                    <Link
                      className="btn btn-ghost w-32"
                      to={`/admin/years/${year.id}/classrooms`}
                      type="button"
                    >
                      ចេញ
                    </Link>
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
