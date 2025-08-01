import { Form, Link, useActionData, useNavigate } from '@remix-run/react'
import type { ActionFunctionArgs, MetaFunction } from '@vercel/remix'
import { redirect } from '@vercel/remix'
import axios from 'axios'
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

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData()
  const { data, error } = await validateCreateYear(payload)
  if (!data) return { error }
  try {
    const res = await authApi.post<CreateYear>('/years', data)
    if (res.status === 201) return redirect('/admin/years')
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

export default function CreateYearPage() {
  const actionData = useActionData<typeof action>()
  const error = actionData?.error
  const errorObj = error && typeof error === 'object' ? error : null

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
            <Form method="POST" className="w-full max-w-xl">
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset">
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
            </Form>
          </div>
        </main>
      </div>
    </dialog>
  )
}
