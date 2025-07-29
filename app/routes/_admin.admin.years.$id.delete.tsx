import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@vercel/remix'
import axios from 'axios'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id
  if (!id) throw new Response('Not found', { status: 404 })
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

export async function action({ params }: ActionFunctionArgs) {
  const id = params.id
  if (!id) throw new Response('Not found', { status: 404 })
  try {
    const res = await authApi.delete(`/years/${id}`)
    if (res.status === 200) return redirect('/admin/years')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function DeleteYearPage() {
  const { year } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const actionPath = `/admin/years/${year.id}/delete`
  const isSubmitting = navigation.formAction === actionPath

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">
          តើអ្នកប្រាកដទេថាអ្នកចង់លុបឆ្នាំនេះ?
        </h3>
        <p className="my-5">ការលុបមិនអាចត្រឡប់វិញបានទេ។</p>
        <Form method="DELETE" className="flex gap-1 mt-4 justify-end">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={isSubmitting}
            onClick={() => navigate(-1)}
          >
            ចេញ
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex gap-2 items-center">
                <span className="loading loading-spinner" />
                <span>កំពុងលប់...</span>
              </span>
            ) : (
              'លប់'
            )}
          </button>
        </Form>
      </div>
    </div>
  )
}
