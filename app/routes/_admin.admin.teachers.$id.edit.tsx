import { Link, useNavigate, useParams } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { authApi } from '~/utils/axios'
import { validateUpdateTeacher } from '~/zod/teacher'
import { getFormDataFromObject, getUpdatedFormData } from '~/helpers/form'
import { Teacher, UpdateTeacher, ValidationErrorTeacher } from '~/types/teacher'

export const handle = {
  title: 'គ្រូ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export default function UpdateTeacherPage() {
  const { id } = useParams()
  const teacherForm = useRef<HTMLFormElement | null>(null)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<ValidationErrorTeacher | string | null>(
    null
  )
  const errorObj = error && typeof error === 'object' ? error : null
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) {
        setError('Teacher ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Teacher>(`/teachers/${id}`)
        setTeacher(res.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Teacher not found')
          else if (status === 500) setError('Server error occurred')
          else setError('Failed to load teacher data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTeacher()
  }, [id])

  const handleSubmit = async (teacherData: Teacher) => {
    const form = teacherForm.current
    if (!form) return
    try {
      setSubmitting(true)
      setError(null)
      const currentFormData = new FormData(form)
      const originalFormData = getFormDataFromObject(teacherData)
      const updatedFormData = getUpdatedFormData(
        currentFormData,
        originalFormData
      )
      if (Array.from(updatedFormData.keys()).length === 0) return
      const { data, error: validationError } = await validateUpdateTeacher(
        updatedFormData
      )
      if (!data) {
        setError(validationError)
        return
      }
      const res = await authApi.patch<UpdateTeacher>(`/teachers/${id}`, data)
      if (res.data.message) navigate('/admin/teachers')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorTeacher)
        else if (status === 404) setError('Teacher not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to update teacher')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!teacher) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link
            to="/admin/teachers"
            className="btn btn-sm btn-ghost btn-square"
          >
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          <div className="pt-6 flex items-center justify-center">
            <form className="w-full max-w-3xl" ref={teacherForm}>
              {error && typeof error === 'string' && (
                <div className="alert alert-error mb-6">
                  <span>{error}</span>
                </div>
              )}
              <fieldset
                disabled={submitting}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="name"
                    defaultValue={teacher.name}
                  />
                  {errorObj?.name && fieldError(errorObj.name[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខកូដ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="code"
                    defaultValue={teacher.code}
                  />
                  {errorObj?.code && fieldError(errorObj.code[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខទូរស័ព្ទ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="phone"
                    defaultValue={teacher.phone}
                  />
                  {errorObj?.phone && fieldError(errorObj.phone[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    មុខវិជ្ជាបង្រៀន
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="subject"
                    defaultValue={teacher.subject || ''}
                  />
                  {errorObj?.subject && fieldError(errorObj.subject[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ភេទ
                  </legend>
                  <select
                    className="select"
                    name="gender"
                    defaultValue={teacher.gender ?? ''}
                  >
                    <option value="FEMALE">ស្រី</option>
                    <option value="MALE">ប្រុស</option>
                  </select>
                  {errorObj?.gender && fieldError(errorObj.gender[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃកំណើត
                  </legend>
                  <input
                    type="date"
                    className="input"
                    name="dob"
                    defaultValue={teacher.dob || ''}
                  />
                  {errorObj?.dob && fieldError(errorObj.dob[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ក្របខណ្ឌ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="krobkan"
                    defaultValue={teacher.krobkan || ''}
                  />
                  {errorObj?.krobkan && fieldError(errorObj.krobkan[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី​ ​១
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="profession1"
                    defaultValue={teacher.profession1 || ''}
                  />
                  {errorObj?.profession1 && fieldError(errorObj.profession1[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី ​២
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="profession2"
                    defaultValue={teacher.profession2 || ''}
                  />
                  {errorObj?.profession2 && fieldError(errorObj.profession2[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឋានន្តរស័ក្ត
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="rank"
                    defaultValue={teacher.rank || ''}
                  />
                  {errorObj?.rank && fieldError(errorObj.rank[0])}
                </div>
              </fieldset>
              <div className="mt-10 flex gap-2">
                <button
                  className="btn btn-primary flex-1"
                  type="button"
                  onClick={() => handleSubmit(teacher)}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      កំពុងកែតម្រូវ...
                    </>
                  ) : (
                    'កែតម្រូវ'
                  )}
                </button>
                <Link to="/admin/teachers" className="btn btn-ghost w-32">
                  ចេញ
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </dialog>
  )
}
