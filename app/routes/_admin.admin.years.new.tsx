import { Link, useNavigate } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import axios from 'axios'
import { useState } from 'react'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { CreateYear, ValidationErrorYear } from '~/types/year'
import { authApi } from '~/utils/axios'
import { validateCreateYear } from '~/zod/year'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function CreateYearPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ValidationErrorYear | string | null>(null)
  const errorObj = error && typeof error === 'object' ? error : null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const { data, error: validationError } = await validateCreateYear(formData)
    if (!data) {
      setError(validationError)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.post<CreateYear>('/years', data)
      if (res.status === 201) navigate('/admin/years')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorYear)
        else if (status === 404) setError('Service not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to create year')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link to="/admin/years" className="btn btn-sm btn-square btn-ghost">
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          <div className="pt-6 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              {error && typeof error === 'string' && (
                <div className="alert alert-error mb-6">
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset" disabled={loading}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input type="text" className="input w-full" name="name" />
                  {errorObj?.name && fieldError(errorObj.name[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ប្រភេទ
                  </legend>
                  <select className="select" name="classDuration">
                    <option value="1_hour">1 ម៉ោង</option>
                    <option value="1_5_hour">1 ម៉ោងកន្លះ</option>
                  </select>
                  {errorObj?.classDuration &&
                    fieldError(errorObj.classDuration[0])}
                </fieldset>
                <fieldset className="fieldset" disabled={loading}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃចាប់ផ្តើមខ្មែរ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="startDateKh"
                  />
                  {errorObj?.startDateKh && fieldError(errorObj.startDateKh[0])}
                </fieldset>
                <fieldset className="fieldset" disabled={loading}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃចាប់ផ្តើមអង្លេស
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="startDateEng"
                  />
                  {errorObj?.startDateEng &&
                    fieldError(errorObj.startDateEng[0])}
                </fieldset>
              </div>
              <div className="mt-10 flex gap-2">
                <button className="btn btn-primary flex-1" type="submit">
                  បង្កើត
                </button>
                <Link
                  to="/admin/years"
                  className="btn btn-ghost w-32"
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
  )
}
