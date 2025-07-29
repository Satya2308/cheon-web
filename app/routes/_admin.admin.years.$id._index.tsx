import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { format } from 'date-fns'
import { Teacher } from '~/types/teacher'
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

export default function YearDetailPage() {
  const { year } = useLoaderData<typeof loader>()

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl">
        <Forehead title="ឆ្នាំ" backref={'/admin/years'} />
        <table className="table">
          <tbody className="text-base">
            <tr>
              <td>ឈ្មោះ</td>
              <td>{year.name}</td>
            </tr>
            <tr>
              <td width="240">ប្រភេទថ្នាក់</td>
              <td>
                {year.classDuration
                  ? { "1_hour": '1 ម៉ោង', "1_5_hour": '1 ម៉ោងកន្លះ' }[year.classDuration]
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
