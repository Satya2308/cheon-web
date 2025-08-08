import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { authApi } from '~/utils/axios'
import { useEffect, useRef, useState } from 'react'
import { getFormDataFromObject, getUpdatedFormData } from '~/helpers/form'
import { toast } from '~/component'
import { Year } from '~/types/year'
import {
  Classroom,
  UpdateClassroom,
  ValidationErrorClassroom,
} from '~/types/classroom'
import TeacherCombobox from '~/component/teacherCombobox'
import { TeacherSearched } from '~/types/teacher'
import { validateUpdateClassroom } from '~/zod/classroom'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function UpdateClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { id, cid } = useParams()
  const [teachers, setTeachers] = useState<TeacherSearched[] | null>(null)
  const classroomForm = useRef<HTMLFormElement | null>(null)
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSearched | null>(null)
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<ValidationErrorClassroom | string | null>(
    null
  )
  const errorObj = error && typeof error === 'object' ? error : null
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) {
        setError('Classroom ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Classroom>(
          `/years/${year.id}/classrooms/${cid}`
        )
        setClassroom(res.data)
        setSelectedTeacher(res.data.teacher)
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
    fetchClassroom()
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
  }, [id])

  const handleSubmit = async (classroomData: Classroom) => {
    const form = classroomForm.current
    if (!form) return
    try {
      setSubmitting(true)
      setError(null)
      const currentFormData = new FormData(form)
      const originalFormData = getFormDataFromObject(classroomData)
      const updatedFormData = getUpdatedFormData(
        currentFormData,
        originalFormData
      )
      if (Array.from(updatedFormData.keys()).length === 0) return
      const { data, error: validationError } = await validateUpdateClassroom(
        updatedFormData
      )
      if (!data) {
        setError(validationError)
        return
      }
      const res = await authApi.patch<UpdateClassroom>(
        `/years/${id}/classrooms/${cid}`,
        data
      )
      if (res.data.message) navigate(`/admin/years/${id}/classrooms`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorClassroom)
        else if (status === 404) setError('Classroom not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to update teacher')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!classroom) return null
  if (teachers && teachers?.length <= 0) return navigate('/admin/teachers')

  return (
    <>
      {error && typeof error === 'string' && toast(error)}
      {teachers && teachers.length > 0 && (
        <dialog className="modal modal-open">
          <div className="modal-box p-0 ml-3 sm:ml-0 max-w-xl flex flex-col">
            <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
              <Link
                to={`/admin/years/${year.id}/classrooms`}
                className="btn btn-sm btn-ghost btn-square"
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
                <form className="w-full max-w-xl" ref={classroomForm}>
                  {error && typeof error === 'string' && (
                    <div className="alert alert-error mb-6">
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-6">
                    <fieldset className="fieldset" disabled={submitting}>
                      <legend className="fieldset-legend leading-relaxed text-base">
                        ឈ្មោះថ្នាក់
                      </legend>
                      <input
                        type="text"
                        className="input w-full"
                        name="name"
                        defaultValue={classroom.name}
                      />
                      {errorObj?.name && fieldError(errorObj.name[0])}
                    </fieldset>
                    <fieldset className="fieldset w-2/3" disabled={submitting}>
                      <legend className="fieldset-legend leading-relaxed text-base">
                        គ្រូបន្ទុកថ្នាក់
                      </legend>
                      <TeacherCombobox
                        value={selectedTeacher}
                        onChange={setSelectedTeacher}
                        placeholder="ស្វែងរកតាមឈ្មោះ"
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
                  </div>
                  <div className="mt-10 flex gap-2">
                    <button
                      className="btn btn-primary flex-1"
                      type="button"
                      onClick={() => handleSubmit(classroom)}
                    >
                      កែតម្រូវ
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
