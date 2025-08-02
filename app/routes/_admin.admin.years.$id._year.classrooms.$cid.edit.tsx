import {
  Await,
  Form,
  Link,
  useActionData,
  useLoaderData,
  useOutletContext,
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
import { Suspense, useEffect, useRef, useState } from 'react'
import { getFormDataFromObject, getUpdatedFormData } from '~/helpers/form'
import { LoadingUI, toast } from '~/component'
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

export async function loader({ params }: LoaderFunctionArgs) {
  const { id, cid } = params
  if (!id || !cid) throw new Response('Not found', { status: 404 })
  try {
    const classroom = await authApi
      .get<Classroom>(`/years/${id}/classrooms/${cid}`)
      .then((res) => res.data)
    const pendingRes = authApi.get<TeacherSearched[]>('/teachers/firstTwenty')
    const pendingTeachers = pendingRes.then((res) => res.data)
    return { classroom, pendingTeachers }
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
  const { id, cid } = params
  if (!id || !cid) throw new Response('Not found', { status: 404 })
  const payload = await request.formData()
  const { data, error } = await validateUpdateClassroom(payload)
  if (!data) return { error }
  try {
    const res = await authApi.patch<UpdateClassroom>(
      `/years/${id}/classrooms/${cid}`,
      data
    )
    return { message: res.data.message, submittedAt: Date.now() }
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

export default function UpdateClassroomPage() {
  const { classroom, pendingTeachers } = useLoaderData<typeof loader>()
  const { year } = useOutletContext<{ year: Year }>()
  const actionData = useActionData<typeof action>()
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSearched | null>(classroom.teacher)
  const classroomForm = useRef<HTMLFormElement | null>(null)
  const submit = useSubmit()
  const error = actionData?.error
  const errorObj = error && typeof error === 'object' ? error : null

  useEffect(() => {
    if (actionData?.message) toast(actionData?.message)
  }, [actionData?.submittedAt])

  const handleSubmit = (c: Classroom) => {
    const f = classroomForm.current
    if (f) {
      const a = new FormData(f)
      const b = getFormDataFromObject(c)
      const formData = getUpdatedFormData(a, b)
      if (Array.from(formData.keys()).length > 0) {
        submit(formData, {
          action: `/admin/years/${year.id}/classrooms/${classroom.id}/edit`,
          method: 'PATCH',
        })
      }
    }
  }

  return (
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
          <div className="pt-6 flex items-center justify-center">
            <Form
              method="PATCH"
              className="w-full max-w-xl"
              ref={classroomForm}
            >
              <div className="grid grid-cols-1 gap-6">
                <fieldset className="fieldset">
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
                <Suspense fallback={<LoadingUI />}>
                  <Await resolve={pendingTeachers}>
                    {(teachers) => (
                      <fieldset className="fieldset w-2/3">
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
                    )}
                  </Await>
                </Suspense>
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
            </Form>
          </div>
        </main>
      </div>
    </dialog>
  )
}
