import { Form, Link, useActionData, useNavigate } from '@remix-run/react'
import type { ActionFunctionArgs, MetaFunction } from '@vercel/remix'
import { redirect } from '@vercel/remix'
import axios from 'axios'
import fieldError from '~/helpers/fieldError'
import { X } from '~/icons'
import { authApi } from '~/utils/axios'
import { validateCreateTeacher } from '~/zod/teacher'
import { CreateTeacherResponse, ValidationErrorResponse } from './type'

export const handle = {
  title: 'គ្រូ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData()
  const { data, error } = await validateCreateTeacher(payload)
  if (!data) return { error }
  try {
    const res = await authApi.post<CreateTeacherResponse>('/teachers', data)
    if (res.status === 201) return redirect('/admin/teachers')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 400)
        return { error: err.response?.data?.message as ValidationErrorResponse }
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function CreateTeacher() {
  const navigate = useNavigate()
  const actionData = useActionData<typeof action>()
  const error = actionData?.error
  const errorObj = error && typeof error === 'object' ? error : null

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
            <Form method="POST" className="w-full max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឈ្មោះ"
                    name="name"
                  />
                  {errorObj?.name && fieldError(errorObj.name[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខកូដ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="លេខកូដ"
                    name="code"
                  />
                  {errorObj?.code && fieldError(errorObj.code[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខទូរស័ព្ទ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="លេខទូរស័ព្ទ"
                    name="phone"
                  />
                  {errorObj?.phone && fieldError(errorObj.phone[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    មុខវិជ្ជាបង្រៀន
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="មុខវិជ្ជាបង្រៀន"
                    name="subject"
                  />
                  {errorObj?.subject && fieldError(errorObj.subject[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ភេទ
                  </legend>
                  <select className="select" name="gender">
                    <option value="FEMALE">ស្រី</option>
                    <option value="MALE">ប្រុស</option>
                  </select>
                  {errorObj?.gender && fieldError(errorObj.gender[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃកំណើត
                  </legend>
                  <input type="date" className="input" name="dob" />
                  {errorObj?.dob && fieldError(errorObj.dob[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ក្របខណ្ឌ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ក្របខណ្ឌ"
                    name="krobkan"
                  />
                  {errorObj?.krobkan && fieldError(errorObj.krobkan[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី​ ​១
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឯកទេសទី​ ​១"
                    name="profession1"
                  />
                  {errorObj?.profession1 && fieldError(errorObj.profession1[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី ​២
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឯកទេសទី ​២"
                    name="profession2"
                  />
                  {errorObj?.profession2 && fieldError(errorObj.profession2[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឋានន្តរស័ក្ត
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឋានន្តរស័ក្ត"
                    name="rank"
                  />
                  {errorObj?.rank && fieldError(errorObj.rank[0])}
                </fieldset>
              </div>
              <div className="mt-10 flex gap-2">
                <button className="btn btn-primary flex-1" type="submit">
                  បង្កើត
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
