import { Form, Link, useNavigate, useParams } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { authApi } from '~/utils/axios'
import { useEffect, useRef, useState } from 'react'
import { getFormDataFromObject, getUpdatedFormData } from '~/helpers/form'
import { UpdateYear, ValidationErrorYear, Year } from '~/types/year'
import { validateUpdateYear } from '~/zod/year'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function UpdateYearPage() {
  const { id } = useParams()
  const yearForm = useRef<HTMLFormElement | null>(null)
  const [year, setYear] = useState<Year | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<ValidationErrorYear | string | null>(null)
  const errorObj = error && typeof error === 'object' ? error : null
  const navigate = useNavigate()

  useEffect(() => {
    const fetchYear = async () => {
      if (!id) {
        setError('Year ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Year>(`/years/${id}`)
        setYear(res.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Year not found')
          else if (status === 500) setError('Server error occurred')
          else setError('Failed to load year data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchYear()
  }, [id])

  const handleSubmit = async (yearData: Year) => {
    const form = yearForm.current
    if (!form) return
    try {
      setSubmitting(true)
      setError(null)
      const currentFormData = new FormData(form)
      const originalFormData = getFormDataFromObject(yearData)
      const updatedFormData = getUpdatedFormData(
        currentFormData,
        originalFormData
      )
      if (Array.from(updatedFormData.keys()).length === 0) return
      const { data, error: validationError } = await validateUpdateYear(
        updatedFormData
      )
      if (!data) {
        setError(validationError)
        return
      }
      const res = await authApi.patch<UpdateYear>(`/years/${id}`, data)
      if (res.data.message) navigate('/admin/years')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400)
          setError(err.response?.data?.message as ValidationErrorYear)
        else if (status === 404) setError('Year not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to update teacher')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!year) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link to="/admin/years" className="btn btn-sm btn-ghost btn-square">
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
            <form className="w-full max-w-xl" ref={yearForm}>
              {error && typeof error === 'string' && (
                <div className="alert alert-error mb-6">
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset" disabled={submitting}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="name"
                    defaultValue={year.name}
                  />
                  {errorObj?.name && fieldError(errorObj.name[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ប្រភេទ
                  </legend>
                  <select
                    className="select"
                    name="classDuration"
                    defaultValue={year.classDuration ?? ''}
                  >
                    <option value="1_hour">1 ម៉ោង</option>
                    <option value="1_5_hour">1 ម៉ោងកន្លះ</option>
                  </select>
                  {errorObj?.classDuration &&
                    fieldError(errorObj.classDuration[0])}
                </fieldset>
                <fieldset className="fieldset" disabled={submitting}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃចាប់ផ្តើមខ្មែរ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="startDateKh"
                    defaultValue={year.startDateKh}
                  />
                  {errorObj?.startDateKh && fieldError(errorObj.startDateKh[0])}
                </fieldset>
                <fieldset className="fieldset" disabled={submitting}>
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃចាប់ផ្តើមអង្លេស
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    name="startDateEng"
                    defaultValue={year.startDateEng}
                  />
                  {errorObj?.startDateEng &&
                    fieldError(errorObj.startDateEng[0])}
                </fieldset>
                <input type="hidden" name="isActive" value={true.toString()} />
              </div>
              <div className="mt-10 flex gap-2">
                <button
                  className="btn btn-primary flex-1"
                  type="button"
                  onClick={() => handleSubmit(year)}
                  disabled={submitting}
                >
                  កែតម្រូវ
                </button>
                <Link
                  className="btn btn-ghost w-32"
                  to="/admin/years"
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
