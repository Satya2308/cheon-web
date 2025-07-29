import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from '@remix-run/react'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@vercel/remix'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { authApi } from '~/utils/axios'
import { validateUpdateTeacher } from '~/zod/teacher'
import { useEffect, useRef } from 'react'
import { getFormDataFromObject, getUpdatedFormData } from '~/helpers/form'
import { toast } from '~/component'
import { Teacher, UpdateTeacher, ValidationErrorTeacher } from '~/types/teacher'
import { UpdateYear, ValidationErrorYear, Year } from '~/types/year'
import { validateUpdateYear } from '~/zod/year'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params
  try {
    const year = await authApi
      .get<Year>(`/years/${id}`)
      .then((res) => res.data)
    return { year }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params
  if (!id) throw new Response('Not found', { status: 404 })
  const payload = await request.formData()
  const { data, error } = await validateUpdateYear(payload)
  if (!data) return { error }
  try {
    const res = await authApi.patch<UpdateYear>(`/years/${id}`, data)
    return { message: res.data.message, submittedAt: Date.now() }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 400)
        return { error: err.response?.data?.message as ValidationErrorYear }
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function UpdateYearPage() {
  const { year } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigate = useNavigate()
  const yearForm = useRef<HTMLFormElement | null>(null)
  const submit = useSubmit()
  const error = actionData?.error
  const errorObj = error && typeof error === 'object' ? error : null

  useEffect(() => {
    if (actionData?.message) toast(actionData?.message)
  }, [actionData?.submittedAt])

  const handleSubmit = (t: Year) => {
    const f = yearForm.current
    if (f) {
      const a = new FormData(f)
      const b = getFormDataFromObject(t)
      const formData = getUpdatedFormData(a, b)
      if (Array.from(formData.keys()).length > 0) {
        submit(formData, {
          action: `/admin/years/${t.id}/edit`,
          method: 'PATCH',
        })
      }
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link
            to="/admin/years"
            className="btn btn-sm btn-ghost btn-square"
          >
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          <div className="pt-6 flex items-center justify-center">
            <Form method="PATCH" className="w-full max-w-xl" ref={yearForm}>
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឈ្មោះ"
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
                  {errorObj?.classDuration && fieldError(errorObj.classDuration[0])}
                </fieldset>
                <input type="hidden" name='isActive' value={true.toString()} />
              </div>
              <div className="mt-10 flex gap-2">
                <button
                  className="btn btn-primary flex-1"
                  type="button"
                  onClick={() => handleSubmit(year)}
                >
                  កែតម្រូវ
                </button>
                <button
                  className="btn btn-ghost w-32"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  ចេញ
                </button>
              </div>
            </Form>
          </div>
        </main>
      </div>
    </dialog>
  )
}
