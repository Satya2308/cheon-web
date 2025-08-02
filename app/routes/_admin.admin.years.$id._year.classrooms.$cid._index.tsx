import { useLoaderData, useOutletContext } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { Classroom } from '~/types/classroom'
import { Year } from '~/types/year'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  const { id, cid } = params
  if (!id || !cid) throw new Response('Not found', { status: 404 })
  try {
    const classroom = await authApi
      .get<Classroom>(`/years/${id}/classrooms/${cid}`)
      .then((res) => res.data)
    return { classroom }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function ClassroomDetailPage() {
  const { classroom } = useLoaderData<typeof loader>()
  const { year } = useOutletContext<{ year: Year }>()

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <Forehead
          title="ថ្នាក់រៀន"
          backref={`/admin/years/${year.id}/classrooms`}
        />
        <table className="table">
          <tbody className="text-base">
            <tr>
              <td>ថ្នាក់</td>
              <td>{classroom.name}</td>
            </tr>
            <tr>
              <td width="240">គ្រូបន្ទុកថ្នាក់</td>
              <td>{classroom.teacher.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
