import { Link, useNavigate } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useState } from 'react'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { CreateTeacher, ValidationErrorTeacher } from '~/types/teacher'
import { authApi } from '~/utils/axios'
import { validateCreateTeacher } from '~/zod/teacher'

export const handle = {
  title: 'គ្រូ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export default function CreateTeacherPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ValidationErrorTeacher | string | null>(
    null
  )
  const errorObj = error && typeof error === 'object' ? error : null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const { data, error: validationError } = await validateCreateTeacher(
      formData
    )
    if (!data) {
      setError(validationError)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.post<CreateTeacher>('/teachers', data)
      if (res.status === 201) navigate('/admin/teachers')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorTeacher)
        else if (status === 404) setError('Service not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to create teacher')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link
            to="/admin/teachers"
            className="btn btn-sm btn-square btn-ghost"
          >
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          <div className="pt-6 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl">
              {error && typeof error === 'string' && (
                <div className="alert alert-error mb-6">
                  <span>{error}</span>
                </div>
              )}
              <fieldset
                disabled={loading}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input type="text" className="input w-full" name="name" />
                  {errorObj?.name && fieldError(errorObj.name[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខកូដ
                  </legend>
                  <input type="text" className="input w-full" name="code" />
                  {errorObj?.code && fieldError(errorObj.code[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខទូរស័ព្ទ
                  </legend>
                  <input type="text" className="input w-full" name="phone" />
                  {errorObj?.phone && fieldError(errorObj.phone[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    មុខវិជ្ជាបង្រៀន
                  </legend>
                  <input type="text" className="input w-full" name="subject" />
                  {errorObj?.subject && fieldError(errorObj.subject[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ភេទ
                  </legend>
                  <select className="select" name="gender">
                    <option value="FEMALE">ស្រី</option>
                    <option value="MALE">ប្រុស</option>
                  </select>
                  {errorObj?.gender && fieldError(errorObj.gender[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃកំណើត
                  </legend>
                  <input type="date" className="input" name="dob" />
                  {errorObj?.dob && fieldError(errorObj.dob[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ក្របខណ្ឌ
                  </legend>
                  <input type="text" className="input w-full" name="krobkan" />
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
                  />
                  {errorObj?.profession2 && fieldError(errorObj.profession2[0])}
                </div>
                <div className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឋានន្តរស័ក្ត
                  </legend>
                  <input type="text" className="input w-full" name="rank" />
                  {errorObj?.rank && fieldError(errorObj.rank[0])}
                </div>
              </fieldset>
              <div className="mt-10 flex gap-2">
                <button
                  className="btn btn-primary flex-1"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      កំពុងបង្កើត...
                    </>
                  ) : (
                    'បង្កើត'
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
