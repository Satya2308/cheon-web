import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { format } from 'date-fns'
import { Teacher } from '~/types/teacher'

export const handle = {
  title: 'គ្រូ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  const { id } = params
  if (!id) throw new Response('Not found', { status: 404 })
  try {
    const teacher = await authApi
      .get<Teacher>(`/teachers/${id}`)
      .then((res) => res.data)
    return { teacher }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function TeacherDetailPage() {
  const { teacher } = useLoaderData<typeof loader>()

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <Forehead title="គ្រូ" backref={'/admin/teachers'} />
        <table className="table">
          <tbody className="text-base">
            <tr>
              <td>លេខកូដ</td>
              <td>{teacher.code}</td>
            </tr>
            <tr>
              <td>ឈ្មោះ</td>
              <td>{teacher.name}</td>
            </tr>
            <tr>
              <td width="240">លេខទូរស័ព្ទ</td>
              <td>{teacher.phone}</td>
            </tr>
            <tr>
              <td>ថ្ងៃកំណើត</td>
              <td>
                {teacher.dob
                  ? format(new Date(teacher.dob), 'dd/MM/yyyy')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>មុខវិជ្ជាបង្រៀន</td>
              <td>{teacher.subject ? teacher.subject : '-'}</td>
            </tr>
            <tr>
              <td width="240">ភេទ</td>
              <td>
                {teacher.gender
                  ? { MALE: 'ប្រុស', FEMALE: 'ស្រី' }[teacher.gender]
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>ឯកទេសទី​ ​១</td>
              <td>{teacher.profession1 ? teacher.profession1 : '-'}</td>
            </tr>
            <tr>
              <td>ឯកទេសទី ​២</td>
              <td>{teacher.profession2 ? teacher.profession2 : '-'}</td>
            </tr>
            <tr>
              <td>ឋានន្តរស័ក្ត</td>
              <td>{teacher.rank ? teacher.rank : '-'}</td>
            </tr>
            <tr>
              <td>ក្របខណ្ឌ</td>
              <td>{teacher.krobkan ? teacher.krobkan : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
