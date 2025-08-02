import { Form, Link, useActionData, useOutletContext } from '@remix-run/react'
import type { ActionFunctionArgs, MetaFunction } from '@vercel/remix'
import { redirect } from '@vercel/remix'
import axios from 'axios'
import { useState } from 'react'
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
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData()
  const { data, error } = await validateCreateClassroom(payload)
  if (!data) return { error }
  try {
    const createUrl = `years/${data.yearId}/classrooms`
    const res = await authApi.post<CreateClassroom>(createUrl, data)
    if (res.status === 201)
      return redirect(`/admin/years/${data.yearId}/classrooms`)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 400)
        return {
          error: err.response?.data?.message as ValidationErrorClassroom,
        }
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function CreateClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSearched | null>(null)
  const actionData = useActionData<typeof action>()
  const error = actionData?.error
  const errorObj = error && typeof error === 'object' ? error : null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link
            to={`/admin/years/${year.id}/classrooms`}
            className="btn btn-sm btn-square btn-ghost"
          >
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          <div className="pt-6 flex items-center justify-center">
            <Form method="POST" className="w-full max-w-2xl">
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset">
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
                    placeholder="ស្វែងរកតាមឈ្មោះ"
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
            </Form>
          </div>
        </main>
      </div>
    </dialog>
  )
}
